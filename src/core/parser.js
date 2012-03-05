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


    // XXX: move somewhere
    // source: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
    // Production steps of ECMA-262, Edition 5, 15.4.4.19
    // Reference: http://es5.github.com/#x15.4.4.19
    if (!Array.prototype.map) {
        Array.prototype.map = function(callback, thisArg) {

            var T, A, k;

            if (this == null) {
                throw new TypeError(" this is null or not defined");
            }

            // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
            var O = Object(this);

            // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
            // 3. Let len be ToUint32(lenValue).
            var len = O.length >>> 0;

            // 4. If IsCallable(callback) is false, throw a TypeError exception.
            // See: http://es5.github.com/#x9.11
            if ({}.toString.call(callback) != "[object Function]") {
                throw new TypeError(callback + " is not a function");
            }

            // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
            if (thisArg) {
                T = thisArg;
            }

            // 6. Let A be a new array created as if by the expression new Array(len) where Array is
            // the standard built-in constructor with that name and len is the value of len.
            A = new Array(len);

            // 7. Let k be 0
            k = 0;

            // 8. Repeat, while k < len
            while(k < len) {

                var kValue, mappedValue;

                // a. Let Pk be ToString(k).
                //   This is implicit for LHS operands of the in operator
                // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
                //   This step can be combined with c
                // c. If kPresent is true, then
                if (k in O) {

                    // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                    kValue = O[ k ];

                    // ii. Let mappedValue be the result of calling the Call internal method of callback
                    // with T as the this value and argument list containing kValue, k, and O.
                    mappedValue = callback.call(T, kValue, k, O);

                    // iii. Call the DefineOwnProperty internal method of A with arguments
                    // Pk, Property Descriptor {Value: mappedValue, Writable: true, Enumerable: true, Configurable: true},
                    // and false.

                    // In browsers that support Object.defineProperty, use the following:
                    // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

                    // For best browser support, use the following:
                    A[ k ] = mappedValue;
                }
                // d. Increase k by 1.
                k++;
            }

            // 9. return A
            return A;
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
        this.params = [];
        this.defaults = {};
        if (spec) this.add_spec(spec);
    };
    ArgumentParser.prototype = {
        named_param_pattern: /^\s*([a-zA-z]+)\s*:(.*)/,

        add_argument: function(name, default_value) {
            if (default_value === undefined) default_value = null;
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

        parse: function(parameter) {
            if (parameter.match(/&&/)) {
                return parameter.split(/\s*&&\s*/).map(this.parse, this);
            }

            var parts = parameter.split(";"),
                opts = {},
                part, matches, i, name;

            // Popuplate options with default values
            for (i=0; i<this.params.length; i++) {
                name = this.params[i];
                opts[name] = this.defaults[name];
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
                    warn("Positional parameters not allowed after named parameters");
                    break;
                }
                if (this.defaults[matches[1]] === undefined) {
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
