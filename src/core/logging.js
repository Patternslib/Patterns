define([
    "jquery",
    "log4javascript"
], function($) {
    var l4js = log4javascript,
        rootname = 'patterns',
        root = l4js.getLogger(rootname),
        log = l4js.getLogger(rootname + '.logging');

    // default log level mapping
    //
    // you can override these via the url search parameter:
    // foo.html?pat-loglevel=WARN&pat-loglevel-inject=DEBUG
    //
    var LEVELMAP = {
        patterns: l4js.Level.INFO
        //"patterns.inject": l4js.Level.DEBUG
    };
    var loglevelFromUrl = function() {
        // check URL for loglevel config
        var loglevel_re =/pat-loglevel-?([^=]*)=([^&]+)/g,
            level, name, m;
        while (true) {
            m = loglevel_re.exec(window.location.search);
            if (!m)
                break;
            name = rootname + (m[1] ? '.' + m[1] : "");
            level = m[2].toUpperCase();
            if (!l4js.Level[level])
                log.warn('Unknown log level:', level, m);
            else
                LEVELMAP[name] = l4js.Level[level];
        }
    };
    loglevelFromUrl();
    root.setLevel(LEVELMAP[rootname]);

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
    };

    init_console_logging();

    var logging = {
        Level: l4js.Level,

        setEnabled: function(enabled) {
            l4js.setEnabled(enabled);
        },

        setLevel: function(level) {
            root.setLevel(level);
        },

        // XXX: get this into l4js:
        // logging.getLogger("foo").getLogger("bar").getLogger("baz");
        getLogger: function(name) {
            var logname = rootname + (name ? '.' + name : ''),
                log = l4js.getLogger(logname),
                level = LEVELMAP[logname];
            if (level)
                log.setLevel(level);
            return log;
        }
    };


    return logging;
});
