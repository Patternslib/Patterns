/**
 * Patterns logging - minimal logging framework
 *
 * Copyright 2012 Simplon B.V.
 */

define(function() {
    var root,    // root logger instance
        writer;  // writer instance, used to output log entries

    var Level = {
        DEBUG: 10,
        INFO: 20,
        WARN: 30,
        ERROR: 40,
        FATAL: 50
    };

    function BaseWriter() {
    }

    BaseWriter.prototype = {
        _levelName: function(level) {
            if (level<=Level.DEBUG)
                return "DEBUG";
            if (level<=Level.INFO)
                return "INFO";
            if (level<=Level.WARN)
                return "WARN";
            if (level<=Level.ERROR)
                return "ERROR";
            return "FATAL";
        },

        format: function(level, message) {
            var level_name = this._levelName(level);
            return "[" + level_name + "] " + message;
        }
    };

    function ConsoleWriter() {
    }

    ConsoleWriter.prototype = new BaseWriter();
    ConsoleWriter.prototype.output = function(level, message) {
        // console.log will magically appear in IE8 when the user opens the
        // F12 Developer Tools, so we have to test for it every time.
        if (console!==undefined && console.log!==undefined)
            console.log(this.format(level, message));
    };


    function FirebugWriter() {
    }

    FirebugWriter.prototype = new BaseWriter();
    ConsoleWriter.prototype.output = function(level, message) {
        var formatted = this.format(level, message);
        if (level<=Level.DEBUG)
            console.debug(formatted);
        else if (level<=Level.INFO)
            console.info(formatted);
        else if (level<=Level.WARN)
            console.warn(formatted);
        else
            console.error(formatted);
    };


    function Logger(name, parent) {
        this._loggers={};
        this.name=name || "";
        this.parent=parent || null;
        if (name==="root") {
            this._enabled=true;
            this._level=Level.INFO;
        }
    }

    Logger.prototype = {
        getLogger: function(name) {
            if (!(name in this._loggers))
                this._loggers[name] = new Logger(name, this);
            return this._loggers[name];
        },

        _getFlag: function(flag) {
            var context=this;
            while (context!==null) {
                if (context[flag]!==undefined)
                    return context[flag];
                context=context.parent;
            }
            return null;
        },

        setEnabled: function(state) {
            this._enabled=!!state;
        },

        isEnabled: function() {
            this._getFlag("enabled");
        },

        setLevel: function(level) {
            if (typeof level==="number")
                this._level=level;
            else if (level in Level)
                this._level=Level[level];
        },

        getLevel: function() {
            return this._getFlag("level");
        },

        log: function(level, message) {
            if (!this._getFlag("enabled") || this._getFlag("level")<this.level)
                return;
            writer.output(level, message);
        },

        debug: function(message) {
            this.log(Level.DEBUG, message);
        },

        info: function(message) {
            this.log(Level.INFO, message);
        },

        warn: function(message) {
            this.log(Level.WARN, message);
        },

        error: function(message) {
            this.log(Level.ERROR, message);
        },

        fatal: function(message) {
            this.log(Level.FATAL, message);
        }
    };

    if (window.console!==undefined && window.console.debug!==undefined)
        writer=new FirebugWriter();
    else
        writer=new ConsoleWriter();

    root=new Logger();

    return {
        Level: Level,
        getLogger: root.getLogger.bind(root),
        setEnabled: root.setEnabled.bind(root),
        isEnabled: root.isEnabled.bind(root),
        setLevel: root.setLevel.bind(root),
        getLevel: root.getLevel.bind(root),
        debug: root.debug.bind(root),
        info: root.info.bind(root),
        warn: root.warn.bind(root),
        error: root.error.bind(root),
        fatal: root.fatal.bind(root)
    };
});
