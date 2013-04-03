define([
    "jquery",
    "../core/logger",
    "../registry",
    "../utils",
    "./inject",
    "pagedown",
    "pagedown/Markdown.Sanitizer",
    "pagedown-extra"
], function($, logger, registry, utils, inject, Markdown, Sanitizer) {
    var log = logger.getLogger("pat.markdown");
    
    // work around packaging oddities
    Markdown.getSanitizingConverter = Sanitizer.getSanitizingConverter;

    var _ = {
        name: "markdown",
        trigger: ".pat-markdown",

        _url_re: /\.md$/,
        _header_tags: new RegExp(['^<\\/?(a|abbr|acronym|b|bdo|big|button|',
                    'cite|code|del|dfn|em|i|img|input|ins|kbd|label|map|mark|',
                    'meter|progress|q|ruby|rp|rt|s|samp|select|small|span|',
                    ',strike|strong|sub|sup|time|tt|u|var|wbr)[^>]*>$']
            .join(''), 'i'),

        init: function($el) {
            return $el.each(function() {
                var $this = $(this),
                    source = $this.is(":input") ? this.value : $this.text(),
                    $rendering = _._render(source);
                $rendering.replaceAll($this);
            });
        },

        _renderHeader: function(converter, text) {
            // This is essentially a copy of pagedown-extra's convertSpans
            text = text.replace(/~D/g, "$$");
            text = text.replace(/~T/g, "~");
            var html = converter.makeHtml(text);
            return html.replace(/<[^>]*>?/gi, function(tag) {
                return tag.match(_._header_tags) ? tag : '';
            });
        },

        _renderHtml5Headers: function(text, runBlockGamut) {
            var span_converter = Markdown.getSanitizingConverter();

            text = text.replace(/^(.+)?\s*\n=+\s*\n+((?:.|\n)*?(?=^.*?\n=+\s*$)|(?:.|\n)*)/gm,
                function (wholeMatch, m1, m2) {
                    return "<section>\n" +
                           "  <h1>" + _._renderHeader(span_converter, m1) + "</h1>\n" +
                           runBlockGamut(m2) + "\n" +
                           "</section>\n"; }
            );

            text = text.replace(/^(.+)?\s*\n-+\s*\n+((?:.|\n)*?(?=^.*?\n-+\s*$)|(?:.|\n)*)/gm,
                function (wholeMatch, m1, m2) {
                    return "<section>\n" +
                           "  <h1>" + _._renderHeader(span_converter, m1) + "</h1>\n" +
                           runBlockGamut(m2) + "\n" +
                           "</section>\n"; }
            );

            var pattern = "^#{@LEVEL@}\\s*(.+?)\\s*$\\n+((?:.|\\n)*?(?=^#{1,@LEVEL@}\\s)|.*(?:.|\\n)*)",
                replacer = (function(wholeMatch, m1, m2) {
                    return "<section>\n" +
                           "  <h1>" + _._renderHeader(span_converter, m1) + "</h1>\n" +
                           runBlockGamut(m2) + "\n" +
                           "</section>\n";
            });
            for (var level=6; level>0; level--) {
                var matcher = new RegExp(pattern.replace(/@LEVEL@/g, level), "gm");
                text = text.replace(matcher, replacer);
            }
            return text;
        },

        _makeConverter: function() {
            // A convertor can not be used in multiple threads at the same
            // time, so create a new one for every rendering.
            var converter = Markdown.getSanitizingConverter();
            converter.hooks.chain("preBlockGamut", _._renderHtml5Headers);
            Markdown.Extra.init(converter, {extensions: "all"});
            return converter;
        },

        _render: function(text) {
            var $rendering = $("<div/>"),
                converter = _._makeConverter();
            $rendering.html(converter.makeHtml(text));
            return $rendering;
        }
    };

    // XXX: Hack
    $(document.body).on("patterns-inject-triggered.pat-markdown", "a.pat-inject", function() {
        var $this = $(this), cfgs = $this.data("patterns.inject");

        if (_._url_re.test(cfgs[0].url)) {
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
