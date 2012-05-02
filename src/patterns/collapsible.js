define([
    'require',
    '../core/parser',
    '../logging'
], function(require) {
    var Parser = require('../core/parser'),
        parser = new Parser("injectcontent"),
        log = require('../logging').getLogger('collapsible');

    var init = function($el, opts) {
        // create collapsible structure
        var $ctrl = $el.children(':first'),
            $content = $el.children(':gt(0)'),
            $panel;
        if ($content.length > 0) {
            $panel = $content.wrapAll('<div class="panel-content" />')
                .parent();
        } else {
            $panel = $('<div class="panel-content" />').insertAfter($ctrl);
        }

        // set initial state
        if ((opts && opts.closed) || $el.hasClass("closed")) {
            $el.removeClass("closed");
            close($el, 0);
        } else {
            $el.addClass("open");
            $el.trigger('patterns-collapsible-open');
            loadcontent($el);
        }

        // bind to click events
        $ctrl.bind("click", function() { toggle($el, "fast"); });

        // allow for chaining
        return $el;
    };

    var loadcontent = function($el) {
        // check whether we have to fetch content
        var opts_str = $el.data('collapsible'),
            src, href, id, $panel;

        if (!opts_str) return;

        src = parser.parse(opts_str)["injectcontent"] || "";
        href = src.split('#')[0];
        id = src.split('#')[1];
        log.debug(href, id);
        if (!id) {
            log.error('injectcontent url needs id to fetch content for panel', src);
        } else {
            $panel = $el.find('.panel-content');
            $.ajax({
                context: $el,
                url: href,
                error: function(jqxhr, status, error) {
                    log.error('Error loading panel content', jqxhr, status, error);
                    $panel.html(
                        status + ': Failed to load panel content from: ' + href
                    );
                },
                success: function(data, status, jqxhr) {
                    // just copied from old inject code
                    data = data
                        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                        .replace(/<head\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/head>/gi, "")
                        .replace(/<body(.*)>/gi, '<div id="__original_body">')
                        .replace(/<\/body(.*)>/gi,'</div>');
                    var $src = $('<div/>').html(data).find('#' + id);
                    $panel.html($src.html());

                    // trigger inject event
                    $panel.trigger('inject', {
                        method: 'content',
                        $sources: $src,
                        $trigger_el: $el
                    });
                }
            });
        }
    };

    var open = function($el, duration) {
        if ($el.hasClass("open")) return null;

        toggle($el, duration);

        // allow for chaining
        return $el;
    };

    var close = function($el, duration) {
        if ($el.hasClass("closed")) return null;
        toggle($el, duration);

        // allow for chaining
        return $el;
    };

    var transit = function($el, $panel, from_cls, to_cls, duration) {
        $el.removeClass(from_cls);
        if (duration) $el.addClass("in-progress");
        $panel.slideToggle(duration, function() {
            if (duration) $el.removeClass("in-progress");
            $el.addClass(to_cls);
        });
    };

    var toggle = function($el, duration) {
        var $panel = $el.find('.panel-content');
        if ($el.hasClass("closed")) {
            loadcontent($el);
            $el.trigger('patterns-collapsible-open');
            transit($el, $panel, "closed", "open", duration);
        } else {
            transit($el, $panel, "open", "closed", duration);
        }

        // allow for chaining
        return $el;
    };

    var pattern = {
        markup_trigger: ".collapsible",
        initialised_class: "collapsible",
        init: init,
        loadcontent: loadcontent,
        open: open,
        close: close,
        toggle: toggle
    };

    return pattern;
});
