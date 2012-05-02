define([
    'require',
    './core/store',
    './logging'
], function(require) {
    // XXX: not nice
    var mapal = require('./core/store'),
        getLogger = require('./logging').getLogger;

    var extractParameters = function(params, sources) {
        var tmp,
            j,
            paramObjs = {};
        if (params.length > 0) {
            var p = params.slice(1).split('!');
            for (var i = p.length-1; i >= 0; i--) {
                // support injection parameters in other patterns
                if (p[i][0] == '#') {
                    var param, effect;

                    if (p[i].indexOf('.') > 0) {
                        tmp = p[i].split('.');
                        param = tmp[0];
                        effect = tmp[1];
                    } else {
                        param = p[i];
                        effect = undefined;
                    }
                    var source = [sources.pop()];
                    // XXX: $a and url were also not defined in the old context
                    // We need automated tests
                    mapal.injection.load($a, url, param.slice(1), source);
                } else if (p[i].indexOf('=') > 0) {
                    j = p[i].indexOf('=');
                    paramObjs[p[i].slice(0, j)] = p[i].slice(j+1);
                } else {
                    paramObjs[p[i]] = true;
                }
            }
        }
        return paramObjs;
    };

    // input = "a!b=1 2!c=x"
    // --> options = {a: true, b: '1 2', c: 'x'}
    var parseOptions = function(input) {
        var params = input.split("!"),
            options = {}, name, value, index;

        for (var i=0; i<params.length; i++) {
            index = params[i].indexOf("=");
            if (index === -1) {
                name = params[i];
                value = true;
            } else {
                name = params[i].slice(0, index);
                value = params[i].slice(index+1);
            }
            options[name] = value;
        }
        return options;
    };

    var log_init = function(name, method) {
        var log_wrapper = function($el) {
            var log = getLogger(name);
            log.debug('Initialising:', $el);
            var ret = method.apply(this, arguments);
            if (ret === false) {
                log.debug('skipped', $el);
            } else {
                log.debug('initialised:', $el);
            }
            return ret;
        };
        return log_wrapper;
    };

    var set_initialised_class = function(method, pattern) {
        var cls = pattern.initialised_class;
        if (!cls) return method;
        var initialised_class_wrapper = function($el) {
            var ret = method.apply(this, arguments);
            if (ret !== false) $el.addClass(cls);
            return ret;
        };
        return initialised_class_wrapper;
    };

    // run a method on an element only once
    var once = function(key, method) {
        var once_wrapper = function($el) {
            var initialised = $el.data(key);
            if (initialised) return undefined;
            var ret = method.apply(this, arguments);
            if (ret !== false) $el.data(key, true);
            return ret;
        };
        return once_wrapper;
    };

    // work on elements single file
    var turnstiled = function(method) {
        var turnstile = function($el) {
            var rest = Array.prototype.slice.call(arguments, 1);
            $el.each(function() {
                var $this = $(this);
                return method.apply($this, [$this].concat(rest));
            });
        };
        return turnstile;
    };

    // return a pimpéd pattern
    // - init only once
    // - put multiple elements through a turnstile
    var pimp_pattern = function(pname, pattern) {
        var pimped = {};
        for (var mname in pattern) {
            var method = pattern[mname];
            if (mname === "init") {
                method = log_init(pname, method);
                method = set_initialised_class(method, pattern);
                method = once(pname + '-' + mname, method);
            }
            if (typeof method === "function") method = turnstiled(method);
            pimped[mname] = method;
        }
        return pimped;
    };

    var jquery_plugin = function(name, pattern) {
        var plugin = function(method) {
            if (!method || typeof method === "object") {
                pattern.init.apply(this, [this].concat(arguments));
            } else if (pattern[method]) {
                pattern[method].apply(
                    this,
                    [this].concat(Array.prototype.slice.call(arguments, 1))
                );
            } else {
                $.error('Method ' + method + ' does not exist on jQuery.' + name);
            }
            return this;
        };
        return plugin;
    };

    // XXX: need to understand require magic to make this work here
    // require paths are local to where it is called, we would need to
    // pass the path of the module that called load_modules
    var load_modules = function(prefix, names, suffix) {
        prefix = prefix || '';
        suffix = suffix || '';
        var modules = names.reduce(function(acc, name) {
            acc[name] = require(prefix + name + suffix);
            return acc;
        }, {});
        return modules;
    };


    //     Underscore.js 1.3.1
    //     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
    //     Underscore is freely distributable under the MIT license.
    //     Portions of Underscore are inspired or borrowed from Prototype,
    //     Oliver Steele's Functional, and John Resig's Micro-Templating.
    //     For all details and documentation:
    //     http://documentcloud.github.com/underscore
    //
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds.
    var debounce = function(func, wait) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };



    var utils = {
        extractParameters: extractParameters,
        parseOptions: parseOptions,
        //load_modules: load_modules,
        // pattern pimping - own module?
        set_initialised_class: set_initialised_class,
        once: once,
        turnstiled: turnstiled,
        pimp_pattern: pimp_pattern,
        jquery_plugin: jquery_plugin,
        debounce: debounce
    };

    return utils;
});
