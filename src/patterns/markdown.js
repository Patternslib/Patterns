define([
    "jquery",
    "../registry",
    "./inject",
    "pagedown_converter",
    "pagedown_sanitizer"
], function($, registry, inject) {
    var converter = Markdown.getSanitizingConverter();

    var _ = {
        name: "markdown",
        trigger: ".pat-markdown",
        url_re: /\.md$/,

        init: function($el) {
            return $el.each(function() {
                var $this = $(this),
                    source = $this.is(":input") ? this.value : $this.text(),
                    $rendering = _._render(source);
                $rendering.replaceAll($this);
            });
        },

        _render: function(text) {
            var $rendering = $("<div/>");
            $rendering.html(converter.makeHtml(text));
            return $rendering;
        }
    };

    // XXX: Hack
    $("a.pat-inject").on("patterns-inject-triggered.pat-markdown", function() {
        var $this = $(this), cfgs = $this.data("patterns.inject");

        if (_.url_re.test(cfgs[0].url)) {
            cfgs.forEach(function(cfg) {
                cfg.data.type = "markdown";
            });
        }
    });

    inject.registerTypeHandler("markdown", {
        sources: function(cfgs, data) {
            var $rendering = _._render(data);
            return cfgs.map(function() { return $rendering; });
        }
    });

    registry.register(_);
    return _;
});
