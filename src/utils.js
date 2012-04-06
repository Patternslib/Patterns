/*jslint regexp: true,
         browser: true,
         sloppy: true,
         white: true,
         plusplus: true,
         indent: 4,
         maxlen: 200 */
/*global define, $ */

define([
    'require',
    './core/store',
    './lib/dist/underscore',
    './lib/jquery',
    './logging'
], function(require) {
    // XXX: not nice
    var mapal = require('./core/store'),
        getLogger = require('./logging').getLogger,
        extractParameters,
        pimp_pattern,
        jquery_plugin,
        utils,
        once,
        parseOptions,
        log_init,
        turnstiled,
        set_initialised_class;

    extractParameters = function(params, sources) {
        var tmp,
            j,
            paramObjs = {},
            p,
            i,
            param,
            effect,
            source;

        if (params.length > 0) {
            p = params.slice(1).split('!');

            for (i = p.length-1; i >= 0; i--) {
                // support injection parameters in other patterns
                if (p[i][0] === '#') {
                    if (p[i].indexOf('.') > 0) {
                        tmp = p[i].split('.');
                        param = tmp[0];
                        effect = tmp[1];
                    } else {
                        param = p[i];
                        effect = undefined;
                    }
                    source = [sources.pop()];

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
    parseOptions = function(input) {
        var params = input.split("!"),
            options = {},
            name,
            value,
            index,
            i,
            params_length;

        params_length = params.length;
        for (i=0; i<params_length; i++) {
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

    log_init = function(name, method) {
        var log_wrapper = function($el) {
            var log = getLogger(name),
                ret;
            log.debug('Initialising:', $el);
            ret = method.apply(this, arguments);
            if (ret === false) {
                log.debug('skipped', $el);
            } else {
                log.debug('initialised:', $el);
            }
            return ret;
        };
        return log_wrapper;
    };

    set_initialised_class = function(method, pattern) {
        var cls = pattern.initialised_class,
            initialised_class_wrapper;
        if (!cls) {
            return method;
        }
        initialised_class_wrapper = function($el) {
            var ret = method.apply(this, arguments);
            if (ret !== false) { 
                $el.addClass(cls);
            }
            return ret;
        };
        return initialised_class_wrapper;
    };

    // run a method on an element only once
    once = function(key, method) {
        var once_wrapper = function($el) {
            var initialised = $el.data(key),
                ret;

            if (initialised) {
                return undefined;
            }
            ret = method.apply(this, arguments);
            if (ret !== false) {
                $el.data(key, true);
            }
            return ret;
        };
        return once_wrapper;
    };

    // work on elements single file
    turnstiled = function(method) {
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
    pimp_pattern = function(pname, pattern) {
        var pimped = {},
            mname,
            method;

        for (mname in pattern) {
            method = pattern[mname];
            if (mname === "init") {
                method = log_init(pname, method);
                method = set_initialised_class(method, pattern);
                method = once(pname + '-' + mname, method);
            }
            if (typeof method === "function") {
                method = turnstiled(method);
            }
            pimped[mname] = method;
        }
        return pimped;
    };

    jquery_plugin = function(name, pattern) {
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
    /*var load_modules = function(prefix, names, suffix) {
        prefix = prefix || '';
        suffix = suffix || '';
        var modules = _.reduce(names, function(acc, name) {
            acc[name] = require(prefix + name + suffix);
            return acc;
        }, {});
        return modules;
    };*/

    utils = {
        extractParameters: extractParameters,
        parseOptions: parseOptions,
        //load_modules: load_modules,
        // pattern pimping - own module?
        set_initialised_class: set_initialised_class,
        once: once,
        turnstiled: turnstiled,
        pimp_pattern: pimp_pattern,
        jquery_plugin: jquery_plugin
    };

    return utils;
});
