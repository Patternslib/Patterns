/*
 * jQuery IE6-CSS @VERSION
 *
 * Copyright (c) 2009 Adaptavist.com
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 */
/* Add/remove css class names to elements to represent the current attributes,
 * for backwards compatibility with backwards browsers - you know who you are!
 *
 * I'd recommend including this, and the supporting CSS file in a conditional comment:
 *
 * <!--[if lt IE 6]>
 * <script type="text/javascript" src="mutations.ie6css.js"/>
 * <![endif]-->
 *
 * Depends:
 *   mutations.attr.js
 *   mutations.html.js (optional)
 */
(function($) {

$.ie6css = {

	defaults: {
		root: document,
		
		// Convert an attribute name and value into CSS class names
		classNames: function( attrName, value, elem ) {
			return value ? attrName + (''+value).replace(/(^|\s+)(?=\S)/g, ' '+attrName+'-') : '';
		},
	
		// A selector or function for filtering elements to perform conversion on
		selector: '*',
	
		// A function to filter attributes to perform conversion on
		filterAttr: function( attrName, elem ) {
			return !this.blacklist[attrName];
		},
		
		blacklist: {
			'class': true,
			'id': true
		}
	},

	setup: function( options ) {
		var opts = $.extend({}, $.ie6css.defaults, options);
		
		$(opts.root)
			.bind('attr.ie6css', function(event) {
				var self = $(event.target);
				if ( self.is(opts.selector) && opts.filterAttr(event.attrName, event.target) ) {
					self
						.removeClass(opts.classNames(event.attrName, event.prevValue, event.target))
						.addClass(opts.classNames(event.attrName, event.newValue, event.target));
				}
			})
			.bind('html.ie6css', function(event) {
				$(opts.selector, event.target)
					.each(function() {
						var elem = this, classes = [];
						
						$.each(elem.attributes, function() {
							if (this && this.specified && opts.filterAttr(this.nodeName, elem)) {
								classes.push(opts.classNames(this.nodeName, this.nodeValue, elem));
							}
						});
												
						if ( classes.length ) {
							$(elem).addClass(classes.join(' '));
						}
					});
			});
	},
	
	teardown: function( root ) {
		$(root).unbind('.ie6css');
	}
};

})(jQuery);

