define([
    "jquery",
    "pat-logger",
    "pat-registry",
    "pat-base",
    "pat-utils",
    "google-code-prettify"
], function($, logger, registry, Base, utils, prettify) {
    var log = logger.getLogger("pat.markdown");
    var is_markdown_resource = /\.md$/;

    // TODO: Add support for linenums
    return Base.extend({
        name: "highlight",
        trigger: ".pat-highlight",

        init: function() {
            this.$el.addClass("prettyprint");
            utils.debounce(prettify.prettyPrint, 50)();
        },
    });
});
