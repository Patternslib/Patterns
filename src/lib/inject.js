// XXX: not sure whether this abstraction makes sense or whether it
// should be moved into the inject2 pattern
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

    var replacetagwithcontent = _injectmethod("replacetagwithcontent", function($sources, $targets) {
        $targets.each(function() {
            var $tmp = $sources.clone().children()
                    .addClass(replacetagwithcontent.marker);
            $(this).replaceWith($tmp);
        });
        return $("." + replacetagwithcontent.marker)
            .removeClass(replacetagwithcontent.marker);
    });
    replacetagwithcontent.marker = 'tmp-injection-marker';

    // XXX: name under discussion
    var pre = _injectmethod("pre", function($sources, $targets) {
        $targets.each(function() {
            $(this).before($sources.clone());
        });
        return $sources;
    });

    // XXX: name under discussion
    var post = _injectmethod("post", function($sources, $targets) {
        $targets.each(function() {
            $(this).after($sources.clone());
        });
        return $sources;
    });

    // XXX: name under discussion
    var append = _injectmethod("append", function($sources, $targets) {
        $targets.each(function() {
            $(this).append($sources.clone());
        });
        return $sources;
    });

    var prepend = _injectmethod("prepend", function($sources, $targets) {
        $targets.each(function() {
            $(this).append($sources.clone());
        });
        return $sources;
    });

    var injectlib = {
        content: content,
        pre: pre,
        post: post,
        append: append,
        prepend: prepend,
        replacetagwithcontent: replacetagwithcontent,
        replace: replace
    };

    return injectlib;
});