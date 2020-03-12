define([
    "jquery",
    "pat-registry",
    "pat-parser",
    "pat-logger",
], function($, registry, Parser, logger) {
    var log = logger.getLogger("navigation");
    var parser = new Parser("navigation");

    parser.addArgument("in-path-class", "navigation-in-path");
    parser.addArgument("current-class", "current");

    var _ = {
        name: "navigation",
        trigger: "nav, .navigation, .pat-navigation",
        current: null,
        in_path: null,
        init: function($el, opts) {
            this.options = parser.parse($el, opts);
            this.current = this.options.currentClass;
            this.in_path = this.options.inPathClass;

            var curpath = window.location.pathname;
            log.debug("current path:", curpath);

            // check whether to load
            if ($el.hasClass("navigation-load-current")) {
                $el.find("a." + this.current, "."  + this.current + " a").click();
                // check for current elements injected here
                $el.on("patterns-injected-scanned", function(ev) {
                    var $target = $(ev.target);
                    if ($target.is("a." + this.current))
                        $target.click();
                    if ($target.is("." + this.current))
                        $target.find("a").click();
                    _._updatenavpath($el);
                }.bind(this));
            }

            // An anchor within this navigation triggered injection
            $el.on("patterns-inject-triggered", "a", function(ev) {
                var $target = $(ev.target);
                // remove all set current classes
                $el.find("." + this.current).removeClass(this.current);
                // set current class on target
                $target.addClass(this.current);
                // If target's parent is an LI, also set current class there
                $target.parent("li").addClass(this.current);
                _._updatenavpath($el);
            }.bind(this));

            // Set current class if it is not set
            if ($el.find(this.current).length === 0) {
                document.querySelectorAll("li a").forEach(function (it) {
                    var $a = $(it),
                        $li = $a.parents("li:first"),
                        url = $a.attr("href"),
                        path;
                    if (typeof url === "undefined") {
                        return;
                    }
                    path = _._pathfromurl(url);
                    log.debug("checking url:", url, "extracted path:", path);
                    if (_._match(curpath, path)) {
                        log.debug("found match", $li);
                        $li.addClass(this.current);
                    }
                }.bind(this));
            }
            _._updatenavpath($el);
        },
        _updatenavpath: function($el) {
            if (this.in_path === null) { return; }
            $el.find(this.in_path).removeClass(this.in_path);
            $el.find("li:not(." + this.current + "):has(." + this.current + ")").addClass(this.in_path);
        },
        _match: function(curpath, path) {
            if (!path) {
                log.debug("path empty");
                return false;
            }
            // current path needs to end in the anchor's path
            if (path !== curpath.slice(- path.length)) {
                log.debug(curpath, "does not end in", path);
                return false;
            }
            // XXX: we might need more exclusion tests
            return true;
        },
        _pathfromurl: function(url) {
            var path = url.split("#")[0].split("://");
            if (path.length > 2) {
                log.error("weird url", url);
                return "";
            }
            if (path.length === 1) return path[0];
            return path[1].split("/").slice(1).join("/");
        }
    };
    registry.register(_);
    return _;
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
