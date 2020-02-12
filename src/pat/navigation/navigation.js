import $ from "jquery";
import Base from "../../core/base";
import Parser from "../../core/parser";
import logger from "../../core/logger";

const log = logger.getLogger("navigation");
const parser = new Parser("navigation");

parser.addArgument("item-wrapper", "li");
parser.addArgument("in-path-class", "navigation-in-path");
parser.addArgument("current-class", "current");

export default Base.extend({
    name: "navigation",
    trigger: "nav, .navigation, .pat-navigation",
    init: function($el, opts) {
        this.options = parser.parse($el, opts);
        var current = this.options.currentClass;
        // check whether to load
        if ($el.hasClass("navigation-load-current")) {
            $el.find("a." + current, "."  + current + " a").click();
            // check for current elements injected here
            $el.on("patterns-injected-scanned", function(ev) {
                var $target = $(ev.target);
                if ($target.is("a." + current))
                    $target.click();
                if ($target.is("." + current))
                    $target.find("a").click();
                this._updatenavpath($el);
            }.bind(this));
        }

        // An anchor within this navigation triggered injection
        $el.on("patterns-inject-triggered", "a", function(ev) {
            var $target = $(ev.target);
            // remove all set current classes
            $el.find("." + current).removeClass(current);
            // set current class on target
            $target.addClass(current);
            // If target's parent is an LI, also set current class there
            $target.parents(this.options.itemWrapper).first().addClass(current);
            this._updatenavpath($el);
        }.bind(this));

        var observer = new MutationObserver(this._initialSet.bind(this));
        observer.observe($el[0], {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false,
        });

        this._initialSet();
    },
    _initialSet: function () {
        var $el = this.$el;
        var current = this.options.currentClass;
        // Set current class if it is not set
        if ($el[0].querySelectorAll('.' + current).length === 0) {
            $el[0].querySelectorAll("a").forEach(function (it) {
                var $a = $(it),
                    $li = $a.parents(this.options.itemWrapper).first(),
                    url = $a.attr("href"),
                    path;
                if (typeof url === "undefined") {
                    return;
                }
                path = this._pathfromurl(url);
                log.debug("checking url:", url, "extracted path:", path);
                if (this._match(window.location.pathname, path)) {
                    log.debug("found match", $li);
                    $a.addClass(current);
                    $li.addClass(current);
                }
            }.bind(this));
        }

        // Set current class on item-wrapper, if not set.
        if (
            this.options.itemWrapper
            && $el[0].querySelectorAll('.' + current).length > 0
            && $el[0].querySelectorAll(this.options.itemWrapper + '.' + current).length === 0
        ) {
            $('.' + current, $el).parents(this.options.itemWrapper).first().addClass(current);
        }

        this._updatenavpath($el);
    },
    _updatenavpath: function($el) {
        var in_path = this.options.inPathClass;
        if (! in_path) { return; }
        $el.find('.' + in_path).removeClass(in_path);
        $el.find(this.options.itemWrapper + ":not(." + this.options.currentClass + "):has(." + this.options.currentClass + ")").addClass(in_path);
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
});
