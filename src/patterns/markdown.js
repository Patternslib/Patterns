define([
    "jquery",
    "../registry",
    "./inject",
    "pagedown_converter",
    "pagedown_sanitizer"
], function($, registry, inject) {
    var _ = {
        name: "markdown",
        trigger: "textarea.pat-markdown",
        url_re: /\.md$/,
        converter: null,
        
        init: function($el, options) {
            var converter = Markdown.getSanitizingConverter();
            
            $el.each(function() {
                var $this = $(this),
                    $el = _.convert($("<div>"), $this.val());
                
                $this.hide().after($el);
            });
        },
        
        convert: function($el, text) {
            _.converter = _.converter || Markdown.getSanitizingConverter();
            
            var html = _.converter.makeHtml(text);
            
            $el.each(function() {
                $(this).html(html);
            });
            
            return $el;
        }
    };
    
    // XXX: Hack
    $('a.pat-inject').on('patterns-inject-triggered.pat-markdown', function() {
        var $this = $(this), cfgs = $this.data('patterns.inject');

        if (_.url_re.test(cfgs[0].url)) {
            cfgs.forEach(function(cfg) {
                cfg.type = 'markdown';
            });
        }
    });
    
    inject.registerTypeHandler('markdown', {
        sources: function(cfgs, data, ev) {
            var $el = _.convert($('<div>'), data);
            
            return cfgs.map(function() { return $el; });
        }
    })
    
    registry.register(_);
    return _;
});