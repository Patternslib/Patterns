require.config({

    paths: {
        registry: '../bundle',
        custom: 'custom' 
    },

});

define(['registry', 'custom'], function (registry, custom) {
    console.log(registry);
    console.log(custom);
    console.log(registry.patterns.custom);
});