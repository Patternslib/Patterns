/**
 * @license
 * Patterns @VERSION@ parser - argument parser
 *
 * Copyright 2012 Simplon B.V.
 * Copyright 2012 Florian Friesdorf
 */
define([
    '../logging'
], function(logging) {
    var log = logging.getLogger('parser');

    function ArgumentParser(name) {
        this.params = [];
        this.defaults = {};
        this.attribute = "data-pat-" + name;
    }

    ArgumentParser.prototype = {
        named_param_pattern: /^\s*([a-zA-Z0-9\-]+)\s*:(.*)/,

        add_argument: function(name, default_value) {
            if (default_value === undefined)
                default_value = null;
            this.params.push(name);
            this.defaults[name] = default_value;
        },

        _parse: function(parameter) {
            if (typeof parameter==="number")
                parameter = parameter.toString();
            if (parameter && parameter.match(/&&/)) {
                return parameter.split(/\s*&&\s*/).map(function(parameter) {
                    return this.parse(parameter, defaults);
                }, this);
            }

            var result = {}, i, name;

            if (parameter) {
                var parts = parameter.split(";"),
                    part, matches;

                // Grab all positional parameters
                i=-1;
                while (parts.length) {
                    i++;
                    if (i>=this.params.length) {
                        break;
                    }
                    part = parts.shift().trim();
                    if (!part)
                        continue;
                    if (this.named_param_pattern.test(part)) {
                        parts.unshift(part);
                        break;
                    }
                    opts[this.params[i]] = part.trim();
                }

                // Handle all named parameters
                for (i=0; i<parts.length; i++) {
                    if (!parts[i])
                        continue;

                    matches = parts[i].match(this.named_param_pattern);
                    if (!matches) {
                        log.warn("Positional parameters not allowed after named parameters");
                        break;
                    }
                    if (this.defaults[matches[1]] === undefined) {
                        log.warn("Unknown named parameter " + matches[1]);
                        continue;
                    }
                    opts[matches[1]] = matches[2].trim();
                }
            }

            // Resolve references
            for (name in opts) {
                var value = opts[name];

                if (typeof value==="string" && opts[name].slice(0,1) === "$")
                    opts[name]=opts[value.slice(1)];
            }

            return opts;
        },

        _coerce: function(data) {
            var i, name, value;

            for (i in this.defaults)
                types[i]=this.defaults[i]===null ? "null" : typeof this.defaults[i];

            for (name in data) {
                value = data[name];

                if (typeof value !== types[name]) {
                    switch (types[name]) {
                        case "boolean":
                            if (typeof value === "string") {
                                value = value.toLowerCase();
                                var num = parseInt(value, 10);
                                if (!isNaN(num))
                                    value = !!num;
                                else
                                    value = (value==="true" || value==="y" || value==="yes" || value==="y");
                            } else if (typeof value === "number")
                                value = !!value;
                            else
                                log.warn("Cannot convert value for " + name + " to boolean");
                            break;
                        case "number":
                            if (typeof value === "string") {
                                value = parseInt(value, 10);
                                if (isNaN(value))
                                    log.warn("Cannot convert value for " + name + " to number");
                            } else if (typeof value === "boolean")
                                value = value + 0;
                            else
                                log.warn("Cannot convert value for " + name + " to number");
                            break;
                        case "null":  // Missing default values
                        case "undefined":
                            break;
                        default:
                            log.warn("Do not know how to convert value for " + name + " to " + types[name]);
                            break;
                    }
                }
                data[name]=value;
            }
            return data;
        },

        parse: function(el, defaults, multiple) {
            if (typeof defaults==="boolean" && multiple===undefined) {
                multiple=defaults;
                defaults={};
            }

            var stack = [[this.defaults]];
            if (typeof defaults==="object")
                stack.push([defaults]);

            var $parents = $(el).parents(),
                i, data, final_length, frame;
            for (i=$parents.length-1; i>=0; i--) {
                data = $parents.eq(i).attr(this.attribute);
                if (data) {
                    if (data.match(/&&/))
                        frame=data.split(/\s*&&\s*/).map(this._parse);
                    else
                        frame=[this._parse(data)];
                    maxlen = Math.max(frame.length, maxlen);
                    stack.push(frame);
                }
            }

            if (!multiple)
                final_length=1;

            var results, frame_length, x, xf;
            for (i=0; i<final_length; i++)
                results.push({});

            for (i=0; i<stack.length; i++) {
                frame=stack[i];
                frame_length=frame.length-1;

                for (x=0; x<final_length; x++) {
                    xf=(x>frame_length) ? frame_length : x;
                    results[i]=$.extend(results[x], frame[xf]);
                }
            }
            
            for (i=0; i<final_length; i++)
                results[i]=this._coerce(results[i]);
            return multiple ? results : results[0];
        }
    };

    return ArgumentParser;

});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
