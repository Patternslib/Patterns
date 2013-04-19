/**
 * Patterns validate - Form vlidation
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 */
define([
    "jquery",
    "../registry"
], function($, patterns) {
    var validate = {
        name: "validate",
        trigger: ".pat-validate",

        init: function($el) {
            return $el;
        }
    };


    patterns.register(validate);
    return validate;
});
