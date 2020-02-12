define([
    import $ from "jquery";,
    import logger from "../../core/logger";
    import registry from "../../core/registry";
    import Base from "../../core/base";
    import utils from "../../core/utils";
    "google-code-prettify"
], function($, logger, registry, Base, utils, prettify) {
    var log = logger.getLogger("pat.markdown");
    var is_markdown_resource = /\.md$/;

    return Base.extend({
        name: "syntax-highlight",
        trigger: ".pat-syntax-highlight",

        init: function() {
            this.$el.addClass("prettyprint");
            utils.debounce(prettify.prettyPrint, 50)();
        }
    });
});
