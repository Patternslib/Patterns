define([
    "jquery",
    "../core/parser",
    "../registry",
    "./inject"
], function($, Parser, registry, inject) {
    var parser = new Parser("modal");

    parser.add_argument("class");

    var modal = {
        name: "modal",
        jquery_plugin: true,
        // div's are turned into modals
        // links and forms inject modals
        trigger: "div.pat-modal, a.pat-modal, form.pat-modal",
        init: function($el, opts) {
            return $el.each(function() {
                var $el = $(this),
                    cfg = parser.parse($el, opts);

                if ($el.is("div"))
                    modal._init_div1($el, cfg);
                else
                    modal._init_inject1($el, cfg);
            });
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
            var $el = $('div.pat-modal,#pat-modal'),
                maxHeight = window.innerHeight * 0.9;

            if ($el.length === 0) {
                return;
            }

            // set max-height first, then measure and change if necessary
            $el.css('max-height', maxHeight).css('height', '');
            if (maxHeight - $el.outerHeight() < 0) {
                $el.addClass('max-height')
                   .css('height', maxHeight).css('max-height', '');
            } else {
                $el.removeClass('max-height');
            }

            var top = (window.innerHeight - $el.outerHeight()) / 2;
            $el.css('top', top);
        },

        destroy: function($el, ev) {
            if (ev && ev.type === "keyup" && ev.which !== 27)
                return;
            $(document).off(".pat-modal");
            $el.remove();
        }
    };

    $(window).on('resize.pat-modal-position', modal.setPosition);
    $(document).on('patterns-injected.pat-modal-position', '#pat-modal,div.pat-modal',
        modal.setPosition);

    registry.register(modal);
    return modal;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
