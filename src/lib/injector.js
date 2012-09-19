define(function(require) {
    var log = require('../logging').getLogger('inject');

    // temporary mark sources for injection
    var MARKER = "tmp-inject-marker";

    // Collection of injection methods. Each function defined here implements
    // a way to inject content into the DOM. An injection method takes two
    // parameters specifying the source content to inject and the target
    // location. An inection function must return a jQuery wrapper for the
    // newly inserted content so it can be post-processed.
    var methods = {
        content: function(source, target) {
            var $target = $(target);
            $target.html($(source).html());
            return $target;
        },

        replace: function(source, target) {
            var $source = $(source),
                $target = $(target);
            $target.each(function() {
                $(this).replaceWith($source.clone()).addClass(MARKER);
            });
            return $("."+MARKER).removeClass(MARKER);
        },

        replacetagwithcontent: function(source, target) {
            var $source = $(source), $target = $(target);

            $target.each(function() {
                $(this).replaceWith($source.clone().children()).addClass(MARKER);
            });
            return $("." + MARKER).removeClass(MARKER);
        },

        pre: function(source, target) {
            var $source = $(source), $target = $(target);

            $target.each(function() {
                $(this).before($source.clone().addClass(MARKER));
            });
            return $("." + MARKER).removeClass(MARKER);
        },

        post: function(source, target) {
            var $source = $(source), $target = $(target);

            $target.each(function() {
                $(this).after($source.clone().addClass(MARKER));
            });
            return $("." + MARKER).removeClass(MARKER);
        },

        append: function(source, target) {
            var $source = $(source), $target = $(target);

            $target.each(function() {
                $(this).append($source.clone().addClass(MARKER));
            });
            return $("." + MARKER).removeClass(MARKER);
        },

        prepend: function(source, target) {
            var $source = $(source), $target = $(target);

            $target.each(function() {
                $(this).append($source.clone().addClass(MARKER));
            });
            return $("." + MARKER).removeClass(MARKER);
        }
    };


    var inject_content = function(data, commands) {
        var i, command, $content, source, $result;
        var $factory = $("<div/>").append(
                data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                    .replace(/<head\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/head>/gi, "")
                    .replace(/<body(.*)>/gi,'<div id="__original_body">')
                    .replace(/<\/body(.*)>/gi,'</div>')
                );
        for (i=0; i<commands.length; i++) {
            command = commands[i];
            source = command.source;
            if (source==="body")
                source = "#__original_body";
            $content = methods[command.method](source, command.target);
            mapal.initContent($content);
            $result = $result.add($content);
        }
        return $result;
    };

    var onError = function(event, jqhr, ajaxopts, error) {
        // Check for cancelled request
        if (jqhr.status===0)
            return;

        var msg = [jqxhr.status, jqxhr.statusText, error, ajaxopts.url].join(' ');
        alert("An error occured while request extra data:\n" + msg);
    };

    var onSuccess = function(event, jqxhr, ajaxopts, data) {
        var redirect = jqxhr.getResponseHeader('X-Patterns-Redirect-Url'),
            reload = jqxhr.getResponseHeader('X-Patterns-Reload');

        if (reload) {
            log.debug('received reload request');
            $('form.inject.reload').submit();
            $('a.inject.reload:not(.navigation a)').click();
            $('.navigation a.inject.reload.current').click();
        } else if (redirect) {
            log.debug('received redirect request', redirect);
            window.location.href = redirect;
        }
        inject_content(ajaxopts.injection_commands, data);
    };

    /** Insert content into the DOM.
     *
     * data is a string (commonly the responseText from an AJAX call)
     * containing markup from which content can be inserted.
     *
     * commands is an object or list of objects which specify the specific
     * insertiond to be done. Each object supports the following keys:
     *
     * * method: the insertion method to use. Defaults to *append*.
     * * source: selector indicating the content to be injected. Defaults
     *   to "body" (ie include the entire body of the loaded document).
     * * target: selector indicating the target(s) where content will be
     *   inserted.
     */
    var inject = function(url, commands) {
        if (typeof commands==="object") 
            commands = [commands];
        for (var i=0; i<commands.length; i++) {
            if (typeof commands[i]!==object)
                throw "Command number " + i + " is invalid.";
            commands[i].source = commands[i].source || "body";
            commands[i].target = commands[i].source || "body";
            commands[i].method = commands[i].method || "append";
            if (methods[commands[i].method]===undefined) 
                throw "Command number " + i + " has an invalid method.";
        }
        $.ajax({url: url,
                injection_commands: commands,
                error: onError,
                success: onSuccess});
    };

    return methods;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
