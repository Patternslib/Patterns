/* pat-sticky - A pattern for a sticky polyfill */
define([
    "underscore",
    "pat-parser",
    "pat-registry",
    "pat-base",
    "pat-logger",
    "stickyfilljs",
], function(_, Parser, registry, Base, logger, Stickyfill) {
    "use strict";
    var parser = new Parser("sticky");
    var log = logger.getLogger("sticky")
    parser.addArgument("selector", "");

    return Base.extend({
        name: "sticky",
        trigger: ".pat-sticky",
        init: function() {
            this.options = parser.parse(this.$el);
            this.makeSticky();
            this.$el.on('pat-update', this.onPatternUpdate.bind(this));
            return this.$el;
        },
        onPatternUpdate: function (ev, data) {
            /* Handler which gets called when pat-update is triggered within
             * the .pat-sticky element.
             */
            this.makeSticky();
            return true;
        },
        makeSticky: function() {
            if (this.options.selector === "") {
                this.$stickies = this.$el;
            } else {
                this.$stickies = this.$el.find(this.options.selector);
            }
            this.$stickies.each(function (idx, elem) {
                Stickyfill.add(elem);
            });
        }
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
