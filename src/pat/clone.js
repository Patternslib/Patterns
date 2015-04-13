/* pat-clone */
define([
    "jquery",
    "pat-parser",
    "pat-registry",
    "pat-base"
], function($, Parser, registry, Base) {
    "use strict";
    var parser = new Parser("clone");
    parser.add_argument("max");
    parser.add_argument("template", ":first");
    parser.add_argument("trigger-element", ".add-clone");
    parser.add_argument("remove-element", ".remove-clone");
    var TEXT_NODE = 3;

    return Base.extend({
        name: "clone",
        trigger: ".pat-clone",

        init: function patCloneInit($el, opts) {
            this.num_clones = 0;
            this.options = parser.parse(this.$el, opts);
            if (this.options.template.lastIndexOf(":", 0) === 0) {
                this.$template = this.$el.find(this.options.template);
            } else {
                this.$template = $(this.options.template);
            }
            $(document).on("click", this.options.triggerElement, this.clone.bind(this));
            this.$el.find(this.options.removeElement).on("click", this.remove.bind(this, this.$el));
        },

        clone: function clone() {
            if (this.num_clones >= this.options.max) {
                alert("Sorry, only "+this.options.max+" elements allowed.");
                return;
            }
            this.num_clones += 1;
            var $clone = this.$template.clone();
            $clone.appendTo(this.$el);
            $clone.children().addBack().contents().addBack().filter(this.incrementValues.bind(this));
            $clone.find(this.options.removeElement).on("click", this.remove.bind(this, $clone));
            $clone.removeAttr("hidden");
            registry.scan($clone);
            if (this.num_clones >= this.options.max) {
                $(this.options.triggerElement).hide();
            }
        },

        incrementValues: function incrementValues(idx, el) {
            var $el = $(el);
            $el.children().addBack().contents().filter(this.incrementValues.bind(this));
            var callback = function (idx, attr) {
                if (!$el.attr(attr.name)) { return; }
                $el.attr(attr.name, $el.attr(attr.name).replace("#{1}", this.num_clones+1));
            };
            if (el.nodeType !== TEXT_NODE) {
                $.each(el.attributes, callback.bind(this));
            } else {
                el.data = el.data.replace("#{1}", this.num_clones+1);
            }
        },

        remove: function remove($el) {
            $el.remove();
            this.num_clones -= 1;
            if (this.num_clones < this.options.max) {
                $(this.options.triggerElement).show();
            }
        }
    });
});
// vim: sw=4 expandtab
