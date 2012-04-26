/**
 * @license
 * Patterns @VERSION@ fancybox - automatic fancybox setup
 *
 * Copyright 2008-2012 Simplon B.V.
 * Copyright 2011 Humberto Sermeño
 * Copyright 2011 SYSLAB.COM GmbH
 */
define([
    'require',
    '../lib/dist/jquery.fancybox-1.3.4'
], function(require) {
    var fancybox = {
        execute: function(elem, url, sources, params, event) {
            //var $this = $(event.target);

            //var modifier = /![a-zA-Z]+/.exec(params);
            //var className = /[\.][a-zA-Z\-0-9_]+/.exec(params);
            var options = {};

            //if (modifier && modifier.length > 0) {
            //options.type = modifier[0].slice(1);
            //} else {
            if (params['type'])
                options.type = params['type'];
            //}

            options.href = url + (sources.length > 0 ? '#' + sources[0] : '');

            $.fancybox( options );
            $.fancybox.resize();
        }
    };
    return fancybox;
});
