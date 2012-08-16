define([
    'order!./qunit/qunit/qunit',
    'order!./pavlov/pavlov'
], function(require) {
    QUnit.specify.globalApi = true;
    QUnit.specify.extendAssertions({
        contains: function($el, selector, msg) {
            if ($el.jquery) {
                ok($el.find(selector).length, msg);
            } else {
                // plain string contains
                ok($el.indexOf(selector) !== -1, msg);
            }
        },
        lacks: function($el, selector, msg) {
            ok($el.find(selector).length === 0, msg);
        },
        hasClass: function($el, cls, msg) {
            ok($el.hasClass(cls), msg);
        }
    });
});