(function (root, factory) {
    // We use AMD (Asynchronous Module Definition) or browser globals to create
    // this module.
    if (typeof define === 'function' && define.amd) {
        define([
            "jquery",
            "pat-base",
            "pat-registry",
            "pat-parser",
            "pat-inject",
            "pat-logger",
	        "tippy.js",
	        "tippy-theme.css",
        ], function() {
            return factory.apply(this, arguments);
        });
    } else {
        // If require.js is not available, you'll need to make sure that these
        // global variables are available.
        factory($, patterns.Base, patterns, patterns.Parser, patterns.inject, patterns.logger, tippy, tippytheme);
    }
}(this, function($, Base, registry, Parser, inject, logger, tippy, tippytheme) {
    'use strict';

    var log = logger.getLogger("pat-tooltip-ng");
    log.setLevel(10);
    log.debug("Initializing pat-tooltip-ng");

    /* For logging, you can call log.debug, log.info, log.warn, log.error and log.fatal.
     *
     * For more information on how to use the logger and how to view log messages, please read:
     * https://github.com/Patternslib/logging
     */
    var defaults = {
        'allowHTML': true,
        'animation': 'fade',
        'arrow': true,
        'flipOnUpdate': true,
        'ignoreAttributes': true,
        'interactive': false,
        'theme': 'light-border',
        'trigger': 'click'
    };

    var parser = new Parser('tooltip-ng');
    /* If you'd like your pattern to be configurable via the
     * data-pat-tooltip-ng attribute, then you need to
     * specify the available arguments here, by calling parser.addArgument.
     *
     * The addArgument method takes the following parameters:
     *  - name: The required name of the pattern property which you want to make
     *      configurable.
     *  - default_value: An optional default string value of the property if the user
     *      doesn't provide one.
     *  - choices: An optional set (Array) of values that the property might take.
     *      If specified, values outside of this set will not be accepted.
     *  - multiple: An optional boolean value which specifies wether the
     *      property can be multivalued or not.
     *
     *  For example:
     *      parser.addArgument('color', 'blue', ['red', 'green', 'blue'], false);
     */
    parser.addArgument("trigger", "click", ["click", "hover"]);
    parser.addArgument("source", "title", ["auto", "ajax", "content", "content-html", "title"]);
    parser.addArgument("target", "body");

    tippy.default.setDefaults(defaults);
    var tippy = tippy.default;

    //return Base.extend({
    var tooltip = {
        /* The name is used to store the pattern in a registry and needs to be
         * unique.
         */
        name: 'tooltip-ng',
        /* The trigger specifies the selector (CSS or jQuery) which Patternslib
         * will scan for in order to identifiy and initialize this pattern.
         */
        trigger: ".pat-tooltip-ng",

        init: function initUndefined ($el, opts) {
	        //var config = defaults;
            var $trigger = $el;
            this.options = parser.parse($trigger, opts);
	        if (this.options.trigger == "hover") {
		        this.options.trigger = "mouseenter focus";
	        }
	        if (this.options.hasOwnProperty('source')) {
	            if (this.options.source==="title") {
	                var content = $trigger.attr("title");
	                this.options.content = content;
	            }
    	    	if (this.options.source==="content") {
    	    	    var href = $trigger.attr("href");
    	    	    var content = $trigger.text();
    	    	    if (typeof(href) === "string" && href.indexOf("#") !== -1 && href.length > 1) {
    	    		    content = $("#"+href.split("#")[1]).children().clone();
    	    	    } else {
    	    		    content = $trigger.children().clone();
            			if (!content.length) {
            			    content = $("<p/>").text($trigger.text());
            			}
    	    	    }
    	            this.options.content = content[0];
    	    	}
                if (this.options.source==='ajax') {
                    this.options.content = $('<progress/>')[0];
                    this.options.onMount = tooltip._onAjax($trigger);
                }
    	    	delete this.options.source;
	        }
	        if ($trigger.attr("title")) {
		        $trigger.removeAttr("title");
	        }
	        if (this.options.hasOwnProperty('target')) {
                if (this.options.target === 'parent') {
                    this.options.appendTo = 'parent';
                } else if (this.options.target !== 'body') {
                    this.options.appendTo = $(this.options.target)[0];
                }
                delete this.options.target;
            }
            //log.debug($trigger);
            /* this.options will now contain the configured pattern properties
             * you've registered with the parser.addArgument method.
             *
             * If the user provided any values via the data-pat-tooltip-ng
             * attribute, those values will already be set.
             */
	        this.options.onShown = tooltip._onShown;
	        this.options.onHidden = tooltip._onHidden;
            this.options.onTrigger = tooltip._onTrigger;
            //log.debug(this.options);

	        var foo = $(tippy($trigger[0], this.options)).data("patterns.tooltip-ng", this.options);
	        //log.debug($trigger);

	        $trigger
                .on("destroy", tooltip._onDestroy);
            log.debug(foo.data());
        },

        _onDestroy: function onDestroyUndefined (event) {
            log.debug('ONDESTROY');
            var $trigger = event.target;
            $trigger._tippy.destroy();
        },

        _onShown: function onShownUndefined (instance) {
            log.debug('ONSHOWN');
        },

        _onHidden: function onHiddenUndefined (instance) {
            log.debug('ONHIDDEN');
        },

        _onAjax: function onAjaxUndefined ($trigger) {
            log.debug('OnAJAX');
            var source = $trigger.attr("href").split("#");
            return function (instance) {
                log.debug('in ajax content function');
                log.debug(instance);
                  setTimeout(()=>{
//                inject.execute([{
//                    url: source[0],
//                    source: "#" + source[1],
//                    target: "#" + instance.popper.id + " .tippy-content",
//                    dataType: "html"
//                }], $trigger);
                fetch(source[0]).then(response => {
                    return response.text().then(text => {
                        var $tmp = $('<div></div>').append($.parseHTML(text));
                        instance.setContent($tmp.find('#'+source[1])[0]);
                    })
                })}, 2000);
            };
        },

        _onTrigger: function onTriggerUndefined (instance, event) {
            log.debug('ONTRIGGER');
            log.debug(event);
            if (event.type === "click") {
                event.stopPropagation();
                event.preventDefault();
            }
        }
    };
    registry.register(tooltip);
    return tooltip;
}));
