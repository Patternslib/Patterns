/* pat-clone */
define([
    "jquery",
    "pat-parser",
    "pat-registry",
    "pat-base"
], function($, Parser, registry, Base) {
    var parser = new Parser("clone");
    parser.add_argument("max");
    parser.add_argument("template", ":first");
    parser.add_argument("trigger-element", ".clone-trigger");
    parser.add_argument("remove-element", ".remove-clone");

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
            this.num_clones += 1;
            var $clone = this.$template.clone();
            $clone.find(":contains('#{1}')").addBack(":contains('#{1}')").each(this.incrementValues.bind(this));
            $clone.find(this.options.removeElement).on("click", this.remove.bind(this, $clone));
            $clone.appendTo(this.$el);
        },

        incrementValues: function incrementValues(idx, el) {
            var $el = $(el);
            $el.text($el.text().replace("#{1}", this.num_clones+1));
            if ($el.attr("name")) {
                $el.attr("name", $el.attr("name").replace("1", this.num_clones+1));
            }
            if ($el.attr("value")) {
                $el.attr("value", $el.attr("value").replace("1", this.num_clones+1));
            }
        },

        remove: function remove($el) {
            $el.remove();
        }
    });
});
// vim: sw=4 expandtab
