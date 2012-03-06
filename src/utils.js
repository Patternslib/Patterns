define([
    'require',
    './core/store',
    './lib/jquery'
], function(require) {
    // XXX: not nice
    var mapal = require('./core/store');

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

    var set_initialised_class = function(method, pattern) {
        var cls = pattern.initialised_class;
        if (!cls) return method;
        var initialised_class_wrapper = function($el) {
            var ret = method.apply(this, arguments);
            $el.addClass(cls);
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
            $el.data(key, true);
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

    var utils = {
        extractParameters: extractParameters,
        parseOptions: parseOptions,
        set_initialised_class: set_initialised_class,
        once: once,
        turnstiled: turnstiled,
        pimp_pattern: pimp_pattern,
        jquery_plugin: jquery_plugin
    };

    return utils;
});
