define([
    'require',
    '../lib/dist/underscore',
    '../logging'
], function(require) {
    var log = require('../logging').getLogger('navigation');

    var match = function(curpath, path) {
        if (!path) {
            log.debug('path empty');
            return false;
        }

        // current path needs to end in the anchor's path
        if (path !== curpath.slice(- path.length)) {
            log.debug(curpath, 'does not end in', path);
            return false;
        }

        // XXX: we might need more exclusion tests
        return true;
    };

    var pathfromurl = function(url) {
        var path = url.split('#')[0].split('://');
        if (path.length > 2) {
            log.error('weird url', url);
            return '';
        }
        if (path.length === 1) return path[0];
        return path[1].split('/').slice(1).join('/');
    };

    var init = function($el, opts) {
        var curpath = window.location.pathname;
        log.debug('current path:', curpath);

        // check whether to load
        if ($el.hasClass('navigation-load-current')) {
            $el.find('a.current').click();
        }

        // XXX: this code adjusted the current tag of newly page, this
        // should not happen client side but is the responsibility of
        // the server-side template. Client-side only for ajax
        // injections which is handled in the inject pattern
        //
        // $el.find('li a').each(function() {
        //     var $a = $(this),
        //         $li = $a.parents('li:first'),
        //         url = $a.attr('href'),
        //         path = pathfromurl(url);
        //     log.debug('checking url:', url, 'extracted path:', path);
        //     if (!match(curpath, path)) {
        //         $li.removeClass('current');
        //         return;
        //     }
        //     log.debug('found match', $li);
        //     $li.addClass('current');
        // });


        // TODO: bind handler to url changes ?

        return $el;
    };

    var pattern = {
        markup_trigger: '.navigation',
        init: init
    };
    return pattern;
});