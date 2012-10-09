/**
 * @license
 * Patterns @VERSION@ core - library infrastructure
 *
 * Copyright 2008-2012 Simplon B.V.
 * Copyright 2011 Humberto Sermeño
 * Copyright 2011 SYSLAB.COM GmbH
 */
define([
    'require',
    '../utils',
    // XXX: belong to the patterns once they are done
    '../lib/jquery.form/jquery.form',
    '../3rdparty/jquery.tools.min',
    '../jquery-ext'
], function(require, utils) {
var mapal = {
    injection: {
        options: {
            defaultModifier: "replace",
            modifiers: {

            },

            bodyInjectionId: "__original_body"
        },

        load: function($elem, url, targets, sources, callback, $filter) {
            var i;
            callback = callback || function() {};
            // to have more versatility when calling the function
            if (typeof sources == "string") sources = [ sources ];
            if (typeof targets == "string") targets = [ targets ];

            if ( sources.length > targets.length ) {
                mapal.injection.completeArray(sources, targets);
            } else {
                // empty source will use content of <body> instead.
                // (exclamation mark is to make sure an id with value "body" will still work as well)
                for (i = sources.length; i < targets.length; i++) {
                    sources.push(mapal.injection.options.bodyInjectionId);
                }
            }

            var target_ids = [];
            var modifiers = [], modifier;
            var modifier_re = /:[a-zA-Z]+/;

            for (i = 0; i < targets.length; i++) {
                if (typeof targets[i] == "string") {
                    // does the specifier contain a parent?
                    if (targets[i].indexOf(">") > 0) {
                        var both = targets[i].split(">");
                        target_ids.push( both[0] + ">#" + both[1].replace( modifier_re, "" ) );
                    } else {
                        target_ids.push( targets[i].replace(modifier_re, "") );
                    }

                    modifier =  (modifier_re.exec(targets[i]) || [":" + mapal.injection.options.defaultModifier]);
                } else {
                    target_ids.push( $(targets[i]).attr("id") );
                    modifier = ":" + mapal.injection.options.defaultModifier;
                }

                if (modifier.length > 0) {
                    modifier = modifier[0];

                    if (modifier.length > 0) modifier = modifier.slice(1);
                }

                if (sources[i] == mapal.injection.options.bodyInjectionId) {
                    modifiers.push("content");
                } else {
                    modifiers.push(modifier);
                }
            }

            function htmlLoaded(response, textStatus, responseText) {
                if ( typeof response == "string" ) {
                    responseText = response;
                    textStatus = 200;
                } else {
                    responseText = response.responseText;

                    if (response.status < 200 || response.status >= 400) {
                        return;
                    }
                }

                if ($elem.get(0).tagName == 'FORM') {
                    var $panel = $elem.parents('#panel');

                    if ($panel.length > 0) {
                        $panel.overlay().close();
                        $panel.remove();
                    }
                }

                // get the actual response in case a dataFilter is present in ajaxSettings
                //if ( response.done )
                //  response.done(function(r) { responseText = r; });

                // create a dummy div to hold the results
                // and get rid of all the scripts
                //
                // also remove complete head and rename body to a standard div. this is necessary
                // because a second body element is not allowed.
                var $factory = $("<div/>").append(
                    responseText.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                                .replace(/<head\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/head>/gi, "")
                                .replace(/<body(.*)>/gi,'<div id="__original_body">')
                                .replace(/<\/body(.*)>/gi,'</div>')
                );

//                var sourceIds = [];
                var len = targets.length;

                for (var idx = 0; idx < len; idx++) {
                    var modifier = modifiers[idx];
                    var $source;
                    var $target = $( "#" + target_ids[idx] );
                    var appendTo = false;

                    if ( $target.length === 0 ) {
                        appendTo = document.body;
                        if (target_ids[idx].indexOf(">") > 0) {
                            var both = target_ids[idx].split(">");

                            appendTo = $("#" + both[0]);
                            if ( appendTo.length ===  0) {
                                appendTo = $("<div/>").appendTo(document.body);
                                appendTo.attr("id", both[0]);
                            }
                        }
                    }

                    // empty source IDs will have been replaced with !body. Use the <body> tag as a source
                    if (sources[idx] == mapal.injection.options.bodyInjectionId) {
                        $source = $factory.find('#'+mapal.injection.options.bodyInjectionId);
                        modifier = "content";
                    } else {
                        $source = $factory.find( '#' + sources[idx] );
                    }

                    // apply filters to source
                    if ($filter && $filter.length > 0) {
                        var searchText = $('.searchText', $filter).val();
                        if (searchText) {
                            $source.find($filter.attr('data-filter') + ':not(:Contains(' + searchText + '))').remove();
                        }
                    }

                    if ( mapal.injection.modifiers[modifier] && $.isFunction(mapal.injection.modifiers[modifier].execute) ) {
                        $target = mapal.injection.modifiers[modifier].execute( $source, $target, appendTo );

                        if (appendTo) $target.appendTo(appendTo);

                        mapal.initContent($target);

                        var $nexthref = $elem.attr('data-href-next');
                        if ($nexthref) {
                            $elem.attr({'href': $nexthref,
                                        'data-injection': '',
                                        'data-href-next': ''});
                        }

                        if (typeof callback == 'function') {
                            callback($target);
                        } else {
                            (callback.onFinished||$.noop)($target);
                        }
                    } else {
                        alert('Injection[WARN]: Could not find modifier "' + modifier + '"' );
                    }
                }

                // check if this was a navigation call
                var $navs = $elem.parents("nav, .navigation"),
                    $items, $item;
                if (($navs.length > 0) && (!$elem.is('[data-tooltip]'))) {
                    $items = $navs.find('li');
                    if ($items.length === 0) {
                        $items = $navs.find('a');
                    }
                    $items.removeClass('current');

                    $item = $elem.parents("li");
                    if ($item.length > 0) {
                        $($item[0]).addClass('current');
                    } else if ($item.length === 0) {
                        $elem.addClass('current');
                    }
                }
            }
            var $targets = $('#' + target_ids.join(',#'));
            $targets.addClass('injection-loading');
            mapal.injection.ajax($elem, url, function() {
                htmlLoaded.apply(this, arguments);
                $targets.removeClass('injection-loading');
            });
        },

        ajax: function($elem, url, params, callback) {
            var type = "GET";

            if ( $elem.get(0).tagName == 'FORM') {
                type = 'POST';

                $elem.ajaxSubmit({
                    url: url,
                    type: 'POST',
                    success: params
                });
            } else {
                // if the second parameter was provided
                if (params) {
                    // if it's a function
                    if ($.isFunction(params)) {
                        // we assume that it's the callback
                        callback = params;
                        params = undefined;
                    } else if (typeof params === "object") {
                        // build a param string
                        params = $.param(params, $.ajaxSettings.traditional);
                        type = "POST";
                    }
                }

                jQuery.ajax({
                    url: url,
                    type: type,
                    dataType: "html",
                    data: params,
                    complete: function(jqXHR, textStatus) {
                        var header = jqXHR.getResponseHeader('X-Griddeo-Action');
                        var callCallback = true;
                        if (header) {
                            var parts = header.split(';');

                            if ( parts.length > 0 && $.isFunction(mapal.injection.griddeoActions[parts[0]]) ) {
                                callCallback = mapal.injection.griddeoActions[parts[0]]( parts.slice(1) );
                            }
                        }

                        if (callCallback) callback(jqXHR, textStatus);
                    },
                    error: function(xhr, status, errorThrown) {
                        return;
                    }
                });
            }

        },

        griddeoActions: {
            'force-redirect': function(params) {
                window.location = params[0].trim();
                return false;
            }
        },

        modifiers: {
            "replace": {
                "execute": function( $source, $target, appendTo ) {
                    if (appendTo) {
                        return $source;
                    }
                    // in an ideal world ids are unique, we can't rely on that
                    $source.addClass('tmp-injection-marker');
                    $target.replaceWith($source);
                    $target = $(".tmp-injection-marker");
                    $target.removeClass('tmp-injection-marker');
                    return $target;
                }
            },

            "content": {
                "execute": function( $source, $target ) {
                    $target.html($source.html());
                    return $target;
                }
            },

            "after": {
                "execute": function( $source, $target  ) {
                    var $children = $($source[0].children);
                    $target.append($children);
                    return $children;
                }
            },

            "before": {
                "execute": function( $source, $target ) {
                    var $children = $($source[0].children);
                    $target.prepend($children);
                    return $children;
                }
            },

            "prepend": {
                "execute": function( $source, $target ) {
                    $target.before($source);
                    $target.trigger('injection', $source);
                    return $source;
                }
            },
            "append": {
                "execute": function( $source, $target ) {
                    $target.after($source);
                    $target.trigger('injection', $source);
                    return $source;
                }
            }
        },

        completeArray: function( larger, smaller ) {
            var len = larger.length;
            for (var i = smaller.length; i < len; i ++ ) {
                smaller.push( larger[i] );
            }
        }
    },

    patterns: {
        "options": {
            search: {
                click:[
                       "a[rel^=#]:not(.cant-touch-this)",
                       "a[rel^='.']:not(.cant-touch-this)",
                       "a[data-injection^='.']:not(.cant-touch-this)",
                       "a[data-injection^=#]:not(.cant-touch-this)"
                     ],
                submit: [
                      "form[data-injection^='.']:not(.cant-touch-this)",
                      "form[data-injection^=#]:not(.cant-touch-this)"
                      ]
            }
        },

        'listeners': {
            'onBeforeStart': [],
            'onFinished': [],
            'onExecuted': []
        },

        // Enable DOM-injection from anchors
        init: function () {
            var key;
            // initalize the listeners for each of the patterns
            for (key in mapal.patterns) {
                if (mapal.patterns[key].execute) {
                    mapal.patterns[key].listeners = $.extend( true, {}, mapal.patterns.listeners );
                }
            }

            // Call the initialization function for each of the patterns
            for (key in mapal.patterns) {
                (mapal.patterns[key].init||$.noop)();

                if (mapal.patterns[key].dataAttr) {
                    //mapal.patterns.options.search.click.push('[data-' + key + ']');
                }
            }

            function handlePattern(e) {
                // First we get the source IDs, whether optional or not
                var targets, $a = $(this),
                    sources = ($a.attr("href")||$a.attr("action")).split("#"),
                    attrVal = ($a.attr("rel") || $a.attr("data-injection")),
                    $filter = $a.find('.filter');

                // make sure we don't interfere with openPanels below
                if ( $a.hasClass('openPanel') || $a.hasClass('closePanel') ) return;

                // HREF="http://url.to/follow#source1#source2";
                var url = sources[0];
                sources = sources.slice(1);

                // We treat injection differently than the other patterns
                // namely: injection will always be here!
                if ( attrVal.startsWith("#") ) {
                    // this means injection
                    if ( attrVal.length > 1 )
                        targets = attrVal.replace(/\s/g,"").split("#").slice(1);
                    else
                        targets = [];

                    // let injection handle the rest
                    mapal.injection.load($a, url, targets, sources, undefined, $filter);
                } else {
                    // this means some other pattern, so let the pattern handle what the attribute means
                    var re = /^[\.][a-zA-Z]+/;
                    var patt = re.exec(attrVal);

                    if ( patt.length === 0 ) {
                        // the pattern was malformed. Inform the designer
                        alert("Pattern[ERROR]: malformed pattern: " + attrVal);
                    } else {
                        patt = patt[0].slice(1);

                        var params = attrVal.replace(re, "");
                        var paramObjs = utils.extractParameters(params, sources);
                        if ( mapal.patterns[patt]  ) {
                            // only do something if we found the pattern
                            if (!mapal.patterns[patt].passive) {
                                // ignore the pattern if it is not active
                                if (mapal.patterns.callListener($a, patt, 'onBeforeStart')) {
                                    mapal.patterns[patt].execute($a, url, sources, paramObjs, e);
                                    mapal.patterns.callListener($a, patt, 'onExecuted');
                                }
                            }
                        } else {
                            alert('Pattern[WARN]: the pattern "' + patt + '" was not found');
                        }
                    }
                }
                e.preventDefault();
                return false;
            }

            $(mapal.patterns.options.search.click.join(", ")).live("click.mapal", handlePattern );
            $(mapal.patterns.options.search.submit.join(", ")).live("submit.mapal", handlePattern );
        },

        callListener: function( elem, pattern, event ) {
            var weContinue = true;
            $(mapal.patterns[pattern].listeners[event]).each(function(){
                if (weContinue && !this(elem) ) {
                    weContinue = false;
                    return;
                }
            });

            return weContinue;
        },

        registerListener: function(patterns, event, listener) {
            if (typeof patterns == 'string') {
                if (mapal.patterns[patterns].listeners[event]) {
                    mapal.patterns[patterns].listeners[event].push(listener);
                }
            } else {
                $(patterns).each( function() {
                    if (mapal.patterns[this]) {
                        if (mapal.patterns[this].listeners[event]) {
                            mapal.patterns[this].listeners[event].push(listener);
                        }
                    }
                });
            }
        }
    },

    passivePatterns: {
        'selectSiblingRadio': {
            init: function() {},
            initContent: function(root) {
                $(root).find('.selectSiblingRadio').focus(function() {
                    var $this = $(this);

                    $this.parent().find('input[type=radio]').attr('checked', true);
                });
            }
        }
    },

    // Setup a DOM tree.
    initContent: function(root, opts) {
        mapal.newstyle.scan(root, opts);

        for (var passivePatternName in mapal.passivePatterns) {
            var passivePattern = mapal.passivePatterns[passivePatternName];
            if (passivePattern.initContent && $.isFunction(passivePattern.initContent) ) {
                passivePattern.initContent(root);
            }
        }

        $(root).trigger("newContent", root);
    },


    // Setup global behaviour
    init: function() {
        mapal.patterns.init();
    },

    ui: {}
};

$.extend( mapal.ui, {
    "modal": function( url, options ) {
        var opts = '.modal';
        if (options) {
            for (var opt in options) {
                opts += '!' + opt + "=";
                if (typeof options[opt] == 'string') {
                    opts += "'" + options[opt] + "'";
                } else {
                    opts += options[opt];
                }
            }
        }
        var $a = $('<a>').attr('href', url).attr('rel', opts);
        $a.click();
    }
});

    return mapal;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
