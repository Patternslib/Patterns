define([
    'jquery',
    "../registry"
], function($, patterns) {
    var autofocus = {
        name: "autofocus",
        trigger: ":input.autofocus,:input[autofocus]",

        init: function($el) {
            for (var i=0; i<$el.length; i+=1)
                if (!$el.eq(i).val()) {
                    $el.get(i).focus();
                    return;
                }

            $el.eq(0).focus();
        }
    };

    patterns.register(autofocus);
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
