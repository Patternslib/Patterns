/**
 * @license
 * Patterns @VERSION@ floatingPanel - easily create floating panels
 *
 * Copyright 2008-2012 Simplon B.V.
 * Copyright 2011 Humberto Sermeño
 * Copyright 2011 SYSLAB.COM GmbH
 */
define([
    'require'
], function(require) {
    var floatingPanelContextual = {
        options: {
            events: {
                def: ",mouseleave"
            },
            delay: 500
        },

        execute: function( $elem, url, sources, params, event ) {
            var api = $elem.data("tooltip");
            if (!api) {
                // we haven't initialized the tooltip for this element
                // dot it now
                var opts = $.extend({}, floatingPanelContextual.options, params);

                if ( sources.length > 0 ) {
                    opts['tip'] = "#" + sources[0];
                }
                opts['onHide'] = floatingPanelContextual.handleOnHide;
                $elem.tooltip(opts).dynamic();

                api = $elem.data("tooltip");
            }

            if (!api.isShown(false)) {
                api.show();
            }
            var $parents = $elem.parents("li");

            if ($parents.length > 0) {
                $($parents[0]).addClass('tipped');
            }
        },

        handleOnHide: function() {
            var $elem = this.getTrigger();

            var $parents = $elem.parents("li");

            if ($parents.length > 0) {
                $($parents[0]).removeClass('tipped');
            }
        }
    };
    return floatingPanelContextual;
});
