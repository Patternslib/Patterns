define([
    "jquery",
    "../registry",
    "../core/logger",
    "../core/parser",
    "../utils"
], function($, registry, logging, Parser, utils) {
    var log = logging.getLogger("autosubmit"),
        parser = new Parser("autosubmit");

    // XXX: would be great if the parser would handle validation and
    // interpretation of boolean values:
    // - integer >=0
    // - false -> delay=0
    // - true -> delay=default
    // - string "defocus"
    parser.add_argument("delay", "400ms");

    var _ = {
        name: "autosubmit",
        trigger: ".pat-autosubmit,.pat-autosubmit :input,.pat-autosubmit textarea",
        parser: {
            parse: function($el, opts) {
                var cfg = parser.parse($el, opts);
                cfg.delay = parseInt(cfg.delay.replace(/[^\d]*/g, ""), 10);
                return cfg;
            }
        },
        init: function($el, opts) {
            if ($el.length > 1)
                return $el.each(function() { _.init($(this), opts); });

            var cfg = _.parser.parse($el, opts);

            if ($el.is(":input")) {
                // sets up triggering children
                if (cfg.delay === "defocus") {
                    $el.on("focusout.pat-autosubmit", function() {
                        $el.trigger("autosubmit");
                    });
                } else if (cfg.delay !== "0" && $el.is("input:text, input[type=search], textarea")) {
                    $el.on("keyup.pat-autosubmit", utils.debounce(function() {
                        $el.trigger("autosubmit");
                    }, cfg.delay));
                } else {
                    $el.on("change.pat-autosubmit", function() {
                        $el.trigger("autosubmit");
                    });
                }
            }

            // Special handling for the clear search button
            if ($el.is("input[type=search]")) {
                $el.on("click.pat-autosubmit", function(){ $el.keyup(); });
            }

            if ($el.hasClass("pat-autosubmit")) {
                // submit if a (specific) form element changed
                $el.on("autosubmit.pat-autosubmit", _.autosubmit);
            }

            return $el;
        },

        destroy: function($el) {
            $el.off(".pat-autosubmit");
            if (!$el.is(":input")) {
                $el.find(":input").off(".pat-autosubmit");
            }
        },

        autosubmit: function(ev) {
            ev.stopPropagation();

            var $el = $(this),
                $form = $el.is("form") ? $el : $el.parents("form").first();

            if ($el.is("input[type=search]")) {
                // clicking X on type=search deletes data attrs,
                // therefore we store the old value on the form.
                var name = $el.attr("name"),
                    key = "pat-autosubmit-" + name + "-oldvalue",
                    oldvalue = $form.data(key) || "",
                    curvalue = $el[0].value || "";

                if (!name)
                    log.warn("type=search without name, will be a problem" +
                             " if there are multiple", $el);

                if (oldvalue === curvalue)
                    return;

                $form.data(key, curvalue);
            }

            log.debug("triggered by " + ev.type);

            $form.submit();
        }
    };

    registry.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
