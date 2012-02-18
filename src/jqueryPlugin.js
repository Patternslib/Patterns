// Make sure jquery is loaded before jquery plugins are loaded
define([
    'require',
    './lib/jquery'
], function(require) {
    return {
        load: function (name, req, load, config) {
            // wait for jquery to be loaded
            require('./lib/jquery');
            //req has the same API as require().
            req([name], function (value) {
                load(value);
            });
        }
    };
});