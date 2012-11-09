define([
    'jquery',
    '../core/logging',
    "../core/parser",
    "../registry",
    "./inject"
], function($, logging, Parser, registry, inject) {
    var log = logging.getLogger('modal'),
        parser = new Parser("modal");

    parser.add_argument("class");

    var modal = {
        name: "modal",
        // div's are turned into modals
        // links and forms inject modals
        trigger: "div.pat-modal, a.pat-modal, form.pat-modal",
        init: function($el, opts) {
            return $el.each(function() {
                var $el = $(this),
                    cfg = parser.parse($el, opts);

                if ($el.is('div'))
                    modal._init_div1($el, cfg);
                else
                    modal._init_inject1($el, cfg);
            });
        },
        _init_inject1: function($el, cfg) {
            var opts = {
                target: '#pat-modal',
                "class": "pat-modal" + (cfg["class"] ? " " + cfg["class"] : "")
            };
            $('#pat-modal').detach();
            inject.init($el, opts);
        },
        _init_div1: function($el, cfg) {
            var $header = $('<div class="header" />'),
                $button = $(
                    '<button type="button" class="close-panel">Close</button>'
                ).appendTo($header);

            // We cannot handle text nodes here
            $el.children(':last, :not(:first)')
                .wrapAll('<div class="panel-content" />');
            $('.panel-content', $el).before($header);
            $el.children(':first:not(.header)').prependTo($header);

            // event handlers remove modal - first arg to bind is ``this``
            $(document).on('click.pat-modal', '.close-panel',
                           modal.destroy.bind($el, $el));
            // remove on ESC
            $(document).on('keyup.pat-modal',
                           modal.destroy.bind($el, $el));
        },
        destroy: function($el, ev) {
            if (ev && ev.type === "keyup" && ev.which !== 27)
                return;
            $(document).off('.pat-modal');
            $el.remove();
        }
    };
    registry.register(modal);
    return modal;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
