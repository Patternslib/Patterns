/**
 * @license
 * Patterns @VERSION@ setclass - update class on click
 *
 * Copyright 2008-2012 Simplon B.V.
 * Copyright 2011 Humberto Sermeño
 * Copyright 2011 SYSLAB.COM GmbH
 */
define([
    'require',
    '../core/store',
    '../utils'
], function(require) {
    var store = require('../core/store');
    var utils = require('../utils');

    var setclass = {
        init: function() {
            store.initPatternStore('setclass');

            $(store.getPatternAttributes('setclass')).each(function(index) {
                var values = this.split('!'); // 0: id, 1: attribute, 2: value, 3: other
                var obj = {
                        'index': index+1,
                        "id": values[0],
                        "attr": values[1],
                        'value': values[2],
                        'other': values[3]
                    };

                setclass.store[obj.id + "." + obj.attr] = obj;
            });

            $('[data-setclass]').live('click', setclass.handleClick).each(function() {
                var $this = $(this);
                var obj = setclass.getObjFromParams(
                              $this,
                                utils.extractParameters('!' + $this.attr('data-setclass'))
                          );

                if (obj === null) return;

                if ( !obj.store ) {
                     if (setclass.store[obj.id + "." + obj.attr] ) {
                        delete setclass.store[obj.id + "." + obj.attr];
                     }
                } else {
                     if (setclass.store[obj.id + "." + obj.attr] ) return;
                }
                if ( obj.attr === 'class' ) {
                //    $( "#" + obj.id ).addClass( obj.value );  // removed the removeClass which was used in toggle
                } else {
                    $( "#" + obj.id ).attr( obj.attr, obj.value );
                }

                if (obj.store) {
                    setclass.storeValue(obj.id, obj.attr, obj.value, obj.other);
                }
            });

            for (key in setclass.store ) {
                var obj = setclass.store[key];
                if ( obj.attr === 'class' ) {
                    $( "#" + obj.id ).removeClass( obj.other ).addClass( obj.value );
                } else {
                    $( "#" + obj.id ).attr( obj.attr, obj.value );
                }
            }
        },

        getObjFromParams: function($elem, params) {
            var values = params['values'];
            var obj = {};

            obj.id = params['id'] || $elem.attr("id");
            obj.attr = params['attr'] || 'class';
            obj.store = params['store'] || false;

            if (typeof obj.id !== "string" || obj.id.length == 0 ||
                typeof obj.attr !== 'string' || obj.attr.length == 0 ||
                typeof values  !== 'string' || values.length == 0 ) {
                return null;
            }

            values = values.split(':');
            if ( values.length == 1) {
                values.push('');
            }

            obj.value = values[0];
            obj.other = values[1];
            return obj;
        },

        handleClick: function(event) {
            var $this = $(this);
            if ($this.hasClass('cant-touch-this')) return;
            var params = utils.extractParameters('!' + $this.attr('data-setclass'));

            setclass.execute($this, '', '', params, event);

            event.preventDefault();
        },

        store: {},

        dataAttr: true,

        execute: function( elem, url, sources, params, event ) {
            var value, other;
            var obj = setclass.getObjFromParams( elem, params );
            if (obj === null) return false;

            var $setclass = $("#" + obj.id);
            if ($setclass.length == 0) return false;

            if (obj.attr === 'class') {
                if (obj.other.length > 0 ) {
                    var cls = $setclass.attr('class').split(' ');
                    regval = new RegExp(obj.value);
                    for (i=0;i<cls.length;i++){
                        if (cls[i].match(regval)) {
                            $setclass.removeClass(cls[i]);
                        }
                    }
                    $setclass.addClass(obj.other);
                } else if ($setclass.hasClass(obj.value) || $setclass.hasClass(obj.other)) {
                    /* obj.value already set and no other present. pass */
                } else {
                    $setclass.addClass(obj.value);
                }
            } else {
                /* cave, haven't touched that yet, is still behaving like toggle */
            /*  var current = $setclass.attr(obj.attr);
                if (current === obj.value) {
                    $setclass.attr(obj.attr, obj.other);
                    value = obj.other;
                    other = obj.value;
                } else if (current === obj.other) {
                    $setclass.attr(obj.attr, obj.value);
                    value = obj.value;
                    other = obj.other;
                } else {
                    $setclass.attr(obj.attr, obj.other);
                    value = obj.other;
                    other = obj.value;
                }*/
            }

            if (obj.store) setclass.storeValue(obj.id, obj.attr, value, other);

            return true;
        },

        storeValue: function(id, attr, value, other) {
            var aStore = setclass.store[id + '.' + attr];
            if ( aStore ) {
                store.setPatternAttribute('setclass', aStore.index, id + "!" + attr + "!" + value + "!" + other);
            } else {
                store.addPatternAttribute('setclass', id + "!" + attr + "!" + value + "!" + other);
            }
        }
    };
    return setclass;
});
