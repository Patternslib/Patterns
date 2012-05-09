define(function(require) {
    // a mock logger in case logging makes problems
    var mocklogger = {
        trace: function() {},
        debug: function() {},
        info: function() {},
        log: function() {},
        warn: function() {},
        error: function() {}
    };


    // for now, no logging for internet explorers
    if ($.browser.msie) {
        // levels copied from log4javascript as it currently does not load
        // in IE8 - keep in sync or better make log4javascript work with IE8
        var Level = function(level, name) {
            this.level = level;
            this.name = name;
        };

        Level.prototype = {
            toString: function() {
                return this.name;
            },
            equals: function(level) {
                return this.level == level.level;
            },
            isGreaterOrEqual: function(level) {
                return this.level >= level.level;
            }
        };

        Level.ALL = new Level(Number.MIN_VALUE, "ALL");
        Level.TRACE = new Level(10000, "TRACE");
        Level.DEBUG = new Level(20000, "DEBUG");
        Level.INFO = new Level(30000, "INFO");
        Level.WARN = new Level(40000, "WARN");
        Level.ERROR = new Level(50000, "ERROR");
        Level.FATAL = new Level(60000, "FATAL");
        Level.OFF = new Level(Number.MAX_VALUE, "OFF");

        return {
            level: Level,
            getLogger: function(name) {
                return mocklogger;
            }
        };
    }


    /*
     * below here the real logging stuff
     *
     * We said good bye to IE above
     */

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

        root.setLevel(level.ALL);
        bca.setThreshold(level.ALL);
    };

    init_console_logging();

    var logging = {
        level: Level,
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
