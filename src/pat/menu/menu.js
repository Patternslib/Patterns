define([
    "pat-base",
    "pat-parser",
    "jquery",
], function(Base, Parser, $) {

    var parser = new Parser('menu');

    parser.addArgument('nav-item-selector', 'li'); // CSS Selector for navigation items.

    return Base.extend({
        name: "menu",
        trigger: ".pat-menu",

        timer: null,

        init: function($el, opts) {
            this.options = parser.parse(this.$el, opts);
            var self = this;
            $el.find(this.options.navItemSelector).each(function() {
                var $it = $(this);
                $it.addClass("closed")
                    .on("mouseover", self.mouseOverHandler.bind(self))
                    .on("mouseout", self.mouseOutHandler.bind(self));
                if($it.children(self.options.navItemSelector).length > 0) {
                    $it.addClass("hasChildren");
                };
            });
        },

        openMenu: function(it) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            it = $(it);
            if (!it.hasClass("open")) {
                it.siblings(".open").each(function() { this.closeMenu(this.$el);}.bind(this));
                it.addClass("open").removeClass("closed");
            }
        },

        closeMenu: function(it) {
            $(it).find(".open").addBack().removeClass("open").addClass("closed");
        },

        mouseOverHandler: function(ev) {
            this.openMenu(ev.target);
        },

        mouseOutHandler: function(ev) {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.timer = setTimeout(function() { this.closeMenu(ev.target); }.bind(this), 1000);
        }

    });
});
