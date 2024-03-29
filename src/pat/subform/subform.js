/**
 * Patterns subform - scoped submission of form content
 *
 * Copyright 2013 Marko Durkovic
 */
import $ from "jquery";
import ajax from "../ajax/ajax";
import Base from "../../core/base";
import events from "../../core/events";
import inject from "../inject/inject";
import logging from "../../core/logging";

const log = logging.getLogger("subform");

export default Base.extend({
    name: "subform",
    trigger: ".pat-subform",

    init($el) {
        events.add_event_listener(
            $el[0],
            "submit",
            "pat-subform--submit",
            this.submit.bind(this)
        );
        $el.find("input").on("keyup keypress keydown", this.keyboard_handler.bind(this));
        $el.find("button[type=submit]").on("click", this.submitClicked.bind(this));
    },

    destroy($el) {
        events.remove_event_listener($el[0], "pat-subform--submit");
    },

    scopedSubmit($el) {
        const $form = $el.parents("form");
        const $exclude = $form.find(":input").filter(function () {
            return !$(this).is($el.find("*"));
        });
        // make other controls "unsuccessful"
        log.debug("Hiding unwanted elements from submission.");
        const names = $exclude.map(function () {
            const name = $(this).attr("name");
            return name ? name : 0;
        });
        $exclude.each(function () {
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
        $exclude.each(function (i) {
            if (names[i]) {
                $(this).attr("name", names[i]);
            }
        });
    },

    submit(ev) {
        ev.stopPropagation();
        const $this = $(ev.target);
        const $button = $this.find("button[type=submit][formaction]").first();
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
        const $subform = $(ev.target).parents(".pat-subform");
        if (!$subform.is(".pat-autosubmit")) {
            return;
        }
        $subform[0].dispatchEvent(events.submit_event());
    },

    submitClicked(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        ajax.onClickSubmit(ev); // make sure the submitting button is sent with the form

        const $button = $(ev.target);
        const $sub = $button.parents(".pat-subform").first();
        const formaction = $button.attr("formaction");

        if (formaction) {
            // override the default action and restore afterwards
            if ($sub.is(".pat-inject")) {
                const previousValue = $sub.data("pat-inject");
                $sub.data("pat-inject", inject.extractConfig($sub, { url: formaction }));
                this.scopedSubmit($sub);
                $sub.data("pat-inject", previousValue);
            } else if ($sub.is(".pat-modal")) {
                $sub.data("pat-inject", [
                    $.extend($sub.data("pat-inject")[0], {
                        url: formaction,
                    }),
                ]);
                this.scopedSubmit($sub);
            } else {
                $sub.parents("form").attr("action", formaction);
                this.scopedSubmit($sub);
            }
        } else {
            this.scopedSubmit($sub);
        }
    },
});
