define([
    'require',
    '../lib/jquery'
], function(require) {
    var init = function($el, opts) {
        // deprecation code
        console.info("old data-injection:",
                     "href=" + $el.attr('href'),
                     "rel=" + $el.attr('rel'),
                     "action=" + $el.attr('action'),
                     "data-injection=" + $el.attr('data-injection'));
    };

    return {
        markup_trigger: '.injection,[data-injection]',
        init: init
    };
});

