/* Patterns selectbox - Expose select option for (un)checking. */
import $ from "jquery";
import Base from "../../core/base";
import dom from "../../core/dom";

const KEY_RESET = "__patternslib__pat_selectbox__reset";

export default Base.extend({
    name: "selectbox",
    trigger: ".pat-select",
    all_selects: [],

    init(el) {
        el = dom.jqToNode(el);

        if (el.form && !el[KEY_RESET]) {
            $(el.form).on("reset.pat-selectbox", () => this.form_reset());
            el[KEY_RESET] = true;
        }

        this.all_selects = dom.querySelectorAllAndMe(
            el,
            "select:not([multiple])"
        );
        for (const sel of this.all_selects) {
            // create parent span if not direct child of a label
            if (!sel.parentNode.matches("label")) {
                dom.wrap(sel, document.createElement("span"));
            }
            this.change_select(sel);
            $(sel).on("change.pat-selectbox", () => this.change_select(sel));
        }
    },

    destroy($el) {
        return $el.off(".pat-selectbox");
    },

    form_reset() {
        // This event is triggered before the form is reset, and we need
        // the post-reset state to update our pattern. Use a small delay
        // to fix this.
        setTimeout(() => {
            for (const sel of this.all_selects) {
                this.change_select(sel);
            }
        }, 50);
    },

    change_select(el) {
        el.parentNode.setAttribute("data-option", el.querySelector("option:checked").text); // prettier-ignore
        el.parentNode.setAttribute("data-option-value", el.value);
    },
});
