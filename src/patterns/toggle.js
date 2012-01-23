/**
 * @license
 * Patterns @VERSION@ toggle - toggle class on click
 *
 * Copyright 2012 Simplon B.V.
 * Copyright 2011 Humberto Sermeño
 * Copyright 2011 SYSLAB.COM GmbH
 */

(function($) {
    mapal = mapal || {passivePatterns: {}};
    $.extend(mapal.passivePatterns, {
    "toggle": {
        initContent: function(root) {
            $("[data-toggle]", root).on("click", mapal.passivePatterns.toggle.onClick);
        },

        onClick: function(event) {
            var toggle = mapal.passivePatterns.toggle,
                $trigger = $(event.target),
                options = toggle.getOptions($trigger),
                $targets = $(options.selector),
                $target;


            if ($targets.length===0) {
                return;
            }

            if (options.attr==="class") {
                $targets.toggleClass(options.value);
            } else {
                for (var i=0; i<$targets.length; i++) {
                    $target=$targets.eq(i);
                    if ($target.attr(options.attr)===options.attr) {
                        $target.removeAttr(options.attr);
                    } else {
                        $target.attr(options.attr, options.value);
                    }
                }
            }

            event.preventDefault();
        },

        getOptions: function($trigger) {
            var options = $trigger.data("mapal.toggle");
            if (options!==undefined) {
                return options;
            }

            options = mapal.patterns.parseOptions($trigger.data("toggle"));
            if (!options.selector || !options.attr || !options.value) {
                alert("Toggle pattern error: not all mandatory parameters provided.");
            }
            $trigger.data("mapal.toggle", options);
            return options;
        }
    }});
})(jQuery);
