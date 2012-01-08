/**
 * @license
 * Patterns @VERSION fancybox - automatic fancybox setup
 *
 * Copyright 2008-2012 Simplon B.V.
 * Copyright 2011 Humberto Sermeño
 * Copyright 2011 SYSLAB.COM GmbH
 * 
 * Date: @DATE
 */
$.extend( mapal.patterns, {
    "setclass": {
		init: function() {
			mapal.store.initPatternStore('setclass');

			$(mapal.store.getPatternAttributes('setclass')).each(function(index) {
				var values = this.split('!'); // 0: id, 1: attribute, 2: value, 3: other
				var obj = {
						'index': index+1,
						"id": values[0],
						"attr": values[1],
						'value': values[2],
						'other': values[3]
					};
				
				mapal.patterns.setclass.store[obj.id + "." + obj.attr] = obj; 
			});

			$('[data-setclass]').live('click', mapal.patterns.setclass.handleClick).each(function() {
				var $this = $(this);
				var obj = mapal.patterns.setclass.getObjFromParams(
							  $this,
						  	  mapal.patterns.extractParameters('!' + $this.attr('data-setclass'))
						  );
				
				if (obj === null) return;

				if ( !obj.store ) {
					 if (mapal.patterns.setclass.store[obj.id + "." + obj.attr] ) {
						delete mapal.patterns.setclass.store[obj.id + "." + obj.attr];
					 }
				} else {
					 if (mapal.patterns.setclass.store[obj.id + "." + obj.attr] ) return;
				}
				if ( obj.attr === 'class' ) {
				//	$( "#" + obj.id ).addClass( obj.value );  // removed the removeClass which was used in toggle
				} else {
					$( "#" + obj.id ).attr( obj.attr, obj.value );
				}
				
				if (obj.store) {
					mapal.patterns.setclass.storeValue(obj.id, obj.attr, obj.value, obj.other);
				}
			});
			
			for (key in mapal.patterns.setclass.store ) {
				var obj = mapal.patterns.setclass.store[key];
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
			var params = mapal.patterns.extractParameters('!' + $this.attr('data-setclass'));
			
			mapal.patterns.setclass.execute($this, '', '', params, event);
			
			event.preventDefault();			
		},
		
		store: {},
		
		dataAttr: true,
		
		execute: function( elem, url, sources, params, event ) {
			var value, other;
			var obj = mapal.patterns.setclass.getObjFromParams( elem, params );
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
			/*	var current = $setclass.attr(obj.attr);
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
			
			if (obj.store) mapal.patterns.setclass.storeValue(obj.id, obj.attr, value, other);
			
			return true;
		},
		
		storeValue: function(id, attr, value, other) {
			var store = mapal.patterns.setclass.store[id + '.' + attr];
			if ( store ) {
				mapal.store.setPatternAttribute('setclass', store.index, id + "!" + attr + "!" + value + "!" + other);
			} else {
				mapal.store.addPatternAttribute('setclass', id + "!" + attr + "!" + value + "!" + other);
			}
		}
	},
	"toggle": {
		init: function() {
			mapal.store.initPatternStore('toggle');

			$(mapal.store.getPatternAttributes('toggle')).each(function(index) {
				var values = this.split('!'); // 0: id, 1: attribute, 2: value, 3: other
				var obj = {
						'index': index+1,
						"id": values[0],
						"attr": values[1],
						'value': values[2],
						'other': values[3]
					};
				
				mapal.patterns.toggle.store[obj.id + "." + obj.attr] = obj; 
			});

			$('[data-toggle]').live('click', mapal.patterns.toggle.handleClick).each(function() {
				var $this = $(this);
				var obj = mapal.patterns.toggle.getObjFromParams(
							  $this,
						  	  mapal.patterns.extractParameters('!' + $this.attr('data-toggle'))
						  );
				
				if (obj === null) return;

				if ( !obj.store ) {
					 if (mapal.patterns.toggle.store[obj.id + "." + obj.attr] ) {
						delete mapal.patterns.toggle.store[obj.id + "." + obj.attr];
					 }
				} else {
					 if (mapal.patterns.toggle.store[obj.id + "." + obj.attr] ) return;
				}
				
				if ( obj.attr === 'class' ) {
					$( "#" + obj.id ).removeClass( obj.other ).addClass( obj.value );
				} else {
					$( "#" + obj.id ).attr( obj.attr, obj.value );
				}
				
				if (obj.store) {
					mapal.patterns.toggle.storeValue(obj.id, obj.attr, obj.value, obj.other);
				}
			});
			
			for (key in mapal.patterns.toggle.store ) {
				var obj = mapal.patterns.toggle.store[key];
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
			var params = mapal.patterns.extractParameters('!' + $this.attr('data-toggle'));
			
			mapal.patterns.toggle.execute($this, '', '', params, event);
			
			event.preventDefault();			
		},
		
		store: {},
		
		dataAttr: true,
		
		execute: function( elem, url, sources, params, event ) {
			var value, other;
			var obj = mapal.patterns.toggle.getObjFromParams( elem, params );
			if (obj === null) return false;
			
			var $toggle = $("#" + obj.id);			
			if ($toggle.length == 0) return false;
			
			if (obj.attr === 'class') {
				if ($toggle.hasClass(obj.value)) {
					$toggle.removeClass(obj.value).addClass(obj.other);
					value = obj.other;
					other = obj.value;
				} else if ( obj.other.length > 0 && $toggle.hasClass(obj.other)) {
					$toggle.removeClass(obj.other).addClass(obj.value);
					value = obj.value;
					other = obj.other;
				} else {
					$toggle.addClass(obj.value);
					value = obj.value;
					other = obj.other;
				}
			} else {
				var current = $toggle.attr(obj.attr);
				
				if (current === obj.value) {
					$toggle.attr(obj.attr, obj.other);
					value = obj.other;
					other = obj.value;
				} else if (current === obj.other) {
					$toggle.attr(obj.attr, obj.value);
					value = obj.value;
					other = obj.other;
				} else {
					$toggle.attr(obj.attr, obj.other);
					value = obj.other;
					other = obj.value;
				}
			}
			
			if (obj.store) mapal.patterns.toggle.storeValue(obj.id, obj.attr, value, other);
			
			return true;
		},
		
		storeValue: function(id, attr, value, other) {
			var store = mapal.patterns.toggle.store[id + '.' + attr];
			if ( store ) {
				mapal.store.setPatternAttribute('toggle', store.index, id + "!" + attr + "!" + value + "!" + other);
			} else {
				mapal.store.addPatternAttribute('toggle', id + "!" + attr + "!" + value + "!" + other);
			}
		}
	}
});
