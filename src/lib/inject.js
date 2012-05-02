define(function(require) {
    var _injectmethod = function(name, method) {
        var injectwrapper = function($sources, $targets, suppress) {
            // no $targets -> called as a jquery method
            // XXX: is it good to have that here?
            if ($targets === undefined) $targets = this;
            $targets = method($sources, $targets);
            if (!suppress) {
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

    return {
        content: content,
        pre: pre,
        post: post,
        append: append,
        prepend: prepend,
        replace: replace
    };
});