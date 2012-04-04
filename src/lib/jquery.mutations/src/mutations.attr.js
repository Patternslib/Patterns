/*
 * jQuery.attr Mutation Events @VERSION
 *
 * Copyright (c) 2009 Adaptavist.com Ltd
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Author: Mark Gibson (jollytoad at gmail dot com)
 */
define([
    './mutations.core'
], function() {
(jQuery.mutations && (function($) {

$.mutations.register({
	// The event type triggered after a mutation,
	// "pre-" is prepended to this for the pre-mutation event.
	type: 'attr',
	
	// The blacklist can hold attributes that should never trigger an event
	blacklist: {},
	
	// Hook into jQuery when an event of this type is first bound
	setup: function() {
		var opts = this,
			attr = $.attr,
			trigger = $.mutations.trigger;
		
		// Save the original $.attr function
		this._attr = attr;
		
		// Override $.attr
		$.attr = function( elem, name, newValue, silent ) {
			var prevValue = attr(elem, name);

			if ( newValue === undefined ) {
				return prevValue;
			}

			if ( silent || opts.blacklist[name] ) {

				return attr(elem, name, newValue);
				
			} else if ( ""+newValue !== ""+prevValue ) { // Ensure a string comparison
				
				return trigger( elem, opts.type, {
						attrName: name,
						prevValue: prevValue,
						newValue: newValue === "" ? undefined : newValue
					},
					function( event ) {
						return attr( event.target, event.attrName, event.newValue );
					}
				);
			}
		};
	},
	
	// Remove hooks once all events of this type have been unbound
	teardown: function() {
		$.attr = this._attr;
		delete this._attr;
	},
	
	// Force an event to be trigger - useful for initialisation
	init: function( elem, name, defaultValue ) {
		var value = this._attr(elem, name) || defaultValue;
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

});