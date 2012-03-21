// Make sure pavlov is loaded before specs are loaded
define([
    'require',
    '../lib/pavlov'
], function(require) {
    return {
        load: function (name, req, load, config) {
            // wait for jquery to be loaded
            var p = require('../lib/pavlov');
            //req has the same API as require().
            req([name], function (value) {
                load(value);
            });
        }
    };
});