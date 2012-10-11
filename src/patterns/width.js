/**
 * @license
 * Patterns @VERSION@ carousel
 *
 * Copyright 2012 Simplon B.V.
 */
define([
    "jquery"
], function($) {
    var widthClasses = {};

    var width_pattern = {
        name: "width",

        update: function() {
            var width = $(window).width(),
                $body = $("body"),
                limits;

            for (var cls in widthClasses) {
                limits=widthClasses[cls];
                if ((limits.minimum===null || limits.minimum<=width) && (limits.maximum===null || width<=limits.maximum)) {
                    $body.addClass(cls);
                } else {
                    $body.removeClass(cls);
                }
            }
        }
    };

    width_pattern.update();
    $(window).bind("resize.width", width_pattern.update);

//    patterns.register(width_pattern.name, width_pattern);

    var public_api = {
        register: function(cls, minimum, maximum) {
            widthClasses[cls] = { minimum: minimum,
                                  maximum: maximum };
        }
    };

    return public_api;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
