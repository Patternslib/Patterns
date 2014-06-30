define([
    "jquery",
    "pat-logger",
    "pat-registry",
    "pat-utils",
    "pat-inject",
    "Markdown.Converter",
    "Markdown.Sanitizer",
    "Markdown.Extra"
], function($, logger, registry, utils, inject, Markdown, Sanitizer) {
    var log = logger.getLogger("pat.markdown");

    // work around packaging oddities
    Markdown.getSanitizingConverter = Sanitizer.getSanitizingConverter;

    var _ = {
        name: "markdown",
        trigger: ".pat-markdown",

        _url_re: /\.md$/,
        _header_tags: new RegExp(["^<\\/?(a|abbr|acronym|b|bdo|big|button|",
                                  "cite|code|del|dfn|em|i|img|input|ins|kbd|label|map|mark|",
                                  "meter|progress|q|ruby|rp|rt|s|samp|select|small|span|",
                                  "strike|strong|sub|sup|time|tt|u|var|wbr)[^>]*>$"]
            .join(""), "i"),

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
                return tag.match(_._header_tags) ? tag : "";
            });
        },

    _UnescapeSpecialChars: function(text) {
            // Swap back in all the special characters we've hidden.
            text = text.replace(/~E(\d+)E/g,
                function (wholeMatch, m1) {
                    var charCodeToReplace = parseInt(m1, 10);
                    return String.fromCharCode(charCodeToReplace);
                }
            );
            return text;
        },

        _stash: function(text, cache) {
            text=_._UnescapeSpecialChars(text);
            return "\n<p>~PM" + (cache.push(text) - 1) + "PM</p>\n";
        },

        _unstash: function(text, cache) {
            return text.replace(/<p>~PM(\d+)PM<\/p>/g, function(wholeMatch, m1) {
                return cache[parseInt(m1, 10)];
            });
        },

        _rewrapSection: function(text, cache) {
            return text.replace(/<section>(?:.|\n)*<\/section>/gm,
                function (wholeMatch) {
                    wholeMatch = _._unstash(wholeMatch, cache);
                    return _._stash(wholeMatch, cache);
                });
        },

        _renderHtml5Headers: function(text, runBlockGamut, cache) {
            var span_converter = Markdown.getSanitizingConverter();

            text = text.replace(/^(.+)?\s*\n=+\s*\n+((?:.|\n)*?(?=^.*?\n=+\s*$)|(?:.|\n)*)/gm,
                function (wholeMatch, m1, m2) {
                    return "<section>\n" +
                           "  <h1>" + _._renderHeader(span_converter, m1) + "</h1>\n" +
                           runBlockGamut(m2) + "\n" +
                           "</section>";
                }
            );

            text = text.replace(/^(.+)?\s*\n-+\s*\n+((?:.|\n)*?(?=^.*?\n-+\s*$)|(?:.|\n)*)/gm,
                function (wholeMatch, m1, m2) {
                    return "<section>\n" +
                           "  <h1>" + _._renderHeader(span_converter, m1) + "</h1>\n" +
                           runBlockGamut(m2) + "\n" +
                           "</section>";
                }
            );

            text = _._rewrapSection(text, cache);

            var pattern = "^#{@LEVEL@}\\s*([^#].+?)\\s*$\\n+((?:.|\\n)*?(?=^#{1,@LEVEL@}\\s)|.*(?:.|\\n)*)",
                replacer = (function(wholeMatch, m1, m2) {
                    return "<section>\n" +
                           "  <h1>" + _._renderHeader(span_converter, m1) + "</h1>\n" +
                           runBlockGamut(m2) + "\n" +
                           "</section>";
                }
            );
            for (var level=6; level>0; level--) {
                var matcher = new RegExp(pattern.replace(/@LEVEL@/g, level), "gm");
                text = text.replace(matcher, replacer);
                text = _._rewrapSection(text, cache);
            }

            return text;
        },

        _makeConverter: function() {
            // A convertor can not be used in multiple threads at the same
            // time, so create a new one for every rendering.
            var converter = Markdown.getSanitizingConverter(),
                cache = [];
            converter.hooks.chain("preBlockGamut",
                function(text, runBlockGamut) {
                    return _._renderHtml5Headers(text, runBlockGamut, cache);
                });
            converter.hooks.chain("postConversion",
                function(text) {
                    return _._unstash(text, cache);
                });
            Markdown.Extra.init(converter, {extensions: "all"});
            return converter;
        },

        _render: function(text) {
            var $rendering = $("<div/>"),
                converter = _._makeConverter();
            $rendering.html(converter.makeHtml(text));
            return $rendering;
        },

        _extractSection: function(text, header) {
            header=utils.escapeRegExp(header);
            var matcher = new RegExp(
                        "^((#+)\\s*@TEXT@\\s*|@TEXT@\\s*\\n([=-])+\\s*)$".replace(/@TEXT@/g, header), "m"),
                match = matcher.exec(text);
            if (match===null)
                return null;

            var pattern;

            if (match[2]) {
                // We have a ##-style header.
                var level = match[2].length;
                pattern="^#{@LEVEL@}\\s*@TEXT@\\s*$\\n+((?:.|\\n)*?(?=^#{1,@LEVEL@}\\s)|.*(?:.|\\n)*)";
                pattern=pattern.replace(/@LEVEL@/g, level);
            } else if (match[3]) {
                // We have an underscore-style header.
                if (match[3]==="=")
                    pattern="^@TEXT@\\s*\\n=+\\s*\\n+((?:.|\\n)*?(?=^.*?\\n=+\\s*$)|(?:.|\\n)*)";
                else
                    pattern="^@TEXT@\\s*\\n-+\\s*\\n+((?:.|\\n)*?(?=^.*?\\n[-=]+\\s*$)|(?:.|\\n)*)";
            } else {
                log.error("Unexpected section match result", match);
                return null;
            }
            pattern=pattern.replace(/@TEXT@/g, header);
            matcher=new RegExp(pattern, "m");
            match=matcher.exec(text);
            if (match===null)
                log.error("Failed to find section with known present header?");
            return (match!==null) ? match[0] : null;
        }
    };

    // XXX: Hack
    $(document.body).on("patterns-inject-triggered.pat-markdown", "a.pat-inject", function() {
        var $this = $(this), cfgs = $this.data("pat-inject");

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
                if (cfg.source && (header=/^#+\s*(.*)/.exec(cfg.source))!==null) {
                    source=_._extractSection(source, header[1]);
                    if (source===null) {
                        log.warn("Could not find section \"" + cfg.source + "\" in " + cfg.url);
                        return $("<div/>").attr("data-src", cfg.url);
                    }
                    source+="\n";  // Needed for some markdown syntax
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
