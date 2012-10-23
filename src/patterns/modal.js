define([
    'jquery',
    '../logging',
    "../core/parser",
    "../registry",
    "./inject"
], function($, logging, Parser, registry, inject) {
    var log = logging.getLogger('modal'),
        parser = new Parser("modal");

    parser.add_argument("class");

    var modal = {
        // div's are turned into modals
        // links and forms inject modals
        trigger: ".pat-modal",
        init: function($el, opts) {
            return $el.each(function() {
                var $el = $(this),
                    cfg = parser.parse($el, opts);

                if ($el.is('div'))
                    modal._init_div($el, cfg);
                else
                    modal._init_inject($el, cfg);
            });
        },
        _init_inject: function($el, cfg) {
            var opts = {
                target: '#modal',
                "class": "pat-modal" + (cfg["class"] ? " " + cfg["class"] : "")
            };
            inject.init($el, opts);
        },
        _init_div: function($el, cfg) {
            var $first = $el.children(':first'),
                $rest = $el.children(':not(:first)'),
                $header = $('<div class="header" />'),
                $body = $('<div class="body" />'),
                $form = $el.find('form'),
                $closebutton = $(
                    '<button type="button" class="close-panel">Close</button>');

            // separate into header and body
            if ($rest.length === 0) {
                $first.wrap($body);
                $el.prepend($header);
            } else {
                $first.wrap($header);
                $rest.wrapAll($body);
            }

            // add close-panel button to header
            $('.header', $el).append($closebutton);

            // event handler to remove element -- make sure the form
            // is submit and the response processed before calling this.
            var remove = function(ev) {
                if (ev) {
                    ev.preventDefault();
                }
                $(document).off('.pat-modal');
                $el.remove();
            };

            // remove on ESC
            $(document).on('keyup.pat-modal', function(ev) {
                if (ev.which == 27) remove(ev);
            });
            // remove on close-panel button click
            $el.find('.close-panel').on('click.pat-modal', remove);
        }
    };
    registry.register(modal);
    return modal;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
