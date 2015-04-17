require.config({

    paths: {

        jquery: '../src/bower_components/jquery/jquery',
        logging: '../src/bower_components/logging/src/logging',
        'jquery.form': '../src/bower_components/jquery-form/jquery.form',


        logger: '../src/core/logger',
        parser: '../src/core/parser',
        utils: '../src/core/utils',
        compat: '../src/core/compat',
        'jquery-ext': '../src/core/jquery-ext',

        registry: '../src/core/registry',
        ajax: '../src/pat/ajax',

        custom: 'custom'
    },

    shim: {
    	jquery: {
    		exports: 'jQuery'
    	}
    }

});

define(['registry', 'ajax', 'custom'], function (registry, ajax, custom) {
    console.log(registry);
    console.log(ajax);
    console.log(custom);
    console.log(registry.patterns.custom);
});