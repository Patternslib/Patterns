import utils from "./utils";

const parser = {
    getOptions(el, pattern_name, options) {
        /* This is the Mockup parser. An alternative parser for Patternslib
         * patterns.
         *
         * NOTE: Use of the Mockup parser is discouraged and is added here for
         * legacy support for the Plone Mockup project.
         *
         * It parses a DOM element for pattern configuration options.
         */

        el = utils.jqToNode(el);
        options = options || {};
        if (!el) {
            return options;
        }

        // get options from parent element first, stop if element tag name is 'body'
        if (el.nodeName !== "BODY") {
            options = this.getOptions(el.parentElement, pattern_name, options);
        }
        // collect all options from element
        let el_options = {};
        // Use `getAttribute` over `dataset` because dataset uses camelCasing of data attributes.
        el_options = el.getAttribute(`data-pat-${pattern_name}`);
        if (el_options) {
            // parse options if string
            if (typeof el_options === "string") {
                const tmp_options = {};
                el_options.split(";").forEach((item) => {
                    item = item.split(":");
                    item.reverse();
                    let key = item.pop();
                    key = key.replace(/^\s+|\s+$/g, ""); // trim
                    item.reverse();
                    let value = item.join(":");
                    value = value.replace(/^\s+|\s+$/g, ""); // trim
                    tmp_options[key] = value;
                });
                el_options = tmp_options;
            }
        }
        return {
            ...options,
            ...el_options,
        };
    },
};

export default parser;
