import parser from "./depends_parse";

class DependsHandler {
    constructor(el, expression) {
        this.el = el;
        this.context = el.closest("form") || document;
        this.ast = parser.parse(expression); // TODO: handle parse exceptions here
    }

    _find_inputs(name) {
        // In case of radio buttons, there might be multiple inputs.
        let inputs = this.context.querySelectorAll(`
            input[name="${name}"],
            select[name="${name}"],
            textarea[name="${name}"],
            button[name="${name}"]
        `);
        if (!inputs.length) {
            // This should really only find one instance.
            inputs = document.querySelectorAll(`#${name}`)
        }
        return inputs;
    }

    _getValue(name) {
        let inputs = this._find_inputs(name);

        inputs = [...inputs].filter(input => {
            if (input.type === "radio" && input.checked === false) {
                return false;
            }
            if (input.type === "checkbox" && input.checked === false) {
                return false;
            }
            if (input.disabled) {
                return false;
            }
            return true;
        })

        if (inputs.length === 0) {
            return null;
        }

        return inputs[0].value;
    }

    getAllInputs() {
        const todo = [this.ast];
        const all_inputs = new Set();

        while (todo.length) {
            const node = todo.shift();
            if (node.input) {
                const inputs = this._find_inputs(node.input);
                for (const input of inputs) {
                    all_inputs.add(input);

                }
            }
            if (node.children && node.children.length) {
                todo.push.apply(todo, node.children);
            }
        }
        return [...all_inputs];
    }

    _evaluate(node) {
        const value = node.input ? this._getValue(node.input) : null;

        switch (node.type) {
            case "NOT":
                return !this._evaluate(node.children[0]);
            case "AND":
                const is_false = node.children.some((child) => !this._evaluate(child));
                return !is_false;
            case "OR":
                const is_true = node.children.some((child) => this._evaluate(child));
                return is_true;
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
    }

    evaluate() {
        return this._evaluate(this.ast);
    }
}

export default DependsHandler;
