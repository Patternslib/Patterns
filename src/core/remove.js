/**
 * Patterns remove - send event when objects are removed from the DOM
 *
 * Copyright 2012 Simplon B.V.
 */
define([
    "jquery"
], function($) {
    var real_cleanData = $.cleanData;

    $.cleanData = function(elems) {
        var i, el;
        for (i=0; (el=elems[i])!==undefined; i++)
            $(el).triggerHandler("destroy");
        real_cleanData.call(this, arguments);
    };
});

