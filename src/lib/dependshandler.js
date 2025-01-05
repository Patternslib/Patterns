import $ from "jquery";
import parser from "./depends_parse";
import utils from "../core/utils";

function DependsHandler($el, expression) {
    const el = utils.jqToNode($el);
    this.$el = $el;
    this.$context = $(el.form || el.closest("form") || document);
    this.ast = parser.parse(expression); // TODO: handle parse exceptions here
}

DependsHandler.prototype = {
    _findInputs: function (name) {
        let $input = this.$context.find(":input[name='" + name + "']"); // TODO input outside form
        if (!$input.length) {
            $input = $("#" + name);
        }
        return $input;
    },

    _getValue: function (name) {
        const $input = this._findInputs(name);
        if (!$input.length) {
            return null;
        }
        if ($input.attr("type") === "radio" || $input.attr("type") === "checkbox") {
            return $input.filter(":checked").val() || null;
        }
        return $input.val();
    },

    getAllInputs: function () {
        const todo = [this.ast];
        let $inputs = $();
        let node;

        while (todo.length) {
            node = todo.shift();
            if (node.input) {
                $inputs = $inputs.add(this._findInputs(node.input));
            }
            if (node.children && node.children.length) {
                todo.push.apply(todo, node.children);
            }
        }
        return $inputs;
    },

    _evaluate: function (node) {
        const value = node.input ? this._getValue(node.input) : null;

        switch (node.type) {
            case "NOT":
                return !this._evaluate(node.children[0]);
            case "AND":
                for (const child of node.children) {
                    if (!this._evaluate(child)) {
                        return false;
                    }
                }
                return true;
            case "OR":
                for (const child of node.children) {
                    if (this._evaluate(child)) {
                        return true;
                    }
                }
                return false;
            case "comparison":
                switch (node.operator) {
                    case "=":
                        return node.value == value;
                    case "!=":
                        return node.value != value;
                    case "<=":
                        return value <= node.value;
                    case "<":
                        return value < node.value;
                    case ">":
                        return value > node.value;
                    case ">=":
                        return value >= node.value;
                    case "~=":
                        if (value === null) {
                            return false;
                        }
                        return value.indexOf(node.value) != -1;
                    case "=~":
                        if (value === null || !node.value) {
                            return false;
                        }
                        return node.value.indexOf(value) != -1;
                }
                break;
            case "truthy":
                return !!value;
        }
    },

    evaluate: function () {
        return this._evaluate(this.ast);
    },
};

export default DependsHandler;
