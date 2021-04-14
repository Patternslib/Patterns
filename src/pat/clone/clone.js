/* Clone pattern */
import $ from "jquery";
import Parser from "../../core/parser";
import registry from "../../core/registry";
import Base from "../../core/base";
import logging from "../../core/logging";
import dom from "../../core/dom";
import utils from "../../core/utils";

const log = logging.getLogger("pat-clone");
const TEXT_NODE = 3;

export const parser = new Parser("clone");
parser.addArgument("max");
parser.addArgument("template", ":first");
parser.addArgument("trigger-element", ".add-clone");
parser.addArgument("remove-element", ".remove-clone");
parser.addArgument("remove-behaviour", "confirm", ["confirm", "none"]);
parser.addArgument(
    "remove-confirmation",
    "Are you sure you want to remove this element?"
);
parser.addArgument("clone-element", ".clone");
parser.addAlias("remove-behavior", "remove-behaviour");

export default Base.extend({
    name: "clone",
    trigger: ".pat-clone",

    init() {
        this.options = parser.parse(this.el, this.options);
        if (this.options.template.lastIndexOf(":", 0) === 0) {
            this.template = $(this.options.template, this.el)[0];
        } else {
            this.template = document.querySelector(this.options.template);
        }

        this.bind_trigger(document.body);

        const clones = this.el.querySelectorAll(this.options.cloneElement);
        this.num_clones = clones.length;
        for (const clone of clones) {
            this.bind_remove(clone);
        }
    },

    clone() {
        if (this.num_clones >= this.options.max) {
            alert("Sorry, only " + this.options.max + " elements allowed.");
            return;
        }
        this.num_clones += 1;

        let $clone =
            this.template.nodeName === "TEMPLATE"
                ? $([...this.template.content.children]).clone()
                : $(this.template).safeClone();

        const ids = ($clone.attr("id") || "").split(" ").filter((it) => it);
        $clone.removeAttr("id").removeClass("cant-touch-this");
        $.each(
            ids,
            function (idx, id) {
                // Re-add all ids that have the substring #{1} in them, while
                // also replacing that substring with the number of clones.
                if (id.indexOf("#{1}") !== -1) {
                    $clone.attr(
                        "id",
                        $clone.attr("id")
                            ? $clone.attr("id") + " "
                            : "" + id.replace("#{1}", this.num_clones)
                    );
                }
            }.bind(this)
        );

        $clone.appendTo(this.$el);
        $clone
            .children()
            .addBack()
            .contents()
            .addBack()
            .filter(this.incrementValues.bind(this));

        this.bind_trigger($clone);
        this.bind_remove($clone);

        $clone.prop("hidden", false);
        registry.scan($clone);

        $clone.trigger("pat-update", {
            pattern: "clone",
            action: "clone",
            $el: $clone,
        });
        if (this.num_clones >= this.options.max) {
            for (const el_ of this.clone_triggers) {
                dom.hide(el_);
            }
        }
    },

    incrementValues(idx, el) {
        const $el = $(el);
        $el.children()
            .addBack()
            .contents()
            .filter(this.incrementValues.bind(this));
        const callback = function (idx, attr) {
            if (attr.name === "type" || !$el.attr(attr.name)) {
                return;
            }
            try {
                $el.attr(
                    attr.name,
                    $el.attr(attr.name).replace("#{1}", this.num_clones)
                );
            } catch (e) {
                log.warn(e);
            }
        };
        if (el.nodeType !== TEXT_NODE) {
            $.each(el.attributes, callback.bind(this));
        } else if (el.data.length) {
            el.data = el.data.replace("#{1}", this.num_clones);
        }
    },

    bind_trigger(triggers) {
        // Bind clone trigger
        for (const node of utils.ensureArray(triggers)) {
            for (const trigger of dom.querySelectorAllAndMe(
                node,
                this.options.triggerElement
            )) {
                trigger.addEventListener("click", () => this.clone());
            }
        }
    },

    bind_remove(clone) {
        for (const node of utils.ensureArray(clone)) {
            for (const remove_button of dom.querySelectorAllAndMe(
                node,
                this.options.remove.element
            )) {
                remove_button.addEventListener("click", () => {
                    if (this.options.remove.behaviour === "confirm") {
                        if (
                            window.confirm(this.options.remove.confirmation) ===
                            true
                        ) {
                            this.remove(clone);
                        }
                    } else {
                        this.remove(clone);
                    }
                });
            }
        }
    },

    remove(clone) {
        for (const node of utils.ensureArray(clone)) {
            node.remove();
            this.$el.trigger("pat-update", {
                pattern: "clone",
                action: "remove",
                $el: $(node), // used by pat-sortable only.
            });
        }
        this.num_clones -= 1;
        if (this.num_clones < this.options.max) {
            for (const el_ of this.clone_triggers) {
                dom.show(el_);
            }
        }
    },
});
