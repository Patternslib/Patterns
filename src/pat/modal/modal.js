import $ from "jquery";
import Parser from "../../core/parser";
import Base from "../../core/base";
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
    },

    _init_handlers() {
        $(document).on(
            "click.pat-modal",
            "#pat-modal .close-panel[type!=submit]",
            this.destroy.bind(this)
        );
        $(document).on(
            "click.pat-modal",
            ".pat-modal .close-panel[type!=submit]",
            this.destroy.bind(this)
        );
        $(document).on(
            "click.pat-modal",
            "#pat-modal .close-panel[type=submit]",
            this.destroy_inject.bind(this)
        );
        $(document).on(
            "click.pat-modal",
            ".pat-modal .close-panel[type=submit]",
            this.destroy_inject.bind(this)
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
        // XXX: This is a hack. When you have a modal inside a
        // modal.max-height, the CSS of the outermost modal affects the
        // innermost .panel-body. By redrawing here, it's fixed.
        //
        // I think ideally the CSS needs to be fixed here, but I need to
        // discuss with Cornelis first.
        if (this.$el.parent().closest(".pat-modal").length > 0) {
            utils.redraw(this.$el.find(".panel-body"));
        }
    },
    destroy() {
        // if working without injection, destroy right away.
        $(document).off(".pat-modal");
        this.$el.remove();
        $("body").removeClass("modal-active");
        $("body").removeClass("modal-panel");
    },
    destroy_inject() {
        if (this.$el.find("form").hasClass("pat-inject")) {
            // if pat-inject in modal form, listen to patterns-inject-triggered and destroy first
            // once that has been triggered
            let destroy_handler = () => {
                $(document).off(".pat-modal");
                this.$el.remove();
                $("body").removeClass("modal-active");
                $("body").removeClass("modal-panel");
                $("body").off("patterns-inject-triggered", destroy_handler);
            };
            $("body").on("patterns-inject-triggered", destroy_handler);
        } else {
            // if working without injection, destroy right away.
            $(document).off(".pat-modal");
            this.$el.remove();
            $("body").removeClass("modal-active");
            $("body").removeClass("modal-panel");
        }
    },
});
