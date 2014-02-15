/**
 * Patterns store - store pattern state locally in the browser
 *
 * Copyright 2008-2014 Simplon B.V. - Wichert Akkerman
 * Copyright 2011-2014 Florian Friesdorf
 * Copyright 2011 Humberto Sermeño
 */
define([
    "./logger"
], function(logger) {
    var log = logger.getLogger("store");

    function Storage(backend, prefix) {
        this.prefix=prefix;
        this.backend=backend;
    }

    Storage.prototype._key = function(name) {
        return this.prefix + ":" + name;
    };

    Storage.prototype._allKeys = function() {
        var keys = [],
            prefix = this.prefix + ":",
            prefix_length = prefix.length,
            key, i;

        for (i=0; i<this.backend.length; i++) {
            key=this.backend.key(i);
            if (key.slice(0, prefix_length)===prefix)
                keys.push(key);
        }
        return keys;
    };

    Storage.prototype.get = function(name) {
        var key = this._key(name),
            value = this.backend.getItem(key);
        if (value!==null)
            value=JSON.parse(value);
        return value;
    };

    Storage.prototype.set = function(name, value) {
        var key = this._key(name);
        return this.backend.setItem(key, JSON.stringify(value));
    };

    Storage.prototype.remove = function(name) {
        var key = this._key(name);
        return this.backend.removeItem(key);
    };

    Storage.prototype.clear = function() {
        var keys = this._allKeys();
        for (var i=0; i<keys.length; i++)
            this.backend.removeItem(keys[i]);
    };

    Storage.prototype.all = function() {
        var keys = this._allKeys(),
            prefix_length = this.prefix.length + 1,
            lk,
            data = {};

        for (var i=0; i<keys.length; i++) {
            lk = keys[i].slice(prefix_length);
            data[lk]=JSON.parse(this.backend.getItem(keys[i]));
        }
        return data;
    };

    var store = {
        supported: typeof window.sessionStorage !== 'undefined',

        local: function (name) {
            return new Storage(window.localStorage, name);
        },

        session: function (name) {
            return new Storage(window.sessionStorage, name);
        },

        validateOptions: function(trigger, options) {
            if (options.store !== "none") {
                if (!trigger.id) {
                    log.warn("state persistance requested, but element has no id", trigger);
                    options.store = "none";
                } else if (!store.supported) {
                    log.warn("state persistance requested, but browser does not support webstorage", trigger);
                    options.store = "none";
                }
            }
            return options;
        }
    };

    return store;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
