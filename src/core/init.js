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
    // XXX: belong to the patterns once they are done
    '../lib/dist/jquery.fancybox-1.3.4',
    '../lib/jquery.form/jquery.form',
    '../lib/dist/jquery.jcarousel.min',
    '../lib/dist/jquery.tools.min',
    '../jquery-ext',
    '../utils'
], function(require) {

var utils = require('../utils');

var mapal = {
    widthClasses: {},

    // Utility methods
    registerWidthClass: function(cls, minimum, maximum) {
        mapal.widthClasses[cls] = { minimum: minimum,
                                    maximum: maximum };
    },

    _renumberAttribute: function(el, attr, i) {
        var $el = $(el),
            buf = $el.attr(attr);
        if (buf) {
            $el.attr(attr, buf.replace(/[0-9]+/, i));
        }
    },

    renumber: function($container, selector) {
        var $entries = $container.find(selector ? selector : "fieldset,tr,dd"),
            entry, i;

        for (i=0; i<$entries.length; i++) {
            entry = $entries.get(i);
            mapal._renumberAttribute(entry, "id", i);
            $("label, :input", entry).each(function() {
                mapal._renumberAttribute(this, "for", i);
                mapal._renumberAttribute(this, "id", i);
                mapal._renumberAttribute(this, "name", i);
            });
        }
    },


    // Give the first input element with the autofocus class the focus
    initAutofocus: function(root) {
        var $elements = $(":input.autofocus:not(.cant-touch-this)", root),
            i;

        for (i=0; i < $elements.length; i+=1) {
            if (!$elements.eq(i).val()) {
                $elements.get(i).focus();
                break;
            }
        }
        if (i===$elements.length) {
            $elements.eq(0).focus();
        }
    },

    // A simple autocomplete pattern
    initAutocomplete: function(root) {
          $("input.autocomplete:not(.cant-touch-this)", root).each(function() {
              var $input = $(this),
                  name = $input.attr("name"),
                  $storage;
              $input.attr("name", "_"+name);
              $storage=$("<input type='hidden'/>").attr("name", name).insertBefore($input);
              $input.autocomplete({source: $input.attr("src"),
                                   minLength: 2,
                                   select: function(event, ui) {
                                        $storage.val(ui.item.value);
                                        $input.val(ui.item.label);
                                        return false;
                                   }
                                   });
          });
    },


    // Check if all dependencies as specified in `command` for
    // an element are satisfied.
    verifyDependencies: function($slave, command) {
        var result=[],
            $form = $slave.closest("form"),
            $input, i, value, parts;

        if (!$form.length) {
            $form=$(document);
        }
        for (i=0; i<command.on.length; i++) {
            parts=command.on[i];

            $input = $form.find(":input[name="+parts[0]+"]");
            if (!$input.length) {
                result.push(false);
                continue;
            }

            if ($input.attr("type")==="radio" || $input.attr("type")==="checkbox") {
                value = $input.filter(":checked").val();
            } else {
                value = $input.val();
            }

            if ((parts.length===1 || parts[1]==="on") && !value) {
                result.push(false);
                continue;
            } else if (parts[1]==="off" && value) {
                result.push(false);
                continue;
            } else if (parts.length>2) {
                if (parts[1]==="equals" && parts[2]!==value) {
                    result.push(false);
                    continue;
                } else if (parts[1]==="notEquals" && parts[2]===value) {
                    result.push(false);
                    continue;
                }
            }
            result.push(true);
        }

        if (command.type==="or") {
            for (i=0; i<result.length; i++) {
                if (result[i]) {
                    return true;
                }
            }
            return false;
        } else {
            for (i=0; i<result.length; i++) {
                if (!result[i]) {
                    return false;
                }
            }
            return true;
        }
    },


    // Return the list of all input elements on which the given element has
    // a declared dependency via `dependsOn` classes.
    getDependMasters: function($slave, command) {
        var $result = $(),
            $form = $slave.closest("form"),
            i, parts;

        if (!$form.length) {
            $form=$(document);
        }

        for (i=0; i<command.on.length; i++) {
            parts=command.on[i];
            if (!parts) {
                continue;
            }

            $result=$result.add($form.find(":input[name="+parts[0]+"]"));
        }

        return $result;
    },


    // Setup dependency-tracking behaviour.
    initDepends: function(root) {
        $("*[class*='dependsOn-']", root).each(function() {
            var slave = this,
                $slave = $(this),
                $visible = $(this),
                $panel = $slave.data("mapal.infoPanel"),
                classes = $slave.attr("class").split(" "),
                command = {"on" : [],
                           "action" : "show",
                           "type": "and"
                           };
            var i, a, parts, state;

            for (i=0; i<classes.length; i++) {
                parts=classes[i].split("-");
                if (parts[0].indexOf("depends")===0) {
                    a=parts[0].substr(7).toLowerCase();
                    if (a==="on") {
                        if (parts.length>4) {
                            parts=parts.slice(0,3).concat(parts.slice(3).join("-"));
                        }
                        command.on.push(parts.slice(1));
                    } else {
                        command[a]=parts[1];
                    }
                }
            }

            state=mapal.verifyDependencies($slave, command);
            if ($panel!==undefined) {
                $visible=$visible.add($panel);
            }

            if (command.action==="show") {
                if (state) {
                    $visible.show();
                } else {
                    $visible.hide();
                }
            } else if (command.action==="enable") {
                if (state) {
                    slave.disabled=null;
                    $slave.removeClass("disabled");
                } else {
                    slave.disabled="disabled";
                    $slave.addClass("disabled");
                }
            }

            mapal.getDependMasters($slave, command).bind("change.mapal", function() {
                state=mapal.verifyDependencies($slave, command);
                if (command.action==="show") {
                    if (state) {
                        $visible.slideDown();
                    } else {
                        $visible.slideUp();
                    }
                } else if (command.action==="enable" ) {
                    if (state) {
                        slave.disabled=null;
                        $slave.removeClass("disabled");
                    } else {
                        slave.disabled="disabled";
                        $slave.addClass("disabled");
                    }
                }
            });
        });
    },


    // check if an input element has a value.
    hasContent: function($el) {
        if ($el.is(":input")) {
            return $el.val();
        } else {
            return $el.text().replace(/\s*/g, "") || $el.find("img,object,video,audio").length;
        }
    },

    // Support for superimposing labels on input elements
    initSuperImpose: function(root) {
        $("label.superImpose:not(.cant-touch-this)", root).each(function() {
            var $label = $(this),
                forInput = $label.attr("for").replace(/([.\[\]])/g, "\\$1"),
                $myInput = forInput ? $(":input#"+forInput+", .rich[id="+forInput+"]") : $(":input", this);

            if (!$myInput.length) {
                return;
            }

            $label
                .css("display", mapal.hasContent($myInput) ? "none" : "block")
                .click(function() {
                    $myInput.focus();
                });

            setTimeout(function() {
                $label.css("display", mapal.hasContent($myInput) ? "none" : "block");
                }, 250);

            $myInput
                .bind("blur.mapal", function() {
                    $label.css("display", mapal.hasContent($myInput) ? "none" : "block");
                })
                .bind("focus.mapal", function() {
                    $label.css("display", "none");
                });
        });
    },


    // Apply some standard markup transformations
    initTransforms: function(root) {
        // record history disables mostly everything for now
        $(".record-history", root).addClass('cant-touch-this');
        $(root).is(".record-history") && $(root).addClass('cant-touch-this');

        $(".jsOnly", root).show();

        $("legend:not(.cant-touch-this)", root).each(function() {
            $(this).replaceWith('<p class="legend">'+$(this).html()+'</p>');
        });

        $("label dfn.infoPanel:not(.cant-touch-this)", root).each(function() {
            var $panel = $(this),
                $label = $panel.closest("label"),
                $body = $("body"),
                offset = $panel.offset();
            $panel
                .remove()
                .appendTo($body)
                .css({position: "absolute", left: offset.left, top: offset.top});
            $label.data("mapal.infoPanel", $panel);
        });
    },


    // Manage open/close/hasChild classes for a ul-based menu tree
    initMenu: function(root) {
        $("ul.menu:not(.cant-touch-this)").each(function() {
            var $menu = $(this),
                timer,
                closeMenu, openMenu,
                mouseOverHandler, mouseOutHandler;

            openMenu = function($li) {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }

                if (!$li.hasClass("open")) {
                    $li.siblings("li.open").each(function() { closeMenu($menu);});
                    $li.addClass("open").removeClass("closed");
                }
            };

            closeMenu = function($li) {
                $li.find("li.open").andSelf().removeClass("open").addClass("closed");
            };

            mouseOverHandler = function() {
                var $li = $(this);
                openMenu($li);
            };

            mouseOutHandler = function() {
                var $li = $(this);

                if (timer) {
                    clearTimeout(timer);
                    timer=null;
                }

                timer = setTimeout(function() { closeMenu($li); }, 1000);
            };

            $("ul.menu li", root)
                .addClass("closed")
                .filter(":has(ul)").addClass("hasChildren").end()
                .bind("mouseover.mapal", mouseOverHandler)
                .bind("mouseout.mapal", mouseOutHandler);
        });
    },

    injection: {
        options: {
            defaultModifier: "replace",
            modifiers: {

            },

            bodyInjectionId: "__original_body"
        },

        load: function($elem, url, targets, sources, callback, $filter) {
            callback = callback || function() {};
            // to have more versatility when calling the function
            if (typeof sources == "string") sources = [ sources ];
            if (typeof targets == "string") targets = [ targets ];

            if ( sources.length > targets.length ) {
                mapal.injection.completeArray(sources, targets);
            } else {
                // empty source will use content of <body> instead.
                // (exclamation mark is to make sure an id with value "body" will still work as well)
                for (var i = sources.length; i < targets.length; i++) {
                    sources.push(mapal.injection.options.bodyInjectionId);
                }
            }

            var target_ids = [];
            var modifiers = [], modifier;
            var modifier_re = /:[a-zA-Z]+/;

            for (var i = 0; i < targets.length; i++) {
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
                        var $source = $factory.find('#'+mapal.injection.options.bodyInjectionId);
                        modifier = "content";
                    } else {
                        var $source = $factory.find( '#' + sources[idx] );
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
                            (callback['onFinished']||$.noop)($target);
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
            // initalize the listeners for each of the patterns
            for (var key in mapal.patterns) {
                if (mapal.patterns[key].execute) {
                    mapal.patterns[key].listeners = $.extend( true, {}, mapal.patterns.listeners );
                }
            }

            // Call the initialization function for each of the patterns
            for (var key in mapal.patterns) {
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

                    if ( patt.length == 0 ) {
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
            };

            $(mapal.patterns.options.search.click.join(", ")).live("click.mapal", handlePattern );
            $(mapal.patterns.options.search.submit.join(", ")).live("submit.mapal", handlePattern );
        },

        callListener: function( elem, pattern, event ) {
            var weContinue = true;
            $(mapal.patterns[pattern].listeners[event]).each(function(){
                if (weContinue && !this(elem) ) {
                    weContinue = false;
                    return;
                };
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

    closeTooltips: function() {
        $("dfn.infoPanel.open").removeClass("open");
        $("body").unbind("click.tooltip");
    },

    initTooltip: function(root) {
        $(root).find(".tooltipTrigger").each( function() {
            $(this).tooltip({relative: true}).dynamic();
        });

        $("dfn.infoPanel:not(span)").each(function() {
            var $panel = $(this),
                title = $panel.attr("title");

            if ($panel.data("mapal.tooltip")) {
                return;
            }

            if (title) {
                $("<span/>")
                    .addClass("title")
                    .text(title)
                    .prependTo($panel);
                $panel.removeAttr("title");
            }

            $panel
                .click(function(event) {
                    if ($panel.hasClass("open")) {
                        $panel.removeClass("open");
                        $("body").unbind("click.tooltip");
                    } else {
                        mapal.closeTooltips();
                        $panel.addClass("open");
                        $("body").one("click.tooltip", mapal.closeTooltips);
                    }
                    event.stopPropagation();
                })
                .data("mapal.tooltip", true);
        });
    },

    // Utility method to update the width classes on the body
    updateWidthClasses: function() {
        var width = $(window).width(),
            $body = $("body"),
            limits;

        for (var cls in mapal.widthClasses) {
            if (mapal.widthClasses.hasOwnProperty(cls)) {
                limits=mapal.widthClasses[cls];
                if ((limits.minimum===null || limits.minimum<=width) && (limits.maximum===null || width<=limits.maximum)) {
                    $body.addClass(cls);
                } else {
                    $body.removeClass(cls);
                }
            }
        }
    },


    initWidthClasses: function() {
        mapal.updateWidthClasses();
        $(window).bind("resize.mapal", mapal.updateWidthClasses);
    },


    // No browser supports all DOM methods to get from an object to its
    // parent window and document and back again, so we convert all
    // html objects to iframes.
    initIframes: function(root) {
        $("object[type=text/html]", root).each(function() {
            var $object = $(this),
                $iframe = $("<iframe allowtransparency='true'/>");

            $iframe
                .attr("id", $object.attr("id"))
                .attr("class", $object.attr("class"))
                .attr("src", $object.attr("data"))
                .attr("frameborder", "0")
                .attr("style", "background-color:transparent");
            $object.replaceWith($iframe);
        });
    },

    // Older IE versions need extra help to handle buttons.
    initIEButtons: function() {
        if ($.browser.msie ) {
            var version = Number( $.browser.version.split(".", 2).join(""));
            if (version>80) {
                return;
            }
        }

        $("form button[type=submit]").live("click", function() {
            var name = this.name,
                $el = $("<input/>"),
                value = this.attributes.getNamedItem("value").nodeValue;

            $el.attr("type", "hidden")
               .attr("name", name)
               .val(value)
               .appendTo(this.form);
            $("button[type=submit]", this.form).attr("name", "_buttonfix");
        });

    },

    initSorts: function( root ) {
        $sorting = $(root).find('ul.sorting');

        if ($sorting.length > 0) {
            $sorting.sortable({
                'axis': 'y',
                'items': 'li',
                'update': function(event, ui){
                    var $this = $(this);
                    var order = $this.sortable("serialize");

                    $.post($this.attr("data-injection"), order);
                }
            });
        }
    },

    initButtonSets: function(root) {
        if ( $(root).buttonset ) {
            $(root).find('.buttonSet').removeClass('buttonSet').buttonset();
        }
    },

    initAutoLoads: function( root ) {
        // find all autoloads
        $(root).find('.autoLoading-visible:not(.cant-touch-this)').each(function() {
            var $autoload = $(this),
                $scrollable = $autoload.parents(":scrollable");

            // ignore executed autoloads
            if ($autoload.data('autoLoading')) return false;

            // function to trigger the autoload and mark as triggered
            var trigger = function() {
                $autoload.data('autoLoading', true);
                $autoload.trigger('click');
                return true;
            };

            // if autoload has no scrollable parent -> trigger it, it is visible
            if ($scrollable.length === 0) return trigger();

            // if scrollable parent and visible -> trigger it
            // we only look at the closest scrollable parent, no nesting
            var checkVisibility = function() {
                if ($autoload.data('autoLoading')) return false;
                var reltop = $autoload.offset().top - $scrollable.offset().top - 1000,
                    doTrigger = reltop <= $scrollable.innerHeight();
                if (doTrigger) return trigger();
                return false;
            };
            if (checkVisibility()) return true;

            // wait to become visible - again only immediate scrollable parent
            $($scrollable[0]).on("scroll", checkVisibility);
            $(window).on('resize', checkVisibility);
            return false;
        });
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
        mapal.initTransforms(root);

        mapal.newstyle.scan(root, opts);

        mapal.initAutofocus(root);
        mapal.initAutocomplete(root);
        mapal.initDepends(root);
        mapal.initSuperImpose(root);
        mapal.initTooltip(root);
        mapal.initMenu(root);
        mapal.initSorts(root);
        mapal.initButtonSets(root);
        mapal.initAutoLoads(root);
        //

        for (passivePatternName in mapal.passivePatterns) {
            var passivePattern = mapal.passivePatterns[passivePatternName];
            if ( passivePattern.initContent && $.isFunction(passivePattern['initContent']) ) {
                passivePattern.initContent(root);
            }
        }

        // Replace objects with iframes for IE 8 and older.
        if ($.browser.msie ) {
            var version = Number( $.browser.version.split(".", 2).join(""));
            if (version<=80) {
                mapal.initIframes(root);
            }
        }

        $(root).trigger("newContent", root);
    },


    // Setup global behaviour
    init: function() {
        mapal.initWidthClasses();
        mapal.patterns.init();
        //mapal.initIEButtons();
    },

    ui: {}
};

$.extend( mapal.ui, {
    "modal": function( url, options ) {
        var opts = '.modal';
        if (options) {
            for (opt in options) {
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
