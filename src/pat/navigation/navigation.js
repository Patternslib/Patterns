import Base from "../../core/base";
import Parser from "../../core/parser";
import logging from "../../core/logging";

const log = logging.getLogger("navigation");

export const parser = new Parser("navigation");
parser.addArgument("item-wrapper", "li");
parser.addArgument("in-path-class", "navigation-in-path");
parser.addArgument("current-class", "current");

export default Base.extend({
    name: "navigation",
    trigger: "nav, .navigation, .pat-navigation",

    init() {
        this.options = parser.parse(this.el, this.options);
        const current = this.options.currentClass;

        // Automatically load the ``.current`` item.
        if (this.el.classList.contains("navigation-load-current")) {
            this.el.querySelector(`a.${current}, .${current} a`)?.click();
            // check for current elements injected here
            this.$el.on(
                "patterns-injected-scanned",
                function (ev) {
                    const target = ev.target;
                    if (target.matches(`a.${current}`)) target.click();
                    if (target.matches(`.${current}`))
                        target.querySelector("a")?.click();
                    this._updatenavpath();
                }.bind(this)
            );
        }

        // Mark the navigation items after pat-inject triggered within this navigation menu.
        this.$el.on(
            "patterns-inject-triggered",
            "a",
            function (ev) {
                const target = ev.target;
                // Remove all set current classes
                this.el.querySelectorAll(`.${current}`).forEach((it) => {
                    it.classList.remove(current);
                });
                // Set current class on target
                target.classList.add(current);
                // Also set the current class on the item wrapper.
                target.closest(this.options.itemWrapper)?.classList.add(current);
                this._updatenavpath();
            }.bind(this)
        );

        // Re-init when navigation changes.
        const observer = new MutationObserver(this._initialSet.bind(this));
        observer.observe(this.el, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false,
        });

        // Initialize.
        this._initialSet();
    },

    _initialSet() {
        const current = this.options.currentClass;

        // Set current class if it is not set
        if (this.el.querySelectorAll(`.${current}`).length === 0) {
            const a_els = this.el.querySelectorAll("a");
            for (const a_el of a_els) {
                const li = a_el.closest(this.options.itemWrapper);
                const url = a_el.getAttribute("href");
                if (typeof url === "undefined") {
                    return;
                }
                const path = this._pathfromurl(url);
                log.debug(`checking url: ${url}, extracted path: ${path}`);
                if (this._match(window.location.pathname, path)) {
                    log.debug("found match", li);
                    a_el.classList.add(current);
                    li.classList.add(current);
                }
            }
        }

        // Set current class on item-wrapper, if not set.
        if (
            this.options.itemWrapper &&
            this.el.querySelectorAll(`.${current}`).length > 0 &&
            this.el.querySelectorAll(`${this.options.itemWrapper}.${current}`).length ===
                0
        ) {
            this.el
                .querySelector(`a.${current}`)
                .closest(this.options.itemWrapper)
                ?.classList.add(current);
        }

        this._updatenavpath();
    },

    _updatenavpath() {
        const in_path = this.options.inPathClass;
        if (!in_path) {
            return;
        }
        this.el.querySelectorAll(`.${in_path}`).forEach((it) => {
            it.classList.remove(in_path);
        });
        this.el
            .querySelectorAll(
                `${this.options.itemWrapper}:not(.${this.options.currentClass})`
            )
            .forEach((it) => {
                if (it.querySelector(`.${this.options.currentClass}`)) {
                    it.classList.add(in_path);
                }
            });
    },

    _match(curpath, path) {
        if (!path) {
            log.debug("path empty");
            return false;
        }
        // current path needs to end in the anchor's path
        if (path !== curpath.slice(-path.length)) {
            log.debug(`Current path ${curpath} does not end in ${path}`);
            return false;
        }
        // XXX: we might need more exclusion tests
        return true;
    },

    _pathfromurl(url) {
        const path = url.split("#")[0].split("://");
        if (path.length > 2) {
            log.error("weird url", url);
            return "";
        }
        if (path.length === 1) return path[0];
        return path[1].split("/").slice(1).join("/");
    },
});
