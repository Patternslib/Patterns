define([
    'order!./jquery',
    'order!./qunit/qunit/qunit',
    'order!./pavlov/pavlov'
], function() {
    QUnit.specify.globalApi = true;
    QUnit.specify.extendAssertions({
        contains: function($el, selector, msg) {
            ok($el.find(selector).length, msg);
        },
        lacks: function($el, selector, msg) {
            ok($el.find(selector).length === 0, msg);
        },
        hasClass: function($el, cls, msg) {
            ok($el.hasClass(cls), msg);
        }
    });
});