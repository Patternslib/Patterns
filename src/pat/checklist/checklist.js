import Base from "../../core/base";
import Parser from "../../core/parser";
import dom from "../../core/dom";
import events from "../../core/events";
import utils from "../../core/utils";
import "../../core/jquery-ext";

export const parser = new Parser("checklist");
parser.addArgument("select", ".select-all");
parser.addArgument("deselect", ".deselect-all");
parser.addArgument("toggle", ".toggle-all");

export default Base.extend({
    name: "checklist",
    trigger: ".pat-checklist",
    jquery_plugin: true,
    all_selects: [],
    all_deselects: [],
    all_toggles: [],
    all_checkboxes: [],
    all_radios: [],

    init() {
        this.options = parser.parse(this.el, this.options, false);
        this.$el.on("patterns-injected", this._init.bind(this));

        this.change_handler = utils.debounce(() => {
            this.change_buttons_and_toggles();
            this.change_checked();
        }, 50);

        this._init();
    },

    _init() {
        this.all_checkboxes = this.el.querySelectorAll(`input[type=checkbox]`);
        this.all_radios = this.el.querySelectorAll("input[type=radio]");

        this.all_selects = dom.find_scoped(this.el, this.options.select);
        for (const btn of this.all_selects) {
            btn.addEventListener("click", this.select_all.bind(this));
        }

        this.all_deselects = dom.find_scoped(this.el, this.options.deselect);
        for (const btn of this.all_deselects) {
            btn.addEventListener("click", this.deselect_all.bind(this));
        }

        this.all_toggles = dom.find_scoped(this.el, this.options.toggle);
        for (const btn of this.all_toggles) {
            btn.addEventListener("click", this.toggle_all.bind(this));
        }

        // update select/deselect button status
        this.change_buttons_and_toggles();
        this.change_checked();
        this.el.addEventListener("change", this.change_handler.bind(this));
    },

    destroy() {
        for (const it of this.all_selects) {
            it.removeEventListener("click", this.select_all);
        }
        for (const it of this.all_deselects) {
            it.removeEventListener("click", this.deselect_all);
        }
        this.el.removeEventListener("change", this.change_handler);
        this.$el.off("patterns_injected");
    },

    find_siblings(el, sel) {
        // Looks for the closest elements within the `el` tree that match the
        // `sel` selector
        let res;
        let parent = el.parentNode;
        while (parent) {
            res = parent.querySelectorAll(`${sel}:not(${this.options.toggle})`);
            if (res.length || parent === this.el) {
                // return if results were found or we reached the pattern top
                return res;
            }
            parent = parent.parentNode;
        }
    },

    find_checkboxes(ref_el, sel) {
        let chkbxs = [];
        if (this.options.select.indexOf("#") === 0) {
            chkbxs = this.el.querySelectorAll(sel);
        } else {
            chkbxs = this.find_siblings(ref_el, sel);
        }
        return chkbxs;
    },

    change_buttons_and_toggles() {
        let chkbxs;
        for (const btn of this.all_selects) {
            chkbxs = this.find_checkboxes(btn, "input[type=checkbox]");
            btn.disabled = [...chkbxs]
                .map((el) => el.matches(":checked"))
                .every((it) => it === true);
        }
        for (const btn of this.all_deselects) {
            chkbxs = this.find_checkboxes(btn, "input[type=checkbox]");
            btn.disabled = [...chkbxs]
                .map((el) => el.matches(":checked"))
                .every((it) => it === false);
        }
        for (const tgl of this.all_toggles) {
            chkbxs = this.find_checkboxes(tgl, "input[type=checkbox]");
            tgl.checked = [...chkbxs]
                .map((el) => el.matches(":checked"))
                .every((it) => it === true);
        }
    },

    select_all(e) {
        e.preventDefault();
        const chkbxs = this.find_checkboxes(
            e.target,
            "input[type=checkbox]:not(:checked)"
        );
        for (const box of chkbxs) {
            box.checked = true;
            box.dispatchEvent(events.change_event());
        }
    },

    deselect_all(e) {
        e.preventDefault();
        const chkbxs = this.find_checkboxes(e.target, "input[type=checkbox]:checked");
        for (const box of chkbxs) {
            box.checked = false;
            box.dispatchEvent(events.change_event());
        }
    },

    toggle_all(e) {
        e.preventDefault();
        const checked = e.target.checked;
        const chkbxs = this.find_checkboxes(e.target, "input[type=checkbox]");
        for (const box of chkbxs) {
            box.checked = checked;
            box.dispatchEvent(events.change_event());
        }
    },

    change_checked() {
        for (const it of [...this.all_checkboxes, ...this.all_radios]) {
            for (const label of it.labels) {
                label.classList.remove("checked", "unchecked");
                label.classList.add(it.checked ? "checked" : "unchecked");
            }
        }

        for (const fieldset of dom.querySelectorAllAndMe(this.el, "fieldset")) {
            if (
                fieldset.querySelectorAll(
                    `input[type=checkbox]:checked:not(${this.options.toggle}), input[type=radio]:checked`
                ).length
            ) {
                fieldset.classList.remove("unchecked");
                fieldset.classList.add("checked");
            } else {
                fieldset.classList.remove("checked");
                fieldset.classList.add("unchecked");
            }
        }
    },
});
