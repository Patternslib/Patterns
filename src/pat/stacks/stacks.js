/**
* Stacks pattern
*
* Copyright 2013 Simplon B.V. - Wichert Akkerman
*/
import $ from "jquery";
import Parser from "../../core/parser";
import Base from "../../core/base";
import logging from "../../core/logger";
import utils from "../../core/utils";
import registry from "../../core/registry";

var log = logging.getLogger("stacks"),
    parser = new Parser("stacks");
parser.addArgument("selector", "> *[id]");
parser.addArgument("transition", "none", ["none", "css", "fade", "slide"]);
parser.addArgument("effect-duration", "fast");
parser.addArgument("effect-easing", "swing");

export default Base.extend({
    name: "stacks",
    trigger: ".pat-stacks",
    document: document,

    init: function($el, opts) {
        this.options = parser.parse(this.$el, opts);
        this._setupStack();
        $(this.document).on("click", "a", this._onClick.bind(this));
        return $el;
    },

    _setupStack: function() {
        var selected = this._currentFragment(),
            $sheets = this.$el.find(this.options.selector),
            $visible = [],
            $invisible;
        if ($sheets.length < 2) {
            log.warn(
                "Stacks pattern: must have more than one sheet.",
                this.$el[0]
            );
            return;
        }
        if (selected) {
            try {
                $visible = $sheets.filter("#" + selected);
            } catch (e) {
                selected = undefined;
            }
        }
        if (!$visible.length) {
            $visible = $sheets.first();
            selected = $visible[0].id;
        }
        $invisible = $sheets.not($visible);
        utils.hideOrShow($visible, true, { transition: "none" }, this.name);
        utils.hideOrShow(
            $invisible,
            false,
            { transition: "none" },
            this.name
        );
        this._updateAnchors(selected);
    },

    _base_URL: function() {
        return this.document.URL.split("#")[0];
    },

    _currentFragment: function() {
        var parts = this.document.URL.split("#");
        if (parts.length === 1) {
            return null;
        }
        return parts[parts.length - 1];
    },

    _onClick: function(e) {
        var base_url = this._base_URL(),
            href_parts = e.currentTarget.href.split("#");
        // Check if this is an in-document link and has a fragment
        if (base_url !== href_parts[0] || !href_parts[1]) {
            return;
        }
        if (!this.$el.has("#" + href_parts[1]).length) {
            return;
        }
        e.preventDefault();
        this._updateAnchors(href_parts[1]);
        this._switch(href_parts[1]);
        $(e.target).trigger("pat-update", {
            pattern: "stacks",
            originalEvent: e
        });
    },

    _updateAnchors: function(selected) {
        var $sheets = this.$el.find(this.options.selector),
            base_url = this._base_URL();
        $sheets.each(function(idx, sheet) {
            // This may appear odd, but: when querying a browser uses the
            // original href of an anchor as it appeared in the document
            // source, but when you access the href property you always get
            // the fully qualified version.
            var $anchors = $(
                'a[href="' +
                    base_url +
                    "#" +
                    sheet.id +
                    '"],a[href="#' +
                    sheet.id +
                    '"]'
            );
            if (sheet.id === selected) {
                $anchors.addClass("current");
            } else {
                $anchors.removeClass("current");
            }
        });
    },

    _switch: function(sheet_id) {
        var $sheet = this.$el.find("#" + sheet_id);
        if (!$sheet.length || $sheet.hasClass("visible")) {
            return;
        }
        var $invisible = this.$el.find(this.options.selector).not($sheet);
        utils.hideOrShow($invisible, false, this.options, this.name);
        utils.hideOrShow($sheet, true, this.options, this.name);
    }
});
