define([
    'require',
    'patternregistry',
    './core/init',
    './patterns/toggle',
    '../../lib/jquery',
    '../lib/domReady!'
], function(require) {
    var mapal = require('./core/init');
    mapal.registerWidthClass("narrow", 0, 780);
    mapal.registerWidthClass("medium", 0, 1109);
    mapal.registerWidthClass("wide", 1110, null);

    // register our patterns
    // rethink naming once all patterns are migrated to this style
    var mapal.passivePatterns.toggle = require('./patterns/toggle');

    // wait for the DOM to be ready and initialize
    var doc = require('../lib/domReady!');
    mapal.init();
    mapal.initContent(doc.body);
    $(doc).trigger("setupFinished", doc);
});
