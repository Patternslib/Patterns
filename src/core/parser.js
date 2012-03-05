/**
 * @license
 * Patterns @VERSION@ parser - argument parser
 *
 * Copyright 2012 Simplon B.V.
 */
define([], function() {

    // older browsers - factor out if more need it
    // source: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/Trim
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g,'');
        };
    }

    function ArgumentParser() {
        this.options = {};
        this.parameters = [];
        this.named_parameters = {};
    }

    ArgumentParser.prototype = {
        log: function(msg) {
            try {
                console.log(msg);
            } catch(e) {
            }
        },

        add_argument: function(name, default_value) {
            var parameter = {"name" : name,
                             "default": default_value};
            this.parameters.push(parameter);
            this.named_parameters[name] = parameter;
        },

        parse: function(parameter) {
            var parts = parameter.split(";"),
                named_param_pattern = /^\s*([a-zA-z]+)\s*:(.*)/,
                part, matches, i;

            // Popuplate options with default values
            for (i=0; i<this.parameters.length; i++) {
                this.options[this.parameters[i].name] = this.parameters[i]["default"];
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
                if (named_param_pattern.test(part)) {
                    parts.unshift(part);
                    break;
                }
                this.options[this.parameters[i].name] = part.trim();
            }

            // Handle all named parameters
            for (i=0; i<parts.length; i++) {
                matches = parts[i].match(named_param_pattern);
                if (!matches) {
                    this.log("Positional parameters not allowed after named parameters");
                    break;
                }
                if (this.named_parameters[matches[1]]===undefined) {
                    this.log("Unknown named parameter " + matches[1]);
                    continue;
                }
                this.options[matches[1]] = matches[2].trim();
            }
        }
    };

    return ArgumentParser;

});

/* jslint devel: true, browser: true, continue: true, sloppy: true, white: true, plusplus: true, regexp: true, indent: 8
 */
