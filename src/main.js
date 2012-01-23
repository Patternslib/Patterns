define([
    'require',
    './core/init',
    './patterns/toggle',
    './patterns/tooltip',
    '../lib/jquery',
    '../lib/domReady!'
], function(require) {
    var mapal = require('./core/init');
    mapal.registerWidthClass("narrow", 0, 780);
    mapal.registerWidthClass("medium", 0, 1109);
    mapal.registerWidthClass("wide", 1110, null);

    // register our patterns
    // rethink naming once all patterns are migrated to this style
    mapal.passivePatterns.toggle = require('./patterns/toggle');
    mapal.passivePatterns.tooltip = require('./patterns/tooltip');

    // Register as active pattern to prevent errors on clicks.
    // XXX: hack, what does this do?
    mapal.patterns.tooltip = { execute: function() {} };

    // wait for the DOM to be ready and initialize
    var doc = require('../lib/domReady!');
    mapal.init();
    mapal.initContent(doc.body);
    $(doc).trigger("setupFinished", doc);
});
