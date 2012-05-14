// uncomment following to disable caching - good for develoment
// we still need a way to configure this, needs some thinking

//require.config({
//    urlArgs: "bust=" +  (new Date()).getTime()
//});

define([
    'require',
    // '../lib/css3-mediaqueries',
    '../lib/modernizr-2.0.6',
    './core/init',
    './core/parser',
    './core/store',
    './patterns',
    './patterns/change',
    './patterns/fancybox',
    './patterns/floatingpanel',
    './patterns/fullcalendar',
    './patterns/old_modal',
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
    mapal.passivePatterns.change = require('./patterns/change');
    mapal.passivePatterns.fullcalendar = require('./patterns/fullcalendar');
    mapal.passivePatterns.toggle = require('./patterns/toggle');
    mapal.passivePatterns.tooltip = require('./patterns/tooltip');

    // Register as active pattern to prevent errors on clicks.
    // XXX: hack, what does this do?
    mapal.patterns.tooltip = { execute: function() {} };
    mapal.patterns.fancybox = require('./patterns/fancybox');
    mapal.patterns.floatingPanelContextual = require('./patterns/floatingpanel');
    mapal.patterns.modal = require('./patterns/old_modal');
    mapal.patterns.selfHealing = require('./patterns/selfhealing');
    mapal.patterns.setclass = require('./patterns/setclass');

    // new-style patterns
    mapal.newstyle = require('./patterns');

    $(document).on('inject.patterns.scan', function(ev, opts) {
        mapal.initContent(ev.target, opts);
        $(ev.target).trigger('patterns-inject-scanned', opts);
    });

    // wait for the DOM to be ready and initialize
    $(document).ready(function(){
        mapal.init();
        mapal.initContent(document.body);
        $(document).trigger("setupFinished", document);
    });

    return mapal;
});
