/**
 * @license
 * Patterns @VERSION@ floatingPanel - easily create floating panels
 *
 * Copyright 2008-2012 Simplon B.V.
 * Copyright 2011 Humberto Sermeño
 * Copyright 2011 SYSLAB.COM GmbH
 */
define([
    'require',
    '../core/init'
], function(require) {
    var mapal = require('../core/init');

    var modal = {
        options: {
            "class": "",
            "loadingText": "Loading...",
            'showLoading': true,
            pauseVideo: false
        },

        init: function() {
            $("#panel .closePanel").live('click.mapalModal', function(e) {
                modal._findClose($(this));
                e.preventDefault();
                return false;
            });
            //	mapal.patterns.registerListener(['selfHealing'], 'onExecuted', mapal.patterns.modal._findClose);
        },

        _findClose: function($elem) {
            if ( $elem.hasClass('closePanel') ) {
                var $panel = $elem.parents( "#panel" );
                if ( $panel.length > 0 ) {
                    modal.close($panel);
                }
            }
        },

        execute: function( elem, url, sources, params, event ) {
            var $trigger = $(event.target),
                href = event.target.tagName.toLowerCase()==="a" ? $trigger.attr("href") : $trigger.attr("name"),
                parts = href.split("#", 2),
                $panel = $("#panel");
            var source = (parts[1] == undefined) ? [] : parts[1];

            var opts = $.extend({}, modal.options, params);

            if ($panel.length===0) {
                $panel = $("<div/>")
                    .attr("id", "panel")
                    .appendTo(document.body);
                $("<div/>").attr("id","panel-content").appendTo($panel);
            }

            $panel.data('modal', opts);

            modal.pauseVideo(opts, true);

            if (opts['showLoading']) {
                var $loading = $("<div>").text(opts['loadingText']).attr("id", "panel-loading");
                $('<span>').appendTo($loading);
                $loading.appendTo($panel);

                $panel.addClass('loading');

                modal.apiInit($panel, opts);
                modal.centerOverlay($panel);
            }

            mapal.injection.load(elem, parts[0], "panel-content:content", source, 
                                 function($target) {
                    $panel.attr('class', opts['class']);

                    $target.css("opacity", 1).addClass("panel");


                    if (opts['showLoading']) {
                        $("#panel-loading").remove();
                    } else {
                        mapal.injection.apiInit($panel, opts);
                    }

                    modal.centerOverlay($panel);
                }
            );
        },

        apiInit: function($panel, opts) {
            var api;

            //$target.find("form").ajaxForm({context: $trigger.get(0),
            //                           success: mapal.patterns.modal.formHandler});
            api = $panel.overlay({api: true,
                                  closeOnClick: false,
                                  onClose: function() {
                                      modal.pauseVideo(opts, false);
                                  },
                                  top: 'center',
                                  mask: {color: "#ebecff", loadSpeed: 200, opacity: 0.9}});
            api.load();
        },

        'centerOverlay': function( $panel ) {
            var win = $(window);
            var w = $panel.outerWidth({ "margin": true });//get width of overlay
            var h = $panel.outerHeight({ "margin": true }); //get height of overlay
            var l = Math.max((win.width() - w) / 2, 0);  //calculate left property
            var t = Math.max((win.height() - h) / 2, 0);  //calculate top property

            $panel.css({ 'position': 'fixed', 'top': t, 'left': l });
        },

        "close": function($panel) {
            //var opts = $panel.data('modal');
            //mapal.patterns.modal.pauseVideo(opts, false);
            $panel.overlay().close();
            $panel.remove();
        },

        pauseVideo: function( opts, which ) {
            if (typeof Playbox !== 'undefined' && opts && opts.pauseVideo ) {
                if ( which ) {
                    Playbox.pause();
                } else {
                    Playbox.resume();
                }
            }
        },

        formHandler: function(data, status, xhr, $form) {
            // regexp taken from jQuery 1.4.1
            var rscript = /<script(.|\s)*?\/script>/gi,
         $trigger = $(this.context),
         href = this.context.tagName.toLowerCase()==="a" ? $trigger.attr("href") : $trigger.attr("name"),
         action = $form.attr("action"),
         $panel = $("#panel"),
         ct = xhr.getResponseHeader("content-type"),
         isJSON = ct.indexOf("application/json") >= 0,
         $tree, target;

            // Error or validation error
            if (isJSON || xhr.status !== 202) {
                if (isJSON) {
                    var reply = $.parseJSON(xhr.responseText);
                    $trigger.trigger("ajaxFormResult", reply);
                    if (reply.action==="reload") {
                        location.reload();
                    } else if (reply.action==="close" || !reply.action) {
                        modal.close($panel);
                    }
                    return;
                } else {
                    $trigger.trigger("ajaxFormResult");
                }
                modal.close($panel);
                return;
            }

            if (action.indexOf("#")>0) {
                target = action.split("#", 2)[1];
            } else {
                target = href.split("#", 2)[1];
            }

            $tree = $("<div/>").append(data.replace(rscript, ""));
            $tree = $tree.find("#"+target).attr("id", "panel-content");
            mapal.initContent(target);
            $("#panel-content").replaceWith($tree);
            $panel.find("form").ajaxForm({context: this.context,
                                          success: modal.formHandler});
        }
    };
    return modal;
});
