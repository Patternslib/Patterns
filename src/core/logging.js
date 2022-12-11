// Patterns logging - minimal logging framework

let writer; // writer instance, used to output log entries

const Level = {
    DEBUG: 10,
    INFO: 20,
    WARN: 30,
    ERROR: 40,
    FATAL: 50,
};

function ConsoleWriter() {}

ConsoleWriter.prototype = {
    output: function (log_name, level, messages) {
        if (log_name) {
            messages.unshift(log_name + ":");
        }
        if (level <= Level.DEBUG) {
            // console.debug exists but is deprecated
            messages.unshift("[DEBUG]");
            console.log.apply(console, messages);
        } else if (level <= Level.INFO) {
            console.info.apply(console, messages);
        } else if (level <= Level.WARN) {
            console.warn.apply(console, messages);
        } else {
            console.error.apply(console, messages);
        }
    },
};

class Logger {
    constructor(name, parent) {
        this._loggers = {};
        this.name = name || "";
        this._parent = parent || null;
        if (!parent) {
            this._enabled = true;
            this._level = Level.WARN;
        }
    }

    getLogger(name) {
        const path = name.split(".");
        const route = this.name ? [this.name] : [];
        let root = this;
        while (path.length) {
            const entry = path.shift();
            route.push(entry);
            if (!(entry in root._loggers)) {
                root._loggers[entry] = new Logger(route.join("."), root);
            }
            root = root._loggers[entry];
        }
        return root;
    }

    _getFlag(flag) {
        let context = this;
        flag = "_" + flag;
        while (context !== null) {
            if (context[flag] !== undefined) {
                return context[flag];
            }
            context = context._parent;
        }
        return null;
    }

    setEnabled(state) {
        this._enabled = !!state;
    }

    isEnabled() {
        this._getFlag("enabled");
    }

    setLevel(level) {
        if (typeof level === "number") {
            this._level = level;
        } else if (typeof level === "string") {
            level = level.toUpperCase();
            if (level in Level) {
                this._level = Level[level];
            }
        }
    }

    getLevel() {
        return this._getFlag("level");
    }

    log(level, messages) {
        if (
            !messages.length ||
            !this._getFlag("enabled") ||
            level < this._getFlag("level")
        ) {
            return;
        }
        messages = Array.prototype.slice.call(messages);
        writer.output(this.name, level, messages);
    }

    debug() {
        this.log(Level.DEBUG, arguments);
    }

    info() {
        this.log(Level.INFO, arguments);
    }

    warn() {
        this.log(Level.WARN, arguments);
    }

    error() {
        this.log(Level.ERROR, arguments);
    }

    fatal() {
        this.log(Level.FATAL, arguments);
    }
}

function getWriter() {
    return writer;
}

function setWriter(w) {
    writer = w;
}

setWriter(new ConsoleWriter());

const root = new Logger(); // root logger instance

const logconfig = /loglevel(|-[^=]+)=([^&]+)/g;
const logconfig_match = logconfig.exec(window.location.search);
while (logconfig_match !== null) {
    const logger =
        logconfig_match[1] === "" ? root : root.getLogger(logconfig_match[1].slice(1));
    logger.setLevel(logconfig_match[2].toUpperCase());
}

const api = {
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
