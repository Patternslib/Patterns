// XXX: not sure whether this abstraction makes sense or whether it
// should be moved into the inject2 pattern
define(function(require) {
    var log = require('../logging').getLogger('injectlib');

    var _injectmethod = function(name, method) {
        var injectwrapper = function($sources, $targets, opts) {
            // no $targets -> called as a jquery method
            // XXX: is it good to have that here?
            if ($targets === undefined) $targets = this;
            $targets = method($sources, $targets);

	    opts = opts || {};
	    opts.method = name;
	    opts["$sources"] = $sources;
	    $targets.trigger('inject', opts);
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

    // temporary mark sources for injection
    var MARKER = "tmp-inject-marker";

    var replace = _injectmethod("replace", function($sources, $targets) {
        // XXX: consider removal of special case
        // this needs tests!
        if ($targets.length === 1) {
            $targets.replaceWith($sources);
            return $sources;
        }
        $targets.each(function() {
            $(this).replaceWith($sources.clone().addClass(MARKER));
        });
        return $("." + MARKER).removeClass(MARKER);
    });

    var replacetagwithcontent = _injectmethod("replacetagwithcontent", function($sources, $targets) {
        $targets.each(function() {
            var $tmp = $sources.clone().children().addClass(MARKER);
            $(this).replaceWith($tmp);
        });
        return $("." + MARKER).removeClass(MARKER);
    });

    // XXX: name under discussion
    var pre = _injectmethod("pre", function($sources, $targets) {
        $targets.each(function() {
            $(this).before($sources.clone().addClass(MARKER));
        });
        return $("." + MARKER).removeClass(MARKER);
    });

    // XXX: name under discussion
    var post = _injectmethod("post", function($sources, $targets) {
        $targets.each(function() {
            $(this).after($sources.clone().addClass(MARKER));
        });
        return $("." + MARKER).removeClass(MARKER);
    });

    // XXX: name under discussion
    var append = _injectmethod("append", function($sources, $targets) {
        $targets.each(function() {
            $(this).append($sources.clone().addClass(MARKER));
        });
        return $("." + MARKER).removeClass(MARKER);
    });

    var prepend = _injectmethod("prepend", function($sources, $targets) {
        $targets.each(function() {
            $(this).append($sources.clone().addClass(MARKER));
        });
        return $("." + MARKER).removeClass(MARKER);
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