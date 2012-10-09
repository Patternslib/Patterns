define([
    'jquery'
], function($) {
    var autofocus = {
        initContent: function(root) {
            var $el = $(":input.autofocus,:input[autofocus]", root).filter(":not(.cant-touch.this)");

            for (var i=0; i<$el.length; i+=1)
                if (!$el.eq(i).val()) {
                    $el.get(i).focus();
                    return;
                }

            $el.eq(0).focus();
        }
    };

    return autofocus;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
