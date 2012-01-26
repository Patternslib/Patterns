define([
    'require',
    './core/store'
], function(require) {
    // XXX: not nice
    var mapal = require('./core/store');
    var utils = {
        extractParameters: function(params, sources) {
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
        },

        // input = "a!b=1 2!c=x"
        // --> options = {a: true, b: '1 2', c: 'x'}
        parseOptions: function(input) {
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
        }
    };
    return utils;
});
