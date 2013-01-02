define([
    "jquery",
    "../registry"
], function($, registry) {
    var _ = {
        name: "autoscale",
        trigger: ".pat-auto-scale",
	method: "scale",

        _setup: function() {
            if ($.browser.msie && parseInt($.browser.version, 10)<10)
                _.method="zoom";
            $(window).resize(_.resizeEvent);
        },

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

            switch (_.method) {
            case "scale":
                $this.css('transform', 'scale(' + scale + ')');
                break;
            case "zoom":
                $this.css('zoom', scale);
                break;
            }
            $this.addClass("scaled");
        },

        resizeEvent: function() {
            $(_.trigger).each(_.resizeElement);
        }
    };

    _._setup();
    registry.register(_);
    return _;
});
