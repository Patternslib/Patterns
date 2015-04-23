/* jshint undef: true, unused: true:, noarg: true, latedef: true */
/*global config require */

config.baseUrl = '/src';
require.config(config);

if (typeof(require) === 'function') {
    require(["patterns"], function() {});
}
