define([
    "jquery",
    "../core/logger",
    "../registry",
    "../utils",
    "./inject",
    "pagedown",
    "pagedown-extra"
], function($, logger, registry, utils, inject) {
    var log = logger.getLogger("pat.markdown");

    var converter = Markdown.getSanitizingConverter("html5");
    Markdown.Extra.init(converter, {extensions: "all"});

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
    $(document.body).on("patterns-inject-triggered.pat-markdown", "a.pat-inject", function() {
        var $this = $(this), cfgs = $this.data("patterns.inject");

        if (_.url_re.test(cfgs[0].url)) {
            cfgs.forEach(function(cfg) {
                cfg.dataType = "markdown";
            });
        }
    });

    inject.registerTypeHandler("markdown", {
        sources: function(cfgs, data) {
            var $rendering, source, header;
            return cfgs.map(function(cfg) {
                source = data;
                if (cfg.source && (header=/^(#+)\s+(.*)/.exec(cfg.source)) !== null) {
                    var level = header[1].length,
                        text = utils.escapeRegExp(header[2]),
                        matcher = "^#{@LEVEL@}\\s*@TEXT@((?:.|\\n)*?(?=^#{1,@LEVEL@}[^#])|.*(?:.|\\n)*)";
                    matcher = matcher.replace(/@LEVEL@/g, level).replace(/@TEXT@/g, text);
                    matcher = new RegExp(matcher, "m");
                    source = matcher.exec(source);
                    if (source === null) {
                        log.warn("Could not find section \"" + cfg.source + "\" in " + cfg.url);
                        return $("<div/>").attr("data-src", cfg.url);
                    }
                    source = source[0]+"\n";  // Needed for some markdown syntax
                }
                $rendering = _._render(source);
                $rendering.attr("data-src", cfg.source ? cfg.url+cfg.source : cfg.url);
                return $rendering;
            });
        }
    });

    registry.register(_);
    return _;
});
