// Patterns argument parser
import $ from "jquery";
import _ from "underscore";
import utils from "./utils.js";
import logging from "./logging";

function ArgumentParser(name) {
    this.order = [];
    this.parameters = {};
    this.attribute = "data-pat-" + name;
    this.enum_values = {};
    this.enum_conflicts = [];
    this.groups = {};
    this.possible_groups = {};
    this.log = logging.getLogger(name + ".parser");
}

ArgumentParser.prototype = {
    group_pattern: /([a-z][a-z0-9]*)-([A-Z][a-z0-0\-]*)/i,
    json_param_pattern: /^\s*{/i,
    named_param_pattern: /^\s*([a-z][a-z0-9\-]*)\s*:(.*)/i,
    token_pattern: /((["']).*?(?!\\)\2)|\s*(\S+)\s*/g,

    _camelCase(str) {
        return str.replace(/\-([a-z])/g, (__, p1) => p1.toUpperCase());
    },

    addAlias(alias, original) {
        /* Add an alias for a previously added parser argument.
         *
         * Useful when you want to support both US and UK english argument
         * names.
         */
        if (this.parameters[original]) {
            this.parameters[original].alias = alias;
        } else {
            throw (
                'Attempted to add an alias "' +
                alias +
                '" for a non-existing parser argument "' +
                original +
                '".'
            );
        }
    },

    addGroupToSpec(spec) {
        /* Determine wether an argument being parsed can be grouped and
         * update its specifications object accordingly.
         *
         * Internal method used by addArgument and addJSONArgument
         */
        const m = spec.name.match(this.group_pattern);
        if (m) {
            const group = m[1];
            const field = m[2];
            if (group in this.possible_groups) {
                const first_spec = this.possible_groups[group];
                const first_name = first_spec.name.match(this.group_pattern)[2];
                first_spec.group = group;
                first_spec.dest = first_name;
                this.groups[group] = new ArgumentParser();
                this.groups[group].addArgument(
                    first_name,
                    first_spec.value,
                    first_spec.choices,
                    first_spec.multiple
                );
                delete this.possible_groups[group];
            }
            if (group in this.groups) {
                this.groups[group].addArgument(
                    field,
                    spec.value,
                    spec.choices,
                    spec.multiple
                );
                spec.group = group;
                spec.dest = field;
            } else {
                this.possible_groups[group] = spec;
                spec.dest = this._camelCase(spec.name);
            }
        }
        return spec;
    },

    addJSONArgument(name, default_value) {
        /* Add an argument where the value is provided in JSON format.
         *
         * This is a different usecase than specifying all arguments to
         * the data-pat-... attributes in JSON format, and instead is part
         * of the normal notation except that a value is in JSON instead of
         * for example a string.
         */
        this.order.push(name);
        this.parameters[name] = this.addGroupToSpec({
            name: name,
            value: default_value,
            dest: name,
            group: null,
            type: "json",
        });
    },

    addArgument(name, default_value, choices, multiple) {
        const spec = {
            name: name,
            value:
                multiple && !Array.isArray(default_value)
                    ? [default_value]
                    : default_value,
            multiple: multiple,
            dest: name,
            group: null,
        };
        if (choices && Array.isArray(choices) && choices.length) {
            spec.choices = choices;
            spec.type = this._typeof(choices[0]);
            for (const choice of choices) {
                if (this.enum_conflicts.indexOf(choice) !== -1) {
                    continue;
                } else if (choice in this.enum_values) {
                    this.enum_conflicts.push(choice);
                    delete this.enum_values[choice];
                } else {
                    this.enum_values[choice] = name;
                }
            }
        } else if (
            typeof spec.value === "string" &&
            spec.value.slice(0, 1) === "$"
        ) {
            spec.type = this.parameters[spec.value.slice(1)].type;
        } else {
            // Note that this will get reset by _defaults if default_value is a function.
            spec.type = this._typeof(multiple ? spec.value[0] : spec.value);
        }
        this.order.push(name);
        this.parameters[name] = this.addGroupToSpec(spec);
    },

    _typeof(obj) {
        if (obj === null) {
            return "null";
        }
        return typeof obj;
    },

    _coerce(name, value) {
        const spec = this.parameters[name];
        if (typeof value !== spec.type)
            try {
                switch (spec.type) {
                    case "json":
                        value = JSON.parse(value);
                        break;
                    case "boolean":
                        if (typeof value === "string") {
                            value = value.toLowerCase();
                            const num = parseInt(value, 10);
                            if (!isNaN(num)) value = !!num;
                            else
                                value =
                                    value === "true" ||
                                    value === "y" ||
                                    value === "yes" ||
                                    value === "y";
                        } else if (typeof value === "number") {
                            value = !!value;
                        } else {
                            throw (
                                "Cannot convert value for " +
                                name +
                                " to boolean"
                            );
                        }
                        break;
                    case "number":
                        if (typeof value === "string") {
                            value = parseInt(value, 10);
                            if (isNaN(value)) {
                                throw (
                                    "Cannot convert value for " +
                                    name +
                                    " to number"
                                );
                            }
                        } else if (typeof value === "boolean") {
                            value = value + 0;
                        } else {
                            throw (
                                "Cannot convert value for " +
                                name +
                                " to number"
                            );
                        }
                        break;
                    case "string":
                        value = value.toString();
                        break;
                    case "null": // Missing default values
                    case "undefined":
                        break;
                    default:
                        throw (
                            "Do not know how to convert value for " +
                            name +
                            " to " +
                            spec.type
                        );
                }
            } catch (e) {
                this.log.warn(e);
                return null;
            }

        if (spec.choices && spec.choices.indexOf(value) === -1) {
            this.log.warn("Illegal value for " + name + ": " + value);
            return null;
        }
        return value;
    },

    _set(opts, name, value) {
        if (!(name in this.parameters)) {
            this.log.debug("Ignoring value for unknown argument " + name);
            return;
        }
        const spec = this.parameters[name];
        let parts;
        if (spec.multiple) {
            if (typeof value === "string") {
                parts = value.split(/,+/);
            } else {
                parts = value;
            }
            value = [];
            for (const part of parts) {
                const v = this._coerce(name, part.trim());
                if (v !== null) {
                    value.push(v);
                }
            }
        } else {
            value = this._coerce(name, value);
            if (value === null) {
                return;
            }
        }
        opts[name] = value;
    },

    _split(text) {
        const tokens = [];
        text.replace(this.token_pattern, (match, quoted, __, simple) => {
            if (quoted) {
                tokens.push(quoted);
            } else if (simple) {
                tokens.push(simple);
            }
        });
        return tokens;
    },

    _parseExtendedNotation(argstring) {
        const opts = {};
        const parts = argstring
            .replace(/;;/g, "\0x1f")
            .replace(/&amp;/g, "&amp\0x1f")
            .split(/;/)
            .map((el) => el.replace(new RegExp("\0x1f", "g"), ";"));
        _.each(parts, (part) => {
            if (!part) {
                return;
            }
            const matches = part.match(this.named_param_pattern);
            if (!matches) {
                this.log.warn("Invalid parameter: " + part + ": " + argstring);
                return;
            }
            const name = matches[1];
            const value = matches[2].trim();
            const arg = _.chain(this.parameters).where({ alias: name }).value();
            const is_alias = arg.length === 1;

            if (is_alias) {
                this._set(opts, arg[0].name, value);
            } else if (name in this.parameters) {
                this._set(opts, name, value);
            } else if (name in this.groups) {
                const subopt = this.groups[name]._parseShorthandNotation(value);
                for (const field in subopt) {
                    this._set(opts, name + "-" + field, subopt[field]);
                }
            } else {
                this.log.warn("Unknown named parameter " + matches[1]);
                return;
            }
        });
        return opts;
    },

    _parseShorthandNotation(parameter) {
        const parts = this._split(parameter);
        const opts = {};
        let i = 0;

        while (parts.length) {
            const part = parts.shift().trim();
            let sense;
            let flag;
            let positional = true;
            if (part.slice(0, 3) === "no-") {
                sense = false;
                flag = part.slice(3);
            } else {
                sense = true;
                flag = part;
            }
            if (
                flag in this.parameters &&
                this.parameters[flag].type === "boolean"
            ) {
                positional = false;
                this._set(opts, flag, sense);
            } else if (flag in this.enum_values) {
                positional = false;
                this._set(opts, this.enum_values[flag], flag);
            } else if (positional) this._set(opts, this.order[i], part);
            else {
                parts.unshift(part);
                break;
            }
            i++;
            if (i >= this.order.length) {
                break;
            }
        }
        if (parts.length)
            this.log.warn("Ignore extra arguments: " + parts.join(" "));
        return opts;
    },

    _parse(parameter) {
        if (!parameter) {
            return {};
        }
        if (parameter.match(this.json_param_pattern)) {
            try {
                return JSON.parse(parameter);
            } catch (e) {
                this.log.warn("Invalid JSON argument found: " + parameter);
            }
        }
        if (parameter.match(this.named_param_pattern)) {
            return this._parseExtendedNotation(parameter);
        }
        const sep = parameter.indexOf(";");
        if (sep === -1) {
            return this._parseShorthandNotation(parameter);
        }
        const opts = this._parseShorthandNotation(parameter.slice(0, sep));
        const extended = this._parseExtendedNotation(parameter.slice(sep + 1));
        for (const name in extended) {
            opts[name] = extended[name];
        }
        return opts;
    },

    _defaults($el) {
        const result = {};
        for (const name in this.parameters)
            if (typeof this.parameters[name].value === "function")
                try {
                    result[name] = this.parameters[name].value($el, name);
                    this.parameters[name].type = typeof result[name];
                } catch (e) {
                    this.log.error("Default function for " + name + " failed.");
                }
            else result[name] = this.parameters[name].value;
        return result;
    },

    _cleanupOptions(options) {
        // Resolve references
        for (const name of Object.keys(options)) {
            const spec = this.parameters[name];
            if (spec === undefined) continue;

            if (
                options[name] === spec.value &&
                typeof spec.value === "string" &&
                spec.value.slice(0, 1) === "$"
            )
                options[name] = options[spec.value.slice(1)];
        }
        // Move options into groups and do renames
        for (const name of Object.keys(options)) {
            const spec = this.parameters[name];
            let target;
            if (spec === undefined) continue;

            if (spec.group) {
                if (typeof options[spec.group] !== "object")
                    options[spec.group] = {};
                target = options[spec.group];
            } else {
                target = options;
            }

            if (spec.dest !== name) {
                target[spec.dest] = options[name];
                delete options[name];
            }
        }
        return options;
    },

    parse($el, options, multiple, inherit) {
        if (!$el.jquery) {
            $el = $($el);
        }
        if (typeof options === "boolean" && multiple === undefined) {
            // Fix argument order: ``multiple`` passed instead of ``options``.
            multiple = options;
            options = {};
        }
        inherit = inherit !== false;
        const stack = inherit ? [[this._defaults($el)]] : [[{}]];
        let $possible_config_providers;
        let final_length = 1;
        /*
         * XXX this is a workaround for:
         * - https://github.com/Patternslib/Patterns/issues/393
         *
         * Prevents the parser to pollute the pat-modal configuration
         * with data-pat-inject elements define in a `.pat-modal` parent element.
         *
         *  Probably this function should be completely revisited, see:
         * - https://github.com/Patternslib/Patterns/issues/627
         *
         */
        if (
            !inherit ||
            ($el.hasClass("pat-modal") && this.attribute === "data-pat-inject")
        ) {
            $possible_config_providers = $el;
        } else {
            $possible_config_providers = $el
                .parents("[" + this.attribute + "]")
                .addBack();
        }

        _.each($possible_config_providers, (provider) => {
            let frame;
            const data = $(provider).attr(this.attribute);
            if (!data) {
                return;
            }
            const _parse = this._parse.bind(this);
            if (data.match(/&&/)) {
                frame = data.split(/\s*&&\s*/).map(_parse);
            } else {
                frame = [_parse(data)];
            }
            final_length = Math.max(frame.length, final_length);
            stack.push(frame);
        });

        if (typeof options === "object") {
            if (Array.isArray(options)) {
                stack.push(options);
                final_length = Math.max(options.length, final_length);
            } else stack.push([options]);
        }
        if (!multiple) {
            final_length = 1;
        }
        const results = _.map(
            _.compose(
                utils.removeDuplicateObjects,
                _.partial(utils.mergeStack, _, final_length)
            )(stack),
            this._cleanupOptions.bind(this)
        );
        return multiple ? results : results[0];
    },
};

// BBB
ArgumentParser.prototype.add_argument = ArgumentParser.prototype.addArgument;

export default ArgumentParser;
