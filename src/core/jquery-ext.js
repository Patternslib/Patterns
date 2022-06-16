/**
 * @license
 * Patterns @VERSION@ jquery-ext - various jQuery extensions
 *
 * Copyright 2011 Humberto Sermeño
 */

import $ from "jquery";

var methods = {
    init: function (options) {
        var settings = {
            time: 3 /* time it will wait before moving to "timeout" after a move event */,
            initialTime: 8 /* time it will wait before first adding the "timeout" class */,
            exceptionAreas:
                [] /* IDs of elements that, if the mouse is over them, will reset the timer */,
        };
        return this.each(function () {
            var $this = $(this),
                data = $this.data("timeout");

            if (!data) {
                if (options) {
                    $.extend(settings, options);
                }
                $this.data("timeout", {
                    lastEvent: new Date(),
                    trueTime: settings.time,
                    time: settings.initialTime,
                    untouched: true,
                    inExceptionArea: false,
                });

                $this.on("mouseover.timeout", methods.mouseMoved);
                $this.on("mouseenter.timeout", methods.mouseMoved);

                $(settings.exceptionAreas).each(function () {
                    $this
                        .find(this)
                        .live(
                            "mouseover.timeout",
                            { parent: $this },
                            methods.enteredException
                        )
                        .live(
                            "mouseleave.timeout",
                            { parent: $this },
                            methods.leftException
                        );
                });

                if (settings.initialTime > 0) $this.timeout("startTimer");
                else $this.addClass("timeout");
            }
        });
    },

    enteredException: function (event) {
        var data = event.data.parent.data("timeout");
        data.inExceptionArea = true;
        event.data.parent.data("timeout", data);
        event.data.parent.trigger("mouseover");
    },

    leftException: function (event) {
        var data = event.data.parent.data("timeout");
        data.inExceptionArea = false;
        event.data.parent.data("timeout", data);
    },

    destroy: function () {
        return this.each(function () {
            var $this = $(this),
                data = $this.data("timeout");

            $(window).off(".timeout");
            data.timeout.remove();
            $this.removeData("timeout");
        });
    },

    mouseMoved: function () {
        var $this = $(this),
            data = $this.data("timeout");

        if ($this.hasClass("timeout")) {
            $this.removeClass("timeout");
            $this.timeout("startTimer");
        } else if (data.untouched) {
            data.untouched = false;
            data.time = data.trueTime;
        }

        data.lastEvent = new Date();
        $this.data("timeout", data);
    },

    startTimer: function () {
        var $this = $(this),
            data = $this.data("timeout");
        var fn = function () {
            var data = $this.data("timeout");
            if (data && data.lastEvent) {
                if (data.inExceptionArea) {
                    setTimeout(fn, Math.floor(data.time * 1000));
                } else {
                    var now = new Date();
                    var diff = Math.floor(data.time * 1000) - (now - data.lastEvent);
                    if (diff > 0) {
                        // the timeout has not ocurred, so set the timeout again
                        setTimeout(fn, diff + 100);
                    } else {
                        // timeout ocurred, so set the class
                        $this.addClass("timeout");
                    }
                }
            }
        };

        setTimeout(fn, Math.floor(data.time * 1000));
    },
};

$.fn.timeout = function (method) {
    if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === "object" || !method) {
        return methods.init.apply(this, arguments);
    } else {
        $.error("Method " + method + " does not exist on jQuery.timeout");
    }
};

// Custom jQuery selector to find elements with scrollbars
$.extend($.expr[":"], {
    scrollable: function (element) {
        var vertically_scrollable, horizontally_scrollable;
        if (
            $(element).css("overflow") === "scroll" ||
            $(element).css("overflowX") === "scroll" ||
            $(element).css("overflowY") === "scroll"
        )
            return true;

        vertically_scrollable =
            element.clientHeight < element.scrollHeight &&
            ($.inArray($(element).css("overflowY"), ["scroll", "auto"]) !== -1 ||
                $.inArray($(element).css("overflow"), ["scroll", "auto"]) !== -1);

        if (vertically_scrollable) return true;

        horizontally_scrollable =
            element.clientWidth < element.scrollWidth &&
            ($.inArray($(element).css("overflowX"), ["scroll", "auto"]) !== -1 ||
                $.inArray($(element).css("overflow"), ["scroll", "auto"]) !== -1);
        return horizontally_scrollable;
    },
});

//Work around warning for jQuery 3.x:
//JQMIGRATE: jQuery.fn.offset() requires an element connected to a document
$.fn.safeOffset = function () {
    var docElem,
        elem = this[0],
        origin = { top: 0, left: 0 };

    if (!elem || !elem.nodeType) {
        return origin;
    }

    docElem = (elem.ownerDocument || document).documentElement;
    if (!$.contains(docElem, elem)) {
        return origin;
    }

    return $.fn.offset.apply(this, arguments);
};

$.fn.slideIn = function (speed, easing, callback) {
    return this.animate({ width: "show" }, speed, easing, callback);
};

$.fn.slideOut = function (speed, easing, callback) {
    return this.animate({ width: "hide" }, speed, easing, callback);
};

export default undefined;
