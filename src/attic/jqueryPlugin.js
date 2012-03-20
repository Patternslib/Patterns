// Make sure jquery is loaded before jquery plugins are loaded
define([
    'require',
    './jquery'
], function(require) {
    return {
        load: function (name, req, load, config) {
            // wait for jquery to be loaded
            require('./jquery');
            //req has the same API as require().
            req([name], function (value) {
                load(value);
            });
        }
    };
});