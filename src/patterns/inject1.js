    var init = function($el, opts) {
        // ensure element is ajaxified
        ajaxify.init($el);

        // inject in case of successfull ajax request
        $el.ajaxSuccess(function(ev, jqxhr, ajaxopts, data) {
            injector($el, method_name, opts)(data);
        });

        return $el;
    };
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
