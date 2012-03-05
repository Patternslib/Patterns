define([
    'require',
    './lib/jquery',
    './lib/domReady!',
    './lib/modernizr',
    './core/init',
    './core/parser',
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

    // new-style patterns
    mapal.newstyle = {};
    mapal.newstyle.collapsible = require('./patterns/collapsible');

    // hook in new-style patterns
    mapal.passivePatterns.newstyle = { initContent: function(root) {
        for (var name in mapal.newstyle) {
            var pattern = mapal.newstyle[name],
                initialization = name + '-initialized',
                trigger = '.' + name + (
                    pattern.trigger ? (',' + pattern.trigger) : ''
                );
            $(root).find(trigger).each(function(idx) {
                var $this = $(this), ret,
                    loaded = $this.data(initialization);
                if (!loaded) {
                    if (!$this.hasClass(name)) $this.addClass(name);
                    ret = (pattern.init ? pattern.init : pattern)($this, idx);
                    $this.data(initialization, true);
                }
                return ret;
            });
        }
    }};

    // wait for the DOM to be ready and initialize
    var doc = require('./lib/domReady!');
    mapal.init();
    mapal.initContent(doc.body);
    $(doc).trigger("setupFinished", doc);
});
