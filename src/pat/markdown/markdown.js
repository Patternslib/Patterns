define([
    "jquery",
    "pat-logger",
    "pat-registry",
    "pat-utils",
    "pat-inject",
    "showdown",
    "showdown-github",
    "showdown-prettify",
    "showdown-table"
], function($, logger, registry, utils, inject, Showdown) {
    var log = logger.getLogger("pat.markdown");

    var _ = {
        name: "markdown",
        trigger: ".pat-markdown",
        _url_re: /\.md$/,

        init: function($el) {
            return $el.each(function() {
                var $this = $(this),
                    source = $this.is(":input") ? this.value : $this.text(),
                    $rendering = _._render(source);
                $rendering.replaceAll($this);
            });
        },

        _makeConverter: function() {
            // A convertor can not be used in multiple threads at the same
            // time, so create a new one for every rendering.
            return new Showdown.converter({extensions: ['table', 'prettify', 'github']});
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
