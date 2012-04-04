/*
 * jQuery.data Mutation Events @VERSION
 *
 * Copyright (c) 2009 Adaptavist.com Ltd
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Author: Mark Gibson (jollytoad at gmail dot com)
 */
(jQuery.mutations && (function($) {

$.mutations.register({
	// The event type triggered after a mutation,
	// "pre-" is prepended to this for the pre-mutation event.
	type: 'data',
	
	// The blacklist holds data item names that should never trigger an event
	blacklist: { 'events':true, 'handle':true, 'olddisplay':true, 'closest':true },
	
	// Hook into jQuery when an event of this type is first bound
	setup: function() {
		var opts = this,
			data = $.data,
			removeData = $.removeData,
			trigger = $.mutations.trigger;
		
		// Save the original $.data function
		this._data = data;
		this._removeData = removeData;
		
		// Override $.data
		$.data = function( elem, name, newValue, silent ) {
			var prevValue = data(elem, name);

			if ( newValue === undefined ) {
				return prevValue;
			}

			if ( silent || opts.blacklist[name] ) {

				return data(elem, name, newValue);
				
			} else if ( newValue !== prevValue ) {
				
				return trigger( elem, opts.type, {
						attrName: name,
						prevValue: prevValue,
						newValue: newValue
					},
					function( event ) {
						return data( event.target, event.attrName, event.newValue );
					}
				);
			}
		};
		
		$.removeData = function( elem, name, silent ) {
			if ( silent || opts.blacklist[name] ) {
				return removeData( elem, name );
			}

			return trigger( elem, opts.type, {
					attrName: name,
					prevValue: data(elem, name),
					attrChange: $.mutations.REMOVAL
				},
				function(event) {
					if ( event.attrChange === $.mutations.REMOVAL ) {
						removeData( event.target, event.attrName );
					} else {
						// The event handler wants the data modified rather than removed
						data( event.target, event.attrName, event.newValue );
					}
				}
			);
		};
	},
	
	// Remove hooks once all events of this type have been unbound
	teardown: function() {
		$.data = this._data;
		$.removeData = this._removeData;
		delete this._data;
		delete this._removeData;
	},
	
	// Force an event to be trigger - useful for initialisation
	init: function( elem, name, defaultValue ) {
		var value = this._data(elem, name) || defaultValue;
		if ( value !== undefined ) {
			$.event.trigger(
				$.mutations.event(this.type, {
					attrName: name,
					newValue: value,
					attrChange: $.mutations.INIT
				}),
				undefined, elem
			);
		}
	}
});

})(jQuery));

