/**
 * <pattern name> - <brief description>
 *
 * Copyright 2013 <your name>
 */
define([
    "jquery",
    "../core/registry",
    "../core/parser"
], function($, patterns, Parser) {
    var parser = new Parser("<pattern name>");

    var pattern = {
        name: "<pattern name>",
        trigger: ".pat-pattern",

        init: function($el, opts) {
            return $el;
        }
    };

    patterns.register(pattern);
    return pattern;
});


