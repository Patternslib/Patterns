define(function(require) {
    require('../lib/log4javascript');
    var l4js = log4javascript,
        level = l4js.Level,
        rootname = 'patterns',
        root = l4js.getLogger(rootname);

    var init_console_logging = function() {
        // enable/disable all logging
        l4js.setEnabled(true);

        var bca = new l4js.BrowserConsoleAppender();
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
                if (item && item.jquery) {
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

        root.setLevel(level.INFO);
    };

    init_console_logging();

    var logging = {
        Level: l4js.Level,

        setEnabled: function(enabled) {
            l4js.setEnabled(true);
        },

        setLevel: function(level) {
            root.setLevel(level);
        },

        getLogger: function(name) {
            var logger = l4js.getLogger(rootname + (name ? '.' + name : ''));
            if (name === 'inject_log_old') logger.setLevel(level.INFO);
            // disable old injection logging for now
            if (name === 'old-injection') logger.setLevel(level.WARN);

            return logger;
        }
    };


    return logging;
});
