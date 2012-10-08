requirejs.config({
    paths: {
        "jquery": "3rdparty/require-jquery",
	"prefixfree": "3rdparty/prefixfree.min",
        "modernizr": "3rdparty/modernizr-2.0.6",
	"jquery.anythingslider": "3rdparty/jquery.anythingslider",
        "jquery.autoSuggest": "3rdparty/jquery.autosuggest",
        "jquery.fancybox": "3rdparty/jquery.fancybox-1.3.4",
        "jquery.form": "lib/jquery.form/jquery.form",
        "jquery.placeholder": "3rdparty/jquery.placeholder",
        "jquery.tools": "3rdparty/jquery.tools.min"
    },
    shim: {
        "jquery.form": {
            deps: ["jquery"],
            exports: "jQuery.fn.ajaxSubmit"
        },

        "jquery.anythingslider": {
            deps: ["jquery"],
            exports: "jQuery.fn.anythingSlider"
        },
        "jquery.autoSuggests": {
            deps: ["jquery"],
            exports: "jQuery.fn.autoSuggest"
        },
        "jquery.placeholder": {
            deps: ["jquery"],
            exports: "jQuery.fn.placeholder"
        },
        "jquery-ext": {
            deps: ["jquery"],
            exports: "jQuery.fn.simplePlaceholder"
        }
    }
});


define([
    'require',
    'jquery',
    'prefixfree',
    'modernizr',
    './core/init',
    './core/parser',
    './core/store',
    './patterns',
    './patterns/transforms',
    './patterns/autofocus',
    './patterns/autosubmit',
    './patterns/checklist',
    './patterns/depends',
    './patterns/switch',
    './patterns/fancybox',
    './patterns/floatingpanel',
    './patterns/fullcalendar',
    './patterns/old_modal',
    './patterns/selfhealing',
    './patterns/setclass',
    './patterns/toggle',
    './patterns/tooltip',
    './patterns/focus',
    './patterns/checkedflag'
], function(require, $) {
    var mapal = require('./core/init');
    mapal.registerWidthClass("narrow", 0, 780);
    mapal.registerWidthClass("medium", 0, 1109);
    mapal.registerWidthClass("wide", 1110, null);

    mapal.store = require('./core/store');

    // register our patterns
    // rethink naming once all patterns are migrated to this style
    mapal.passivePatterns.transforms = require('./patterns/transforms');
    mapal.passivePatterns.autofocus = require('./patterns/autofocus');
    mapal.passivePatterns.autosubmit = require('./patterns/autosubmit');
    mapal.passivePatterns.checklist = require('./patterns/checklist');
    mapal.passivePatterns.depends = require('./patterns/depends');
    mapal.passivePatterns.switcher = require('./patterns/switch');
    mapal.passivePatterns.fullcalendar = require('./patterns/fullcalendar');
    mapal.passivePatterns.toggle = require('./patterns/toggle');
    mapal.passivePatterns.tooltip = require('./patterns/tooltip');
    mapal.passivePatterns.focus = require('./patterns/focus');
    mapal.passivePatterns.checkedflag = require('./patterns/checkedflag');

    // Register as active pattern to prevent errors on clicks.
    // XXX: hack, what does this do?
    mapal.patterns.tooltip = { execute: function() {} };
    mapal.patterns.fancybox = require('./patterns/fancybox');
    mapal.patterns.floatingPanelContextual = require('./patterns/floatingpanel');
    mapal.patterns.modal = require('./patterns/old_modal');
    mapal.patterns.selfHealing = require('./patterns/selfhealing');
    mapal.patterns.setclass = require('./patterns/setclass');
    mapal.patterns.focus = require('./patterns/focus');
    mapal.patterns.checkedflag = require('./patterns/checkedflag');

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
