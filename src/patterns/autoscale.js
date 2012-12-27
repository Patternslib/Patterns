define([
    "jquery",
    "../registry"
], function($, registry) {
    var _ = {
        name: "autoscale",
        trigger: ".pat-auto-scale",
        transform: true,
        
        init: function($el, options) {
            // initialize the elements
            $el.each(_.resizeElement);
        },
        
        resizeElement: function() {
            var $this = $(this),
                scale;
            
            if ($this.tagName.toLowerCase() == 'body') {
                scale = $(window).width()/$this.outerWidth();
            } else {
                scale = $this.parent().outerWidth()/$this.outerWidth();
            }
            
            if (_.transform) {
                $this.css('transform', 'scale(' + scale + ')');
            } else {
                $this.css('zoom', scale);
            }
        },
        
        resizeEvent: function() {
            $(_.trigger).each(_.resizeElement);
        }
    };

    _.transform = $('html').hasClass('csstransforms');
    $(window).resize(_.resizeEvent);

    registry.register(_);
    
    return _;
});
