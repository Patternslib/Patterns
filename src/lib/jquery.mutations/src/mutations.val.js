/*
 * jQuery.fn.val Mutation Events @VERSION
 *
 * Copyright (c) 2009 Adaptavist.com Ltd
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Author: Mark Gibson (jollytoad at gmail dot com)
 */
(jQuery.mutations && (function($) {

$.mutations.register({
	type: 'val',
	
	setup: function() {
		var opts = this,
			val = $.fn.val,
			trigger = $.mutations.trigger;
		
		this._val = val;
		
		$.fn.val = function( newValue, silent ) {
			if ( newValue === undefined ) {
				return val.apply(this);
			}
			
			if ( silent ) {
				return val.call( this, newValue );
			}
			
			return this.each(function() {
				var prevValue = val.apply([this]);
				
				if ( newValue !== prevValue ) {
					trigger( this, opts.type,
						{ newValue: newValue, prevValue: prevValue},
						function( event ) {
							val.call( $(event.target), event.newValue );
						}
					);
				}
			});
		};
	},
	
	// Remove hooks once all events of this type have been unbound
	teardown: function() {
		$.fn.val = this._val;
		delete this._val;
	},
	
	init: function( elem, name ) {
		$.event.trigger($.mutations.event(this.type, { attrChange: $.mutations.INIT }), undefined, elem);	
	}
});

})(jQuery));

