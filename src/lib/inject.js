// XXX: not sure whether this abstraction makes sense or whether it
// should be moved into the inject2 pattern
define(function(require) {
    var _injectmethod = function(name, method) {
        var injectwrapper = function($sources, $targets, opts) {
            // no $targets -> called as a jquery method
            // XXX: is it good to have that here?
            if ($targets === undefined) $targets = this;
            $targets = method($sources, $targets);

            opts = opts || {};
            opts.method = name;
            opts.$sources = $sources;
            $targets.trigger('inject', opts);
            return $targets;
        };
        return injectwrapper;
    };

    var methods = {};
    // temporary mark sources for injection
    var MARKER = "tmp-inject-marker";

    methods.content =  _injectmethod("content", function($sources, $targets) {
        $targets.each(function() {
            $(this).html($sources.html());
        });
        return $targets;
    });

    methods.replace = _injectmethod("replace", function($sources, $targets) {
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

    methods.replacetagwithcontent = _injectmethod("replacetagwithcontent", function($sources, $targets) {
        $targets.each(function() {
            var $tmp = $sources.clone().children().addClass(MARKER);
            $(this).replaceWith($tmp);
        });
        return $("." + MARKER).removeClass(MARKER);
    });

    // XXX: name under discussion
    methods.pre = _injectmethod("pre", function($sources, $targets) {
        $targets.each(function() {
            $(this).before($sources.clone().addClass(MARKER));
        });
        return $("." + MARKER).removeClass(MARKER);
    });

    // XXX: name under discussion
    methods.post = _injectmethod("post", function($sources, $targets) {
        $targets.each(function() {
            $(this).after($sources.clone().addClass(MARKER));
        });
        return $("." + MARKER).removeClass(MARKER);
    });

    // XXX: name under discussion
    methods.append = _injectmethod("append", function($sources, $targets) {
        $targets.each(function() {
            $(this).append($sources.clone().addClass(MARKER));
        });
        return $("." + MARKER).removeClass(MARKER);
    });

    methods.prepend = _injectmethod("prepend", function($sources, $targets) {
        $targets.each(function() {
            $(this).append($sources.clone().addClass(MARKER));
        });
        return $("." + MARKER).removeClass(MARKER);
    });

    return methods;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
