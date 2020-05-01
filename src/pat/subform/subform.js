/**
* Patterns subform - scoped submission of form content
*
* Copyright 2013 Marko Durkovic
*/
import $ from "jquery";
import Base from "../../core/base";
import logging from "../../core/logging";
import ajax from "../ajax/ajax";

var log = logging.getLogger("subform");

export default Base.extend({
    name: "subform",
    trigger: ".pat-subform",

    init($el) {
        $el.submit(this.submit.bind(this));
        $el.find("input").on(
            "keyup keypress keydown",
            this.keyboard_handler.bind(this)
        );
        $el.find("button[type=submit]").on("click", this.submitClicked);
    },

    destroy($el) {
        $el.off("submit");
    },

    scopedSubmit($el) {
        var $form = $el.parents("form"),
            $exclude = $form.find(":input").filter(function() {
                return !$(this).is($el.find("*"));
            });
        // make other controls "unsuccessful"
        log.debug("Hiding unwanted elements from submission.");
        var names = $exclude.map(function() {
            var name = $(this).attr("name");
            return name ? name : 0;
        });
        $exclude.each(function() {
            $(this).attr("name", "");
        });
        if ($el.is(".pat-inject") || $el.is(".pat-modal")) {
            inject.submitSubform($el);
        } else {
            // use the native handler, since there could be event handlers
            // redirecting to inject/ajax.
            $form[0].submit();
        }
        // reenable everything
        log.debug("Restoring previous state.");
        $exclude.each(function(i) {
            if (names[i]) {
                $(this).attr("name", names[i]);
            }
        });
    },

    submit(ev) {
        ev.stopPropagation();
        var $this = $(ev.target),
            $button = $this.find("button[type=submit][formaction]").first();
        if ($button.length) {
            $button.trigger("click");
        } else {
            this.scopedSubmit($this);
        }
    },

    keyboard_handler(ev) {
        // If the user presses the enter key and
        // we have an autosubmit form trigger the subform submission
        if (ev.keyCode != 13) {
            return;
        }
        var $subform = $(ev.target).parents(".pat-subform");
        if (!$subform.is(".pat-autosubmit")) {
            return;
        }
        return $subform.submit();
    },

    submitClicked(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        ajax.onClickSubmit(ev); // make sure the submitting button is sent with the form

        var $button = $(ev.target),
            $sub = $button.parents(".pat-subform").first(),
            formaction = $button.attr("formaction");

        if (formaction) {
            // override the default action and restore afterwards
            if ($sub.is(".pat-inject")) {
                var previousValue = $sub.data("pat-inject");
                $sub.data(
                    "pat-inject",
                    inject.extractConfig($sub, { url: formaction })
                );
                this.scopedSubmit($sub);
                $sub.data("pat-inject", previousValue);
            } else if ($sub.is(".pat-modal")) {
                $sub.data("pat-inject", [
                    $.extend($sub.data("pat-inject")[0], {
                        url: formaction
                    })
                ]);
                this.scopedSubmit($sub);
            } else {
                $sub.parents("form").attr("action", formaction);
                this.scopedSubmit($sub);
            }
        } else {
            this.scopedSubmit($sub);
        }
    }
});
