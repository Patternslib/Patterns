define([
    'require',
    './lib/jquery',
    './lib/domReady!',
    './lib/modernizr',
    './core/init',
    './core/store',
    './patterns/autosubmit',
    './patterns/change',
    './patterns/collapsible',
    './patterns/fancybox',
    './patterns/floatingpanel',
    './patterns/fullcalendar',
    './patterns/modal',
    './patterns/selfhealing',
    './patterns/setclass',
    './patterns/toggle',
    './patterns/tooltip'
], function(require) {
    var mapal = require('./core/init');
    mapal.registerWidthClass("narrow", 0, 780);
    mapal.registerWidthClass("medium", 0, 1109);
    mapal.registerWidthClass("wide", 1110, null);

    mapal.store = require('./core/store');

    // register our patterns
    // rethink naming once all patterns are migrated to this style
    mapal.passivePatterns.autosubmit = require('./patterns/autosubmit');
    mapal.passivePatterns.change = require('./patterns/change');
    mapal.passivePatterns.collapsible = require('./patterns/collapsible');
    mapal.passivePatterns.fullcalendar = require('./patterns/fullcalendar');
    mapal.passivePatterns.toggle = require('./patterns/toggle');
    mapal.passivePatterns.tooltip = require('./patterns/tooltip');

    // Register as active pattern to prevent errors on clicks.
    // XXX: hack, what does this do?
    mapal.patterns.tooltip = { execute: function() {} };
    mapal.patterns.fancybox = require('./patterns/fancybox');
    mapal.patterns.floatingPanelContextual = require('./patterns/floatingpanel');
    mapal.patterns.modal = require('./patterns/modal');
    mapal.patterns.selfHealing = require('./patterns/selfhealing');
    mapal.patterns.setclass = require('./patterns/setclass');

    // wait for the DOM to be ready and initialize
    var doc = require('./lib/domReady!');
    mapal.init();
    mapal.initContent(doc.body);
    $(doc).trigger("setupFinished", doc);
});
