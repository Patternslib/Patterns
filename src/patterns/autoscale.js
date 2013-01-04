define([
    "jquery",
    "../registry",
    "../core/parser"
], function($, registry, Parser) {
    var parser = new Parser("auto-scale");
    parser.add_argument("method", "scale", ["scale", "zoom"]);

    var _ = {
        name: "autoscale",
        trigger: ".pat-auto-scale",
        force_method: null,

        _setup: function() {
            if ($.browser.mozilla)
                _.force_method="scale";
            else if ($.browser.msie && parseInt($.browser.version, 10)<10)
                _.force_method="zoom";
            $(window).on("resize.autoscale", _.onResize);
        },

        init: function($el, opts) {
            return $el.each(function() {
                var $el = $(this),
                    method = _.force_method;
                if (method===null) {
                    var options = parser.parse($el, opts);
                    method=options.method;
                    $el.data("patterns.auto-scale", method);
                }
                _.scale.apply(this, []);
            });
        },

        scale: function() {
            var $el = $(this),
                method = _.force_method,
                scale;

            if ($el[0].tagName.toLowerCase()==="body")
                scale = $(window).width()/$el.outerWidth();
            else
                scale = $el.parent().outerWidth()/$el.outerWidth();

            if (method===null)
                method=$el.data("patterns.auto-scale");
            switch (method) {
            case "scale":
                $el.css("transform", "scale(" + scale + ")");
                break;
            case "zoom":
                $el.css("zoom", scale);
                break;
            }
            $el.addClass("scaled");
        },

        onResize: function() {
            $(_.trigger).each(_.scale);
        }
    };

    _._setup();
    registry.register(_);
    return _;
});
