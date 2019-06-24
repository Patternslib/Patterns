/**
 * @license
 * Patterns @VERSION@ tooltip - tooltips
 *
 * Copyright 2008-2012 Simplon B.V.
 * Copyright 2011 Humberto Sermeño
 * Copyright 2011 SYSLAB.COM GmbH
 */
define([
    "jquery",
    "pat-logger",
    "pat-registry",
    "pat-utils",
    "pat-parser",
    "pat-inject",
    "pat-remove",
    "tippy"
], function($, logger, registry, utils, Parser, inject, remove, tippy) {
    var log = logger.getLogger("tooltip"),
        parser = new Parser("tooltip");

    var all_positions = ["tl", "tm", "tr",
                         "rt", "rm", "rb",
                         "br", "bm", "bl",
                         "lb", "lm", "lt"];
    parser.addArgument("position-list", [], all_positions, true);
    parser.addArgument("position-policy", "auto", ["auto", "force"]);
    parser.addArgument("height", "auto", ["auto", "max", "small"]);
    parser.addArgument("width", 350);
    parser.addArgument("trigger", "click", ["click", "hover"]);
    parser.addArgument("closing", "auto", ["auto", "sticky", "close-button"]);
    parser.addArgument("source", "title", ["auto", "ajax", "content", "content-html", "title"]);
    parser.addArgument("ajax-data-type", "html", ["html", "markdown"]);
    parser.addArgument("delay");
    parser.addArgument("mark-inactive", true);
    parser.addArgument("class");
    parser.addArgument("target", "body");

    var tooltip = {
        name: "tooltip",
        trigger: ".pat-tooltip",
        jquery_plugin: true,

        count: 0,

        init: function($el, opts) {
            return $el.each(function() {
                var $trigger = $(this),
                    href,
                    options = parser.parse($trigger, opts),
                    config = {
                        'theme': 'light-border',
                        'animation': 'perspective',
                        'arrow': true,
                        'ignoreAttributes': true,
                        'interactive': true,
                        'trigger': 'click',
                        'allowHTML': true
                    };

                // adapting options to fit tippy. 
                // See https://atomiks.github.io/tippyjs/all-options/ for details
                if (options.positionList) {
                    switch (options.positionList[0]) {
                        case "t":
                            config.placement = 'top';
                            break;
                        case "l":
                            config.placement = 'left';
                            break;
                        case "r":
                            config.placement = 'right';
                            break;
                        case "b":
                            config.placement = 'bottom';
                            break;
                    }
                }
                if (options.height == 'max') {
                    config.size = 'large';
                } else if (options.height == 'small') {
                    config.size = 'small';
                }
                if (options.width) {
                    config.maxWidth = options.width;
                }
                if (options.trigger == 'hover') {
                    config.trigger = 'mouseenter focus';
                }  else {
                    $trigger.on("click.tooltip", $trigger, tooltip._onClick);
                }
                if (options.closing == 'sticky') {
                    config.hideOnClick = 'toggle';
                } else if (options.closing == 'close-button') {
                    // ??
                }
                if (options.source==="auto") {
                    href = $trigger.attr("href");
                    if (typeof(href) !== "string") {
                        log.error("href must be specififed if 'source' is set to 'auto'");
                        return;
                    }
                    if (href.indexOf("#") === 0) {
                        options.source = "content";
                    } else {
                        options.source = "ajax";
                        config.flipOnUpdate = true;
                    }
                } else if (options.source==="title") {
                    config.content=$trigger.attr("title");
                    $trigger.removeAttr("title");
                } else {
                    // content-html ?? allow content as html. We do that as default
                }
                if (options.delay) {
                    var d = utils.parseTime(options.delay);
                    config.delay = [d, d];
                }
                if (options.markInactive) {
                    $trigger.addClass("inactive");
                }  
                if (options.class) {
                    config.theme = options.class;
                }
                if (options.target != 'body') {
                    config.appendTo = options.target;
                }

                config.onShown = tooltip._onShown;
                config.onHide = tooltip._onHide;



                tippy($trigger[0], config);

                $trigger
                    .data("patterns.tooltip", options)
                    .on("destroy", $trigger, tooltip.onDestroy);
            });
        },
        onDestroy: function onDestroy(event) {
          var $trigger = event.data;
          $trigger.destroy();
        },
        _onShown: function (instance) {
            var $trigger = $(instance.reference),
                options = $trigger.data("patterns.tooltip");

            switch (options.source) {
                case 'ajax':
                    $content=$("<progress/>", {"id": "tooltip-load-" + instance.id});
                    instance.setContent($content[0]);

                    var source = $trigger.attr("href").split("#"),
                        target_id = "tooltip-load-" + instance.id;
                    $(instance)
                        .on("pat-ajax-success.pat-inject", 
                            tooltip._update.bind(this));
                    inject.execute([{
                        url: source[0],
                        source: "#" + source[1],
                        target: "#" + target_id + "::element",
                        dataType: options.ajaxDataType
                    }], $(instance));

                    break;
                case 'auto':
                case 'content':
                case 'content-html':

                    instance.setContent($trigger.html());
                    break;
                case 'title':
                    instance.setContent(options.content);
                    break;
                default:
                    // Do nothing
            }
        },
        _update: function(instance) {
            instance.currentTarget.popperInstance.update();
        },
        _onHide: function (instance) {
            var options = $(instance.reference).data("patterns.tooltip");
            console.log("Hidden");
            if (options.source == 'ajax') {
                instance.setContent('Loading...')
            }
//            instance.state.ajax.canFetch = true
        },
        _onClick: function(event) {
            // XXX: this handler is necessary in order to suppress the click
            // on the trigger from bubbling. (see show function)
            event.preventDefault();
            event.stopPropagation();
            event.data.trigger("pat-tooltip-click");
        },

    }


    registry.register(tooltip);
    return tooltip; 
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
