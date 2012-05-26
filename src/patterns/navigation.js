define([
    'require',
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

    var updatenavpath = function($el) {
        $el.find('.navigation-in-path').removeClass('navigation-in-path');
        $el.find('li:has(.current)').addClass('navigation-in-path');
    };

    var init = function($el, opts) {
        var curpath = window.location.pathname;
        log.debug('current path:', curpath);

        // check whether to load
        if ($el.hasClass('navigation-load-current')) {
            $el.find('a.current, .current a').click();
            // check for current elements injected here
            $el.on('patterns-inject-scanned', function(ev) {
                var $target = $(ev.target);
                $target.is('a.current') && $target.click();
                $target.is('.current') && $target.find('a').click();
                updatenavpath($el);
            });
        }

        // An element within this navigation triggered injection
        $el.on('patterns-inject-triggered', function(ev) {
            var $target = $(ev.target);

            // remove all set current classes
            $el.find('.current').removeClass('current');

            // set .current on target
            $target.addClass('current');

            // If target's parent is an LI, also set current there
            $target.parent('li').addClass('current');

            updatenavpath($el);
        });

        // set current class if it is not set
        if ($el.find('.current').length === 0) {
            $el.find('li a').each(function() {
                var $a = $(this),
                    $li = $a.parents('li:first'),
                    url = $a.attr('href'),
                    path = pathfromurl(url);
                log.debug('checking url:', url, 'extracted path:', path);
                if (match(curpath, path)) {
                    log.debug('found match', $li);
                    $li.addClass('current');
                }
            });
        }

        updatenavpath($el);

        return $el;
    };

    var pattern = {
        markup_trigger: 'nav, .navigation',
        init: init
    };
    return pattern;
});