define([
    "jquery",
    "../registry"
], function($, registry) {
    var _ = {
        name: "autoscale",
        trigger: ".pat-auto-scale",
	transform: $('html').hasClass('csstransforms'),

        init: function($el, options) {
            return $el.each(_.resizeElement);
        },

        resizeElement: function() {
            var $this = $(this),
                scale;

            if (this.tagName.toLowerCase()==='body')
                scale = $(window).width()/$this.outerWidth();
            else
                scale = $this.parent().outerWidth()/$this.outerWidth();

            if (_.transform)
                $this.css('transform', 'scale(' + scale + ')');
            else
                $this.css('zoom', scale);
        },

        resizeEvent: function() {
            $(_.trigger).each(_.resizeElement);
        }
    };

    $(window).resize(_.resizeEvent);
    registry.register(_);
    return _;
});
