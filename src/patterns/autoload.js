define([
    "jquery",
    "../registry"
], function($, patterns) {
    var autoload = {
        name: "autoload",
        trigger: ".autoLoading-visible",

        init: function($root) {
            // find all autoloads
            $root.each(function() {
                var $autoload = $(this),
                    $scrollable = $autoload.parents(":scrollable");

                // ignore executed autoloads
                if ($autoload.data('autoLoading')) return false;

                // function to trigger the autoload and mark as triggered
                var trigger = function() {
                    $autoload.data('autoLoading', true);
                    $autoload.trigger('click');
                    return true;
                };

                // if autoload has no scrollable parent -> trigger it, it is visible
                if ($scrollable.length === 0) return trigger();

                // if scrollable parent and visible -> trigger it
                // we only look at the closest scrollable parent, no nesting
                var checkVisibility = function() {
                    if ($autoload.data('autoLoading')) return false;
                    var reltop = $autoload.offset().top - $scrollable.offset().top - 1000,
                        doTrigger = reltop <= $scrollable.innerHeight();
                    if (doTrigger) return trigger();
                    return false;
                };
                if (checkVisibility()) return true;

                // wait to become visible - again only immediate scrollable parent
                $($scrollable[0]).on("scroll", checkVisibility);
                $(window).on('resize.autoload', checkVisibility);
                return false;
            });
            return $root;
        }
    };

    patterns.register(autoload);
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
