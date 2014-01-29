({
    baseUrl: "src",
    out: 'bundle.js',
    name: 'patterns',

    paths: {

        // Externals
        jquery: 'bower_components/jquery/jquery',
        logging: 'bower_components/logging/src/logging',

        // Core
        utils: 'core/utils',
        compat: 'core/compat',
        'jquery-ext': 'core/jquery-ext',
        logger: 'core/logger',
        parser: 'core/parser',
        remove: 'core/remove',
        url: 'core/url',
        registry: 'core/registry',

        // Patterns
        patterns: 'patterns'
    },

    optimize: 'none'
})



