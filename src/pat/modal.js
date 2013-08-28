define([
    "jquery",
    "../core/parser",
    "../registry",
    "../utils",
    "./inject"
], function($, Parser, registry, utils, inject) {
    var parser = new Parser("modal");

    parser.add_argument("class");

    var modal = {
        name: "modal",
        jquery_plugin: true,
        // div's are turned into modals
        // links and forms inject modals
        trigger: "div.pat-modal, a.pat-modal, form.pat-modal",
        init: function($el, opts) {
            if ($el.length > 1) {
                // We enforce a one-to-one mapping between modal objects and
                // DOM elements, so here we recurse and instantiate a new modal
                // for each $el
                $el.each(function() {
                    $(this).modal();
                });
            } else if ($el.length === 1) {
                var cfg = parser.parse($el, opts);
                this.$el = $el;
                if ($el.is("div"))
                    modal._init_div1($el, cfg);
                else
                    modal._init_inject1($el, cfg);
            }
        },

        _init_inject1: function($el, cfg) {
            var opts = {
                target: "#pat-modal",
                "class": "pat-modal" + (cfg["class"] ? " " + cfg["class"] : "")
            };
            // if $el is already inside a modal, do not detach #pat-modal,
            // because this would unnecessarily close the modal itself
            if (!$el.closest("#pat-modal")) {
                $("#pat-modal").detach();
            }
            inject.init($el, opts);
        },

        _init_div1: function($el) {
            var $header = $("<div class='header' />"),
                activeElement = document.activeElement;

            $("<button type='button' class='close-panel'>Close</button>").appendTo($header);

            // We cannot handle text nodes here
            $el.children(":last, :not(:first)")
                .wrapAll("<div class='panel-content' />");
            $(".panel-content", $el).before($header);
            $el.children(":first:not(.header)").prependTo($header);

            // Restore focus in case the active element was a child of $el and
            // the focus was lost during the wrapping.
            activeElement.focus();

            // event handlers remove modal - first arg to bind is ``this``
            $(document).on("click.pat-modal", ".close-panel",
                           modal.destroy.bind($el, $el));
            // remove on ESC
            $(document).on("keyup.pat-modal",
                           modal.destroy.bind($el, $el));

            modal.setPosition();
        },

        setPosition: function() {
            if ((this.$el === undefined) || (this.$el.length === 0)) {
                return;
            }

            var $oldClone = $('#pat-modal-clone');
            if ($oldClone.length > 0) {
                $oldClone.remove();
            }

            var $clone = this.$el.clone();

            $clone
                .attr('id', 'pat-modal-clone')
                .css({
                    'visibility': 'hidden',
                    'position': 'absolute',
                    'height': ''
                }).appendTo('body');

            // wait for browser to update DOM
            setTimeout($.proxy(modal.measure, this), 0);
        },

        measure: function() {
            var $clone = $('#pat-modal-clone');
            if ($clone.length === 0) {
                return;
            }

            var maxHeight = $(window).innerHeight() - $clone.outerHeight(true) +
                            $clone.outerHeight(),
                height = $clone.outerHeight();

            $clone.remove();

            if (maxHeight - height < 0) {
                this.$el.addClass('max-height').css('height', maxHeight);
            } else {
                this.$el.removeClass('max-height').css('height', '');
            }

            var top = ($(window).innerHeight() - this.$el.outerHeight(true)) / 2;
            this.$el.css('top', top);
        },

        destroy: function($el, ev) {
            if (ev && ev.type === "keyup" && ev.which !== 27)
                return;
            $(document).off(".pat-modal");
            $el.remove();
        }
    };

    $(window).on('resize.pat-modal-position', $.proxy(modal.setPosition, modal));
    $(window).on('pat-inject-content-loaded.pat-modal-position', '#pat-modal',
        $.proxy(modal.setPosition, modal));
    $(document).on('patterns-injected.pat-modal-position', '#pat-modal,div.pat-modal',
        $.proxy(modal.setPosition, modal));

    registry.register(modal);
    return modal;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
