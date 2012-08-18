/**
 * @license
 * Patterns @VERSION@ parser - argument parser
 *
 * Copyright 2012 Simplon B.V.
 * Copyright 2012 Florian Friesdorf
 */
define([
    'require',
    '../logging'
], function(require) {
    var log = require('../logging').getLogger('parser');

    function ArgumentParser(spec) {
        this.params = [];
        this.defaults = {};
        if (spec) this.add_spec(spec);
    };
    ArgumentParser.prototype = {
        named_param_pattern: /^\s*([a-zA-Z0-9]+)\s*:(.*)/,

        add_argument: function(name, default_value) {
            if (default_value === undefined) default_value = "";
            this.params.push(name);
            this.defaults[name] = default_value;
        },

        add_spec: function(spec) {
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
        },

        parse: function(parameter, defaults) {
            defaults = defaults || {};
            if (!parameter) {
                return defaults;
            }
            if (parameter.match(/&&/)) {
                return parameter.split(/\s*&&\s*/).map(function(parameter) {
                    return this.parse(parameter, defaults);
                }, this);
            }

            var parts = parameter.split(";"),
                opts = {},
                part, matches, i, name;

            // Popuplate options with default values
            for (i=0; i<this.params.length; i++) {
                name = this.params[i];
                opts[name] = defaults[name] || this.defaults[name];
            }

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

            for (name in opts) {
                if (opts[name].slice(0,1) === "$") {
                    opts[name] = opts[opts[name].slice(1)];
                }
            }

            return opts;
        }
    };

    return ArgumentParser;

});

/* jslint devel: true, browser: true, continue: true, sloppy: true, white: true, plusplus: true, regexp: true, indent: 8
 */
