require.config({

    paths: {
        patterns: '../bundle',
        custom: 'custom' 
    },

});

define(['patterns', 'custom'], function (Patterns, custom) {
    console.log(Patterns);
    console.log(custom);
    console.log(Patterns.patterns.custom);
});