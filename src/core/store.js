/**
 * @license
 * Patterns @VERSION@ store - store pattern state locally in the browser
 *
 * Copyright 2008-2012 Simplon B.V.
 * Copyright 2011 Humberto Sermeño
 * Copyright 2011 SYSLAB.COM GmbH
 */
define([
    'require'
], function(require) {
    var store = {
        'getPatternAttributes': function(pattern) {
            if (!store.hasStorage()) return [];

            var count = parseInt(window.sessionStorage.getItem( pattern + '-count' ) || "0");
            var attrs = [];

            for (var i = 1; i <= count; i++ ) {
                attrs.push(window.sessionStorage.getItem( pattern + '-' + i ));
            }

            return attrs;
        },

        'addPatternAttribute': function(pattern, value) {
            if (!store.hasStorage()) return;

            var count = parseInt(window.sessionStorage.getItem( pattern + '-count' ) || "0") + 1;

            window.sessionStorage.setItem( pattern + '-count', count );
            window.sessionStorage.setItem( pattern + '-' + count, value );
        },

        'setPatternAttribute': function(pattern, index, value) {
            if (!store.hasStorage()) return;

            var count = parseInt(window.sessionStorage.getItem( pattern + '-count' ) || "0");

            if (index > 0 && index <= count) {
                window.sessionStorage.setItem( pattern + '-' + index, value);

                return true;
            }

            return false;
        },

        'initPatternStore': function(pattern) {
            if (!store.hasStorage()) return;

            if (window.sessionStorage.getItem( pattern+'-count' ) === null) {
                window.sessionStorage.setItem( pattern+'-count', '0' );
            }
        },

        'hasStorage': function() {
            return typeof window.sessionStorage !== 'undefined';
        }
    };
    return store;
});
