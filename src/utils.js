define([
    "jquery"
], function($) {
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

    var jquery_plugin = function(pattern) {
        var plugin = function(method) {
            var $this = this;
            if ($this.length === 0)
                return $this;
            if (!method || typeof method === "object") {
                pattern.init.apply(
                        $this,
                        [$this].concat(Array.prototype.slice.call(arguments)));
            } else if (pattern[method]) {
                pattern[method].apply(
                    $this,
                    [$this].concat(Array.prototype.slice.call(arguments, 1))
                );
            } else {
                $.error('Method ' + method +
                        ' does not exist on jQuery.' + pattern.name);
            }
            return $this;
        };
        return plugin;
    };

    function _renumberAttribute(el, attr, i) {
        var $el = $(el),
            buf = $el.attr(attr);
        if (buf) {
            $el.attr(attr, buf.replace(/[0-9]+/, i));
        }
    }

    function _renumberEl() {
	_renumberAttribute(this, "for", i);
	_renumberAttribute(this, "id", i);
	_renumberAttribute(this, "name", i);
    }

    function renumber($container, selector) {
        var $entries = $container.find(selector ? selector : "fieldset,tr,dd"),
            entry, i;

        for (i=0; i<$entries.length; i++) {
            entry = $entries.get(i);
            _renumberAttribute(entry, "id", i);
            $("label, :input", entry).each(_renumberEl);
        }
    }


    function hasContent($el) {
        if ($el.is(":input")) {
            return $el.val();
        } else {
            return $el.text().replace(/\s*/g, "") || $el.find("img,object,video,audio").length;
        }
    }


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
        jquery_plugin: jquery_plugin,
        debounce: debounce,
	renumber: renumber,
	hasContent: hasContent
    };

    return utils;
});
