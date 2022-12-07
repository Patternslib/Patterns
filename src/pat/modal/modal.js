import $ from "jquery";
import Base from "../../core/base";
import Parser from "../../core/parser";
import events from "../../core/events";
import inject from "../inject/inject";
import registry from "../../core/registry";
import utils from "../../core/utils";

// Initialize close-panel functionality.
import "../close-panel/close-panel";

export const parser = new Parser("modal");
parser.addArgument("class");
parser.addArgument("closing", ["close-button"], ["close-button", "outside"], true);
parser.addArgument("close-text", "Close");
parser.addArgument("panel-header-content", ":first:not(.header)");
parser.addArgument("source", null); // If not given, the href should specify the source via a url fragment.
parser.addArgument("target", "#pat-modal");

export default Base.extend({
    name: "modal",
    jquery_plugin: true,
    // div's are turned into modals
    // links, forms and subforms inject modals
    trigger: "div.pat-modal, a.pat-modal, form.pat-modal, .pat-modal.pat-subform",

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
        // This will get remote content via pat-inject, add the pat-modal class
        // to the result and pat-inject's pattern scanning will then call
        // ``_init_div1``.

        const opts = {
            ...(this.options.source && { source: this.options.source }),
            target: this.options.target,
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

        inject.init(this.$el, opts);
    },

    _init_div1() {
        // This is always called and will inject the modal in the page.

        const header = document.createElement("div");
        header.setAttribute("class", "header");

        if (this.options.closing.indexOf("close-button") !== -1) {
            header.innerHTML = `<button type="button" class="close-panel">${this.options.closeText}</button>`;
            registry.scan(header, ["close-panel"]); // initialize close-panel
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
        this.$el.children(".panel-content").before(header);
        this.$el.children(this.options.panelHeaderContent).prependTo(header);

        // Restore focus in case the active element was a child of $el and
        // the focus was lost during the wrapping.
        document.activeElement?.focus();

        this._init_handlers();
        this.resize();
        this.setPosition();

        $("body").addClass("modal-active");
        this.el.dispatchEvent(
            new Event("pat-modal-ready", { bubbles: true, cancelable: true })
        );
    },

    _init_handlers() {
        events.add_event_listener(this.el, "close-panel", "pat-modal--close-panel", () =>
            this.destroy()
        );

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
        $(document).off(".pat-modal");
        this.$el.remove();
        $("body").removeClass("modal-active");
        $("body").removeClass("modal-panel");
    },
});
