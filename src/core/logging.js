/**
 * Patterns logging - minimal logging framework
 *
 * Copyright 2012 Simplon B.V.
 */

// source: https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError(
                "Function.prototype.bind - what is trying to be bound is not callable"
            );
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(
                    this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments))
                );
            };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}

var root, // root logger instance
    writer; // writer instance, used to output log entries

var Level = {
    DEBUG: 10,
    INFO: 20,
    WARN: 30,
    ERROR: 40,
    FATAL: 50,
};

function ConsoleWriter() {}

ConsoleWriter.prototype = {
    output: function (log_name, level, messages) {
        if (log_name) messages.unshift(log_name + ":");
        if (level <= Level.DEBUG) console.debug.apply(console, messages);
        else if (level <= Level.INFO) console.info.apply(console, messages);
        else if (level <= Level.WARN) console.warn.apply(console, messages);
        else console.error.apply(console, messages);
    },
};

function Logger(name, parent) {
    this._loggers = {};
    this.name = name || "";
    this._parent = parent || null;
    if (!parent) {
        this._enabled = true;
        this._level = Level.WARN;
    }
}

Logger.prototype = {
    getLogger: function (name) {
        var path = name.split("."),
            root = this,
            route = this.name ? [this.name] : [];
        while (path.length) {
            var entry = path.shift();
            route.push(entry);
            if (!(entry in root._loggers))
                root._loggers[entry] = new Logger(route.join("."), root);
            root = root._loggers[entry];
        }
        return root;
    },

    _getFlag: function (flag) {
        var context = this;
        flag = "_" + flag;
        while (context !== null) {
            if (context[flag] !== undefined) return context[flag];
            context = context._parent;
        }
        return null;
    },

    setEnabled: function (state) {
        this._enabled = !!state;
    },

    isEnabled: function () {
        this._getFlag("enabled");
    },

    setLevel: function (level) {
        if (typeof level === "number") this._level = level;
        else if (typeof level === "string") {
            level = level.toUpperCase();
            if (level in Level) this._level = Level[level];
        }
    },

    getLevel: function () {
        return this._getFlag("level");
    },

    log: function (level, messages) {
        if (
            !messages.length ||
            !this._getFlag("enabled") ||
            level < this._getFlag("level")
        )
            return;
        messages = Array.prototype.slice.call(messages);
        writer.output(this.name, level, messages);
    },

    debug: function () {
        this.log(Level.DEBUG, arguments);
    },

    info: function () {
        this.log(Level.INFO, arguments);
    },

    warn: function () {
        this.log(Level.WARN, arguments);
    },

    error: function () {
        this.log(Level.ERROR, arguments);
    },

    fatal: function () {
        this.log(Level.FATAL, arguments);
    },
};

function getWriter() {
    return writer;
}

function setWriter(w) {
    writer = w;
}

setWriter(new ConsoleWriter());

root = new Logger();

var logconfig = /loglevel(|-[^=]+)=([^&]+)/g,
    match;

while ((match = logconfig.exec(window.location.search)) !== null) {
    var logger = match[1] === "" ? root : root.getLogger(match[1].slice(1));
    logger.setLevel(match[2].toUpperCase());
}

var api = {
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
    fatal: root.fatal.bind(root),
    getWriter: getWriter,
    setWriter: setWriter,
};

export default api;
