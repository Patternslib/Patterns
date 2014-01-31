({
    baseUrl: "src",
    out: 'bundle.js',
    name: 'patterns',

    paths: {

        // Externals
        jquery: 'bower_components/jquery/jquery',
        logging: 'bower_components/logging/src/logging',
        'jquery.form': 'bower_components/jquery-form/jquery.form',

        // Core
        utils: 'core/utils',
        compat: 'core/compat',
        'jquery-ext': 'core/jquery-ext',
        logger: 'core/logger',
        parser: 'core/parser',
        remove: 'core/remove',
        url: 'core/url',
        store: 'core/store',
        registry: 'core/registry',
        htmlparser: 'lib/htmlparser',

        // Patterns
        patterns: 'patterns',
        ajax: 'pat/ajax',
        inject: 'pat/inject',
    },

    optimize: 'none'
})



