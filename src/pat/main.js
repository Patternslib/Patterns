config.baseUrl = '/src';
require.config(config);

if (typeof(require) === 'function') {
    require(["patterns"], function(patterns) {});
}
