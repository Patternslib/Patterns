jQuery(function($) {

	// This is a demonstration of custom Mutation Events triggered by attribute
	// changes using jQuery.attr/jQuery.fn.attr functions.
	// I'm using ARIA roles & attributes for convenience, please note it is NOT
	// meant to be a demonstration of ARIA - it could just as easily use custom
	// attributes or even jQuery.data instead.

	// Convert an IDREFS string into a jQuery set
	function idrefs( str ) {
		str = $.trim(str);
		return $( str ? '#' + (str.split(/\s+/).join(',#')) : "" );
	}
	
	// Convert a jQuery set into an IDREFS string
	function ids( jq ) {
		return Array.prototype.join.call(jq.map(function() { return this.id; }), ' ');
	}
	
	// Log attr mutation events in the console (if available)
	if ( window.console && window.console.log ) {
		$(document).bind('pre-attr attr html', function(event) {
			console.log('Event %s%s: %o %o %o', event.type, 
				event.attrName ? ' @'+event.attrName : '',
				event.newValue, event, event.target);

			if ( event.isDefaultPrevented() ) {
				console.log('DEFAULT PREVENTED');
			}
		});
	}

	$(document).bind('html', function( event ) {
		var context = event.target;
		
		$('[role~=tablist]', context)
			// Listen for attribute changes
			.bind('pre-attr.@aria-activedescendant', function(event) {
				var sel = idrefs( event.newValue ).not('[aria-disabled=true]');
				if ( sel.length ) {
					// Fix the value
					event.newValue = ids( sel );
				} else {
					// A valid/enabled tab id was not given
					event.preventDefault();
				}
			})
			.bind('attr.@aria-activedescendant', function(event) {
				// Deselect previously selected tab
				idrefs( event.prevValue ).attr('tabindex', -1);
				// Select new tab
				idrefs( event.newValue ).attr('tabindex', 0);
			});

		$('[role~=tab]', context)
			// Ensure all tabs can be click focused
			.attr('tabindex', -1)
		
			.bind('attr', function(event) {
				var selected = !parseInt(event.newValue);
				$(this).toggleClass('selected', selected);
				idrefs( $.attr(this, 'aria-controls') ).attr( 'aria-hidden', !selected );
			})
		
			.bind('focus', function(event) {
				$(this).parent('[role~=tablist]').attr('aria-activedescendant', this.id);
			})
		
			.bind('keydown', function(event) {
				switch (event.keyCode) {
					case 37: $(this).prev('[role~=tab]').focus(); return false; // LEFT
					case 39: $(this).next('[role~=tab]').focus(); return false; // RIGHT
					case 36: $(this).siblings('[role~=tab]:first').focus(); return false; // HOME
					case 35: $(this).siblings('[role~=tab]:last').focus(); return false; // END
				}
			});
	
		$('button[data-selector][data-activate]', context)
			.bind('click', function() {
				$( $.attr(this, 'data-selector') ).attr( 'aria-activedescendant', $.attr(this, 'data-activate') );
			});
		
		$('[role][aria-hidden=true][data-load]', context)
			.bind('pre-attr.@aria-hidden', function(event) {
				var fn = arguments.callee;
				
				// Prevent the element from becoming visible until loaded
				event.preventDefault();
				
				$(this).load($.attr(this, 'data-load'), function() {
					$(event.target)
						.unbind('pre-attr', fn)
						.removeAttr('data-load')
						.removeAttr('aria-hidden');
				});
			});
		
		$('.replace-me', context)
			.text('This text has been inserted!');
		
		if ( context === document ) {
			// Focus the first tab
			$('[role~=tab]:first', context).focus();			
		}
	})
	.initMutation('html');

});

