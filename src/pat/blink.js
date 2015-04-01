/**
 * Patterns blink - Signal urgency or importance
 *
 * Copyright 2015 Marko Durkovic
 * Copyright 2015 Florian Friesdorf
 */
define([
    "pat-registry"
], function(registry) {

    var a = 0,
        $el = $(),
        timer;

    var _ = {
        name: "blink",
        trigger: "blink,x-blink,.pat-blink",
        init: function($el_single) {
            $el = $el.add($el_single);
            timer = timer || setInterval(function() {
                $el.fadeTo(0, +!!(a++%4));
            }, 250);
            return $el_single;
        }
    };

    registry.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
