define([
    "jquery",
    "pat-utils"
], function($, utils) {
    var pluggable = {

        extend: function (attrs) {
            return utils.extend(this, attrs);
        },

        registerPlugin: function (name, callback) {
            this.plugins[name] = callback;
        },

        initializePlugins: function () {
            var args = arguments;
            _.each(_.keys(this.plugins), $.proxy(function (k) {
                $.proxy(this.plugins[k], this)(this, args);
            }, this));
            return args;
        }
    };
    return pluggable;
});
