import $ from "jquery";

var parser = {
    getOptions($el, patternName, options) {
        /* This is the Mockup parser. An alternative parser for Patternslib
         * patterns.
         *
         * NOTE: Use of the Mockup parser is discouraged and is added here for
         * legacy support for the Plone Mockup project.
         *
         * It parses a DOM element for pattern configuration options.
         */
        options = options || {};
        // get options from parent element first, stop if element tag name is 'body'
        if ($el.length !== 0 && !$.nodeName($el[0], "body")) {
            options = this.getOptions($el.parent(), patternName, options);
        }
        // collect all options from element
        let elOptions = {};
        if ($el.length !== 0) {
            elOptions = $el.data("pat-" + patternName);
            if (elOptions) {
                // parse options if string
                if (typeof elOptions === "string") {
                    const tmpOptions = {};
                    $.each(elOptions.split(";"), function (i, item) {
                        item = item.split(":");
                        item.reverse();
                        let key = item.pop();
                        key = key.replace(/^\s+|\s+$/g, ""); // trim
                        item.reverse();
                        let value = item.join(":");
                        value = value.replace(/^\s+|\s+$/g, ""); // trim
                        tmpOptions[key] = value;
                    });
                    elOptions = tmpOptions;
                }
            }
        }
        return $.extend(true, {}, options, elOptions);
    },
};

export default parser;
