/*!
 * jQuery Mutation Events @VERSION
 *
 * Copyright (c) 2009 Adaptavist.com Ltd
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Author: Mark Gibson (jollytoad at gmail dot com)
 */
(jQuery.mutations || (function($) {

var m;
m = $.mutations = {

	REMOVAL:		3,
	ADDITION:		2,
	MODIFICATION:	1,
	INIT:			-1,
	
	// pre-mutation event prefix
	pre: 'pre-',

	// Construct a new mutation event
	event: function( type, params ) {
		var event = $.extend(new $.Event( type ), params);
		
		if ( event.attrChange === undefined ) {
			event.attrChange =
				event.newValue === null || event.newValue === undefined   ? m.REMOVAL :
				event.prevValue === null || event.prevValue === undefined ? m.ADDITION :
																			m.MODIFICATION;
		}
		
		return event;
	},
	
	// Trigger a pre and post mutation event, the pre mutation handlers may
	// cancel the mutation using event.preventDefault(), it may also modify
	// the mutation by setting the event fields.
	trigger: function( elem, eventType, eventParams, commit ) {
		var event = m.event( m.pre + eventType, eventParams ),
			opts = m.type[eventType],
			ret;
		
		if ( opts.pre ) {
//			console.log('trigger %s %s: %o -> %o %o', event.type, event.attrName, event.prevValue, event.newValue, elem);
			$.event.trigger( event, undefined, elem );
		} else {
			event.target = elem;
		}
		
		if ( !event.isDefaultPrevented() ) {
			event.type = eventType;
			ret = commit(event);
			
			if ( opts.post ) {
//				console.log('trigger %s %s: %o -> %o %o', event.type, event.attrName, event.prevValue, event.newValue, event.target);
				$.event.trigger( event, undefined, event.target );
			}
		}
		
		return ret;
	},

	type: {},
	
	// Register a new mutation event
	register: function( opts ) {
		m.type[opts.type] = opts;
		
		// Track how many bindings we have for this event type
		opts.pre = 0;
		opts.post = 0;

		// Register the pre/post mutation event types as special event type
		// so we can hook into jQuery on the first binding of this type		
		
		function special( eventType, stage ) {
			$.event.special[eventType] = {
				add: function(handler, data, namespaces) {
					
					// Call the setup on the first binding
					if ( !(opts.pre + opts.post) ) {
						opts.setup();
					}
					opts[stage]++;
					
					// If any namespaces are given prefixed with @ then limit
					// the handler to the bound element and attrNames specified
					// by the @-prefixed names.
					if ( namespaces && namespaces.length ) {
						var attrNames = {}, proxy;
						
						$.each(namespaces, function() {
							if ( '@' === this.charAt(0) ) {
								attrNames[this.substring(1)] = true;
								proxy = true;
							}
						});
						
						if ( proxy ) {
							proxy = function(event) {
								if ( this === event.target && attrNames[event.attrName] ) {
									return handler.apply(this, arguments);
								}
							};
							proxy.type = handler.type;
							return proxy;
						}
					}
				},
		
				remove: function() {
					// Call teardown when last binding is removed
					opts[stage]--;
					if ( !(opts.pre + opts.post) ) {
						opts.teardown();
					}
				}
			};
		}
		
		special(m.pre + opts.type, 'pre');
		special(opts.type, 'post');
	}
};

$.fn.extend({
	// Trigger a fake mutation event for initialisation
	initMutation: function( type, names, defaultValue ) {
		var self = this, opts = m.type[type];
		
		if ( opts && opts.init && opts.post ) {
			if ( names === undefined ) {
				self.each(function() { opts.init(this, undefined, defaultValue); });
			} else {
				$.each(names.split(/\s+/), function(n, name) {
					self.each(function() { opts.init(this, name, defaultValue); });
				});
			}
		}
		
		return this;
	}
});

})(jQuery));

