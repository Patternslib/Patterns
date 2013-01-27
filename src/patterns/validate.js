define([
    "jquery",
    "../registry",
    "../core/logger",
    "patterns-jquery-validation"
], function($, patterns, logger) {
    var log = logger.getLogger("pat.validate");

    var pattern_spec = {
        name: "validate",
        trigger: "form.validate",

        init: function($el) {
            $el.find("[data-validator]").toArray().reduce(function(acc, el) {
                /*
                Support for custom validator:
                -----------------------------
                The data-* attributes are:
                - data-validator (classname, method)
                - data-validator-message  (message)

                Parameters:
                    *classname* is a string which must be set as a class on the element to validate.
                    *method* is a string denoting the name of the validating function.
                        If it's a nested/namespaced method, you can provide dot notation.
                    *message* is the error message which will be returned if validation fails.
                */
                var i, path_to_func, $el = $(el),
                    varray = $el.data("validator").split(" ", 2),
                    message = $el.data("validator-message");

                // The function might be namespaced (e.g namespace.subnamespace.myfunc)
                // We therefore need to split on "." and traverse the path.
                path_to_func = varray[1].split(".");
                var func = window[path_to_func[0]];
                for (i=1; i<path_to_func.length; i++) {
                    try {
                        func = func[path_to_func[i]];
                    } catch(e) {
                        log.error("Could not find the validator function: " + varray[1]);
                    }
                }
                $.validator.addMethod(varray[0], func, message);
            }, {});

            var rules = $el.find("[data-required-if]").toArray().reduce(function(acc, el) {
                var $el = $(el),
                    id = $el.attr("id");
                if (!id) {
                    log.error("Element needs id, skipping:", $el);
                    return acc;
                }
                acc[id] = {required: $el.data("required-if")};
                return acc;
            }, {});
            log.debug("rules:", rules);

            // ATTENTION: adding the debug option to validate, disables
            // form submission
            $el.validate({rules: rules});
            return $el;
        }
    };

    patterns.register(pattern_spec);
    return pattern_spec;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
