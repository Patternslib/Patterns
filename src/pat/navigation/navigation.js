define([
    "jquery",
    "pat-parser",
    "pat-logger",
    "pat-registry",
    "pat-base"
], function($, Parser, logger, registry, Base) {
    var log = logger.getLogger("pat.navigation"),
        parser = new Parser("navigation");

    parser.addArgument("item-parent-selector", "li");

    return Base.extend({
        name: "navigation",
        trigger: "nav, .navigation, .pat-navigation",
        init: function($el, opts) {
            var that = this;
            this.options = parser.parse($el, opts);
            this.anchors = this._findOwnAnchors().click(function(ev) {
                that._markCurrent($(ev.target));
            });

            if ($el.find(".current").length === 0) {
                that._autosetCurrent.bind(that)();
            }

            if ($el.hasClass("navigation-load-current")) {
                this._loadCurrent.bind(this)();
            }
        },
        _findNavigation: function($el) {
            if ($el.is(this.trigger)) {
                // $el is already a nav element
                return $el;
            }
            return $el.parents(this.trigger).first();
        },
        _findOwnAnchors: function($target) {
            /*
             * Find the anchors that are inside this navigation element
             * but discard the one contained in a nested one
             */
            var that = this,
                check = this.$el[0];
            $target = $target || this.$el;
            return $target.find(this.options.itemParentSelector + ' a').filter(
                function(idx, anchor) {
                    return that._findNavigation($(anchor))[0] === check;
                }
            )
        },
        _loadCurrent: function() {
            /*
             * Simulate a click on the currently selected tab
             */
            this.anchors.filter("a.current, .current a").click();
        },
        _pathfromurl: function(url) {
            var path = url.split("#")[0].split("://");
            if (path.length > 2) {
                log.error("weird url", url);
                return "";
            }
            if (path.length === 1) return path[0];
            return path[1].split("/").slice(1).join("/");
        },
        _match: function(curpath, path) {
            if (!path) {
                log.debug("path empty");
                return false;
            }
            // current path needs to end in the anchor's path
            if (path !== curpath.slice(-path.length)) {
                log.debug(curpath, "does not end in", path);
                return false;
            }
            // XXX: we might need more exclusion tests
            return true;
        },
        _autosetCurrent: function() {
            var that = this;
            this.anchors.each(function() {
                var $a, url, path, curpath;
                $a = $(this);
                url = $a.attr("href");
                if (typeof url === "undefined") {
                    return;
                }
                path = that._pathfromurl(url);
                log.debug("checking url:", url, "extracted path:", path);
                curpath = window.location.pathname
                if (path.indexOf('#') !== -1) {
                    curpath += '#' + window.location.hash;
                }
                if (that._match(window.location.pathname, path)) {
                    that._markCurrent($a);
                }
            });
        },
        _markCurrent: function($el) {
            var that = this;
            // First unset the current class in all the anchors
            this.anchors.each(function (idx, el) {
                that._unmarkCurrent($(el));
            });
            // then set it to the proper element
            $el.addClass("current");
            if (this.options.itemParentSelector) {
                $el.parents(this.options.itemParentSelector).first().addClass("current");
            }
            // finally update the navigation-in-path class
            $el.find(".navigation-in-path").removeClass("navigation-in-path");
            if (this.options.itemParentSelector) {
                $el.find(this.options.itemParentSelector + ":has(.current)").addClass("navigation-in-path");
            }
            return $el;
        },
        _unmarkCurrent: function($el) {
            $el.removeClass("current");
            $el.find(".navigation-in-path").removeClass("navigation-in-path");
            if (this.options.itemParentSelector) {
                $el.parents(this.options.itemParentSelector).first().removeClass("current");
            }
        }
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
