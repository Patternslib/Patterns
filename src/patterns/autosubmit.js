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
    parser.add_argument("delay", 400);

    var _ = {
        name: "autosubmit",
        trigger: ".pat-autosubmit",
        init: function($el, opts) {
            if ($el.length > 1)
                return $el.each(function() { _.init($(this), opts); });

            // submit if a (specific) form element changed
            $el.on("change.pat-autosubmit", _.considerSubmit);

            var cfg = parser.parse($el, opts);

            // XXX: defocus currently does not work as the parser
            // returns the default value instead.
            if (cfg.delay !== "defocus") {
                var submit = _.considerSubmit;
                if (cfg.delay === true)
                    cfg.delay = 400;
                if (cfg.delay)
                    submit = utils.debounce(_.considerSubmit, cfg.delay);
                ($el.is("input") ? $el : $el.find("input"))
                    .on("keyup.pat-autosubmit", submit);
            }

            // XXX: test whether on webkit and enable only if
            // supported
            //
            // XXX: this should be handled by writing code that
            // triggers a change event in case the "Clear field
            // button" inside the search is pressed
            ($el.is("input[type=search]") ? $el : $el.find("input[type=search]"))
                .on("click.pat-autosubmit", _.considerSubmit);

            return $el;
        },
        parser: parser,
        destroy: function($el) {
            $el.off(".pat-autosubmit");
            $el.find("input").off(".pat-autosubmit");
        },
        considerSubmit: function(ev) {
            // XXX: check that the very same event did not submit the
            // form already (see below)

            var $el = $(this),
                $form = $el.is("form") ? $el : $el.parents("form").first();

            // ignore auto-suggest fields, the change event will be
            // triggered on the hidden input
            if ($el.is(".pat-autosuggest")) {
                log.debug("ignored event from autosuggest field");
                return;
            }

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

            // XXX: mark event as used so we won't submit through a
            // parent element again.

            $form.submit();
        }
    };

    registry.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
