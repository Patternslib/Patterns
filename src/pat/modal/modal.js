import $ from "jquery";
import Parser from "../../core/parser";
import Base from "../../core/base";
import dom from "../../core/dom";
import utils from "../../core/utils";
import inject from "../inject/inject";

export const parser = new Parser("modal");
parser.addArgument("class");
parser.addArgument("closing", ["close-button"], ["close-button", "outside"], true);
parser.addArgument("close-text", "Close");
parser.addArgument("panel-header-content", ":first:not(.header)");

export default Base.extend({
    name: "modal",
    jquery_plugin: true,
    // div's are turned into modals
    // links, forms and subforms inject modals
    trigger: "div.pat-modal, a.pat-modal, form.pat-modal, .pat-modal.pat-subform",
    els_close_panel: [],
    els_close_panel_submit: [],

    init($el, opts, trigger) {
        if (window.__patternslib_import_styles) {
            import("./_modal.scss");
        }

        this.options = parser.parse(this.$el, opts);
        if (trigger && trigger.type === "injection") {
            $.extend(this.options, parser.parse($(trigger.element), {}, false, false));
        }
        if (this.$el.is("div")) {
            this._init_div1();
        } else {
            this._init_inject1();
        }
    },

    _init_inject1() {
        const opts = {
            target: "#pat-modal",
            class:
                "pat-modal" + (this.options["class"] ? " " + this.options["class"] : ""),
        };
        if (this.options.url) {
            opts.url = this.options.url;
        }
        if (this.options.trigger) {
            opts.trigger = this.options.trigger;
        }
        // if $el is already inside a modal, do not detach #pat-modal,
        // because this would unnecessarily close the modal itself
        if (!this.$el.closest("#pat-modal")) {
            $("#pat-modal").detach();
        }
        this.$el.on("pat-inject-missingSource pat-inject-missingTarget", () => {
            $("#pat-modal").detach();
        });

        this.el.addEventListener("pat-inject-success", () => {
            // Dispatch the pat-modal-ready event after injection is done.
            this.el.dispatchEvent(
                new Event("pat-modal-ready", { bubbles: true, cancelable: true })
            );
        });

        inject.init(this.$el, opts);
    },

    _init_div1() {
        const $header = $("<div class='header' />");
        if (this.options.closing.indexOf("close-button") !== -1) {
            $(
                "<button type='button' class='close-panel'>" +
                    this.options.closeText +
                    "</button>"
            ).appendTo($header);
        }

        // We cannot handle text nodes here
        let $children;
        if (this.options.panelHeaderContent === "none") {
            $children = this.$el.children();
        } else {
            $children = this.$el.children(
                ":last, :not(" + this.options.panelHeaderContent + ")"
            );
        }

        if ($children.length) {
            $children.wrapAll("<div class='panel-content' />");
        } else {
            this.$el.append("<div class='panel-content' />");
        }
        this.$el.children(".panel-content").before($header);
        this.$el.children(this.options.panelHeaderContent).prependTo($header);

        // Restore focus in case the active element was a child of $el and
        // the focus was lost during the wrapping.
        // Only if we have an activeElement, as IE10/11 can have undefined as activeElement
        if (document.activeElement) {
            document.activeElement.focus();
        }
        this._init_handlers();
        this.resize();
        this.setPosition();
        $("body").addClass("modal-active");
        this.el.dispatchEvent(
            new Event("pat-modal-ready", { bubbles: true, cancelable: true })
        );
    },

    _init_handlers() {
        // All .close-panel buttons which are not submit buttons.
        this.els_close_panel = this.el.querySelectorAll(
            ".close-panel:not([type=submit])"
        );

        // All .close-panel buttons which are submit buttons.
        this.els_close_panel_submit = this.el.querySelectorAll(
            ".close-panel[type=submit]"
        );

        for (const _el of this.els_close_panel) {
            dom.add_event_listener(
                _el,
                "click",
                "pat-modal--destroy--trigger",
                this.destroy.bind(this),
                { once: true }
            );
        }

        for (const _el of this.els_close_panel_submit) {
            dom.add_event_listener(
                _el,
                "click",
                "pat-modal--destroy-inject--trigger",
                this.destroy_inject.bind(this),
                { once: true }
            );
        }

        $(document).on("keyup.pat-modal", this._onKeyUp.bind(this));
        if (this.options.closing.indexOf("outside") !== -1) {
            $(document).on("click.pat-modal", this._onPossibleOutsideClick.bind(this));
        }
        $(window).on(
            "resize.pat-modal-position",
            utils.debounce(this.resize.bind(this), 400)
        );
        $(document).on(
            "pat-inject-content-loaded.pat-modal-position",
            "#pat-modal",
            utils.debounce(this.resize.bind(this), 400)
        );
        $(document).on(
            "patterns-injected.pat-modal-position",
            "#pat-modal,div.pat-modal",
            utils.debounce(this.resize.bind(this), 400)
        );
        $(document).on(
            "pat-update.pat-modal-position",
            "#pat-modal,div.pat-modal",
            utils.debounce(this.resize.bind(this), 50)
        );
    },

    _onPossibleOutsideClick(ev) {
        if (this.$el.has(ev.target)) {
            this.destroy();
        }
    },

    _onKeyUp(ev) {
        if (ev.which === 27) {
            this.destroy();
        }
    },

    getTallestChild() {
        let $tallest_child;
        for (const child of $("*", this.$el)) {
            const $child = $(child);
            if (typeof $tallest_child === "undefined") {
                $tallest_child = $child;
            } else if ($child.outerHeight(true) > $tallest_child.outerHeight(true)) {
                $tallest_child = $child;
            }
        }
        return $tallest_child;
    },

    setPosition() {
        this.$el.css("top", ($(window).innerHeight() - this.$el.height()) / 2);
    },

    resize() {
        // reset the height before setting a new one
        this.$el.removeClass("max-height").css("height", "");

        const panel_content_elem = this.$el.find(".panel-content");
        const header_elem = this.$el.find(".header");
        const modal_height =
            panel_content_elem.outerHeight(true) + header_elem.outerHeight(true);
        if (this.$el.height() < modal_height) {
            this.$el.addClass("max-height").css({ height: modal_height + "px" });
            this.setPosition();
        }
    },

    async destroy() {
        await utils.timeout(1); // wait a tick for event handlers (e.g. form submit) have a chance to kick in first.

        for (const _el of this.els_close_panel) {
            dom.remove_event_listener(_el, "pat-modal--destroy--trigger");
        }
        for (const _el of this.els_close_panel_submit) {
            dom.remove_event_listener(_el, "pat-modal--destroy-inject--trigger");
        }

        $(document).off(".pat-modal");
        this.$el.remove();
        $("body").removeClass("modal-active");
        $("body").removeClass("modal-panel");
    },

    destroy_inject() {
        const form = this.el.querySelector("form.pat-inject");
        if (form) {
            // if the modal contains a for mwith pat-inject, wait for injection
            // to be finished and then destroy the modal.
            const destroy_handler = () => {
                this.destroy();
                dom.remove_event_listener(form, "pat-modal--destroy-inject");
            };
            dom.add_event_listener(
                form,
                "pat-inject-success",
                "pat-modal--destroy-inject",
                destroy_handler.bind(this)
            );
        } else {
            // if working without injection, destroy after waiting a tick to let
            // eventually registered on-submit handlers kick in first.
            this.destroy();
        }
    },
});
