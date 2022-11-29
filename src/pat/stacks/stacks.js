import $ from "jquery";
import Parser from "../../core/parser";
import Base from "../../core/base";
import logging from "../../core/logging";
import utils from "../../core/utils";

const log = logging.getLogger("stacks");

export const parser = new Parser("stacks");
parser.addArgument("selector", "> *[id]");
parser.addArgument("transition", "none", ["none", "css", "fade", "slide"]);
parser.addArgument("effect-duration", "fast");
parser.addArgument("effect-easing", "swing");

export default Base.extend({
    name: "stacks",
    trigger: ".pat-stacks",
    document: document,

    init($el, opts) {
        this.options = parser.parse(this.$el, opts);
        this._setupStack();
        $(this.document).on("click", "a", this._onClick.bind(this));
        return $el;
    },

    _setupStack() {
        let selected = this._currentFragment();
        const $sheets = this.$el.find(this.options.selector);
        let $visible = [];

        if ($sheets.length < 2) {
            log.warn("Stacks pattern: must have more than one sheet.", this.$el[0]);
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
        const $invisible = $sheets.not($visible);
        utils.hideOrShow($visible, true, { transition: "none" }, this.name);
        utils.hideOrShow($invisible, false, { transition: "none" }, this.name);
        this._updateAnchors(selected);
    },

    _base_URL() {
        return this.document.URL.split("#")[0];
    },

    _currentFragment() {
        const parts = this.document.URL.split("#");
        if (parts.length === 1) {
            return null;
        }
        return parts[parts.length - 1];
    },

    _onClick(e) {
        const base_url = this._base_URL();
        const href_parts = e.currentTarget.href.split("#");
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
            originalEvent: e,
        });
    },

    _updateAnchors(selected) {
        const $sheets = this.$el.find(this.options.selector);
        const base_url = this._base_URL();
        $sheets.each(function (idx, sheet) {
            // This may appear odd, but: when querying a browser uses the
            // original href of an anchor as it appeared in the document
            // source, but when you access the href property you always get
            // the fully qualified version.
            var $anchors = $(
                'a[href="' + base_url + "#" + sheet.id + '"],a[href="#' + sheet.id + '"]'
            );
            if (sheet.id === selected) {
                $anchors.addClass("current");
            } else {
                $anchors.removeClass("current");
            }
        });
    },

    _switch(sheet_id) {
        const $sheet = this.$el.find("#" + sheet_id);
        if (!$sheet.length || $sheet.hasClass("visible")) {
            return;
        }
        const $invisible = this.$el.find(this.options.selector).not($sheet);
        utils.hideOrShow($invisible, false, this.options, this.name);
        utils.hideOrShow($sheet, true, this.options, this.name);
    },
});
