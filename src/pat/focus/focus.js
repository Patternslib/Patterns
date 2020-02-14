/**
* @license
* Patterns @VERSION@ focus - Manage focus class on fieldsets
*
* Copyright 2012 Simplon B.V.
*/

import $ from "jquery";
import { registry } from "patternslib-core";
import { utils } from "patternslib-core";


var focus = {
    name: "focus",

    onNewContent: function() {
        if ($(document.activeElement).is(":input"))
            focus._doFocus(document.activeElement);
    },

    transform: function($root) {
        $root.find(":input[placeholder]").each(function(ix, el) {
            var $relatives = utils.findRelatives(el);
            if (el.placeholder)
                $relatives.attr("data-placeholder", el.placeholder);
        });
        $root.find(":input").each(focus.onChange);
    },

    onFocus: function() {
        focus._doFocus(this);
    },

    _updateHasValue: function(el) {
        var $relatives = utils.findRelatives(el);
        var hv = utils.hasValue(el);

        if (hv) {
            $relatives.addClass("has-value").attr("data-value", el.value);
        } else {
            $relatives
                .filter(function(ix, e) {
                    const inputs = $(":input", e);
                    for (var i = 0; i < inputs.length; i++)
                        if (utils.hasValue(inputs[i])) return false;
                    return true;
                })
                .removeClass("has-value")
                .attr("data-value", null);
        }
    },

    _doFocus: function(el) {
        var $relatives = utils.findRelatives(el);
        $relatives.addClass("focus");
        this._updateHasValue($relatives);
    },

    onBlur: function() {
        var $relatives = utils.findRelatives(this);

        $(document).one("mouseup keyup", function() {
            $relatives
                .filter(":not(:has(:input:focus))")
                .removeClass("focus");
        });
    },

    onChange: function() {
        focus._updateHasValue(this);
    }
};

$(document)
    .on("focus.patterns", ":input", focus.onFocus)
    .on("blur.patterns", ":input", focus.onBlur)
    .on("newContent", focus.onNewContent)
    .on("change.pat-focus keyup.pat-focus", ":input", focus.onChange)
    .on(
        "input.pat-focus",
        ":input[type=range]",
        utils.debounce(focus.onChange, 50)
    );

registry.register(focus);
export default focus;
