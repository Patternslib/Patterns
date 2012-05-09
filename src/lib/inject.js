define(function(require) {
    var log = require('../logging').getLogger('injectlib');

    var _injectmethod = function(name, method) {
        var injectwrapper = function($sources, $targets, suppress) {
            // no $targets -> called as a jquery method
            // XXX: is it good to have that here?
            if ($targets === undefined) $targets = this;
            $targets = method($sources, $targets);

            // XXX: not sure whether that is the right place
            if (!suppress) {
                // XXX: probably better patterns-injected or sth
                $targets.trigger('inject', {
                    method: name,
                    $sources: $sources
                });
            }
            return $targets;
        };
        return injectwrapper;
    };

    var content = _injectmethod("content", function($sources, $targets) {
        $targets.each(function() {
            $(this).html($sources.html());
        });
        return $targets;
    });

    var replace = _injectmethod("replace", function($sources, $targets) {
        if ($targets.length === 1) {
            $targets.replaceWith($sources);
            return $sources;
        }
        $targets.each(function() {
            $(this).replaceWith($sources.clone().addClass(replace.marker));
        });
        return $("." + replace.marker).removeClass(replace.marker);
    });
    replace.marker = 'tmp-injection-marker';

    // XXX: name under discussion
    var pre = _injectmethod("pre", function($sources, $targets) {
        $targets.each(function() {
            $(this).before($sources);
        });
        return $sources;
    });

    // XXX: name under discussion
    var post = _injectmethod("post", function($sources, $targets) {
        $targets.each(function() {
            $(this).after($sources);
        });
        return $sources;
    });

    // XXX: name under discussion
    var append = _injectmethod("append", function($sources, $targets) {
        $targets.each(function() {
            $(this).append($sources);
        });
        return $sources;
    });

    var prepend = _injectmethod("prepend", function($sources, $targets) {
        $targets.each(function() {
            $(this).append($sources);
        });
        return $sources;
    });

    var inject = function($data, opts) {
        // default: replace targets content with sources content
        var method_name = "content",
            $targets = opts.$targets,
            $sources = opts.$sources,
            method;

        // check for $sources
        if (!$sources) {
            $sources = $data.find(opts.source);

            if ($sources.length === 0) {
                log.error(
                    'Aborting, sources are empty for selector:', opts.source);
                return;
            }
        }

        // figure out $targets
        if (!$targets) {
            if (opts.replace) {
                opts.target = opts.replace;
                method_name = "replace";
            }
            if (opts.pre) {
                opts.target = opts.pre;
                method_name = "pre";
            }
            if (opts.post) {
                opts.target = opts.post;
                method_name = "post";
            }
            if (!opts.target) {
                opts.target = opts.source;
            }
            $targets = $(opts.target);
        }
        if ($targets.length === 0) {
            log.error('empty targets, aborting');
            return;
        }

        // injection method to use
        method = injectlib[method_name];

        // perform injection
        $targets = method($sources, $targets);
    };

    var injectlib = {
        content: content,
        pre: pre,
        post: post,
        append: append,
        prepend: prepend,
        replace: replace,
        inject: inject
    };

    return injectlib;
});