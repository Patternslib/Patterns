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
        
        init: function($el, options) {
            return $el.each(function() {
                var $this = $(this),
                    source = $this.is(":input") ? this.value : $this.text();
                    $rendering = _.convert($("<div/>"), source);
                $rendering.replaceAll($this);
            });
        },
        
        convert: function($el, text) {
            var html = converter.makeHtml(text);
            return $el.each(function() {
                $(this).html(html);
            });
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
        sources: function(cfgs, data, ev) {
            var $el = _.convert($("<div/>"), data);
            
            return cfgs.map(function() { return $el; });
        }
    });
    
    registry.register(_);
    return _;
});
