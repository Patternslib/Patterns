/**
 * @license
 * Patterns @VERSION@ parser - argument parser
 *
 * Copyright 2012 Simplon B.V.
 * Copyright 2012 Florian Friesdorf
 */
define([], function() {

    // older browsers - factor out if more need it
    // source: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/Trim
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g,'');
        };
    }


    // XXX: move to dedicated module
    var warn = function(msg) {
        try {
            console.warn(msg);
        } catch(e) {
        }
    };


    function ArgumentParser(spec) {
        this.parameters = [];
        this.named_parameters = {};
        if (spec) {
            var parts = spec.split(';'),
                parser = this;
            for (var i=0, part; i<parts.length; i++) {
                part = parts[i].trim();
                var match = part.match(parser.named_param_pattern);
                if (match) {
                    parser.add_argument(match[1], match[2].trim());
                } else {
                    parser.add_argument(part);
                }
            }
        }
    };
    ArgumentParser.prototype = {
        named_param_pattern: /^\s*([a-zA-z]+)\s*:(.*)/,

        add_argument: function(name, default_value) {
            var parameter = {"name" : name,
                             "default": default_value};
            this.parameters.push(parameter);
            this.named_parameters[name] = parameter;
        },

        parse: function(parameter) {
            var parts = parameter.split(";"),
                opts = {},
                part, matches, i, name;

            // Popuplate options with default values
            for (i=0; i<this.parameters.length; i++) {
                name = this.parameters[i].name;
                opts[name] = this.parameters[i].default;
            }

            // Grab all positional parameters
            i=-1;
            while (parts.length) {
                i++;
                if (i>=this.parameters.length) {
                    break;
                }
                part = parts.shift().trim();
                if (!part)
                    continue;
                if (this.named_param_pattern.test(part)) {
                    parts.unshift(part);
                    break;
                }
                opts[this.parameters[i].name] = part.trim();
            }

            // Handle all named parameters
            for (i=0; i<parts.length; i++) {
                matches = parts[i].match(this.named_param_pattern);
                if (!matches) {
                    warn("Positional parameters not allowed after named parameters");
                    break;
                }
                if (this.named_parameters[matches[1]]===undefined) {
                    warn("Unknown named parameter " + matches[1]);
                    continue;
                }
                opts[matches[1]] = matches[2].trim();
            }

            return opts;
        }
    };

    return ArgumentParser;

});

/* jslint devel: true, browser: true, continue: true, sloppy: true, white: true, plusplus: true, regexp: true, indent: 8
 */
