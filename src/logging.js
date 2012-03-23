define([
    'require',
    '../lib/log4javascript',
    './lib/jquery.form/jquery.form'
], function(require) {
    var l4js = log4javascript,
        level = l4js.Level,
        rootname = 'patterns';

    // enable/disable all logging
    l4js.setEnabled(true);

    // enable debugging info for ajaxSubmit - untested
    //$.fn.ajaxSubmit.debug = true;

    var bca = new l4js.BrowserConsoleAppender(),
        root = l4js.getLogger(rootname);
    root.addAppender(bca);


    var Layout = function() {
        this.customFields = [];
        this.layout_noobjects = new l4js.PatternLayout('%p %c: %m');
        this.layout_objects = new l4js.PatternLayout('%p %c:');
    };
    Layout.prototype = new l4js.Layout();
    Layout.prototype.format = function(loggingEvent) {
        var hasobjects = false;
        loggingEvent.messages = $.map(loggingEvent.messages, function(item) {
            if ($.isPlainObject(item)) hasobjects = true;
            if (item.jquery) {
                hasobjects = true;
                item = item.clone();
            }
            return item;
        });
        if (hasobjects) {
            var prefix = this.layout_objects.format(loggingEvent);
            loggingEvent.messages.unshift(prefix);
            return loggingEvent.messages;
        } else {
            return this.layout_noobjects.format(loggingEvent);
        }
    };
    Layout.prototype.ignoresThrowable = function() {
        return true;
    };
    Layout.prototype.toString = function() {
        return "NullLayout";
    };

    var layout = new Layout();
    bca.setLayout(layout);

    //// Available log levels:
    // level.ALL
    // level.TRACE
    // level.DEBUG
    // level.INFO
    // level.WARN
    // level.ERROR
    // level.FATAL
    // level.OFF
    root.setLevel(level.ALL);
    bca.setThreshold(level.ALL);

    var logging = {
        level: level,
        getLogger: function(name) {
            return l4js.getLogger(rootname + (name ? '.' + name : '') );
        }
    };

    return logging;
});