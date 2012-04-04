/*
 * jQuery.fn.html Mutation Events @VERSION
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
	type: 'html',
	
	setup: function() {
		var html = $.fn.html,
			trigger = $.mutations.trigger;
		
		this._html = html;
		
		$.fn.html = function( newValue, silent ) {
			if ( newValue === undefined ) {
				return html.apply(this);
			}
			
			if ( silent ) {
				return html.call( this, newValue );
			}
			
			return this.each(function() {
				trigger( this, 'html',
					{ newValue: newValue, attrChange: $.mutations.MODIFICATION },
					function( event ) {
						html.call( $(event.target), event.newValue );
					}
				);
			});
		};
	},
	
	teardown: function() {
		$.fn.html = this._html;
		delete this._html;
	},
	
	init: function( elem ) {
		$.event.trigger($.mutations.event(this.type, { attrChange: $.mutations.INIT }), undefined, elem);	
	}
});

})(jQuery));

});