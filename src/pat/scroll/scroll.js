import { BasePattern } from "../../core/basepattern";
import dom from "../../core/dom";
import events from "../../core/events";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import registry from "../../core/registry";
import utils from "../../core/utils";

const log = logging.getLogger("scroll");
//logging.setLevel(logging.Level.DEBUG);

export const parser = new Parser("scroll");
parser.addArgument("trigger", "click", ["click", "auto", "manual"]);
parser.addArgument("direction", "top", ["top", "left"]);
parser.addArgument("selector");
parser.addArgument("offset", 0);
parser.addArgument("delay");

class Pattern extends BasePattern {
    static name = "scroll";
    static trigger = ".pat-scroll";
    static parser = parser;

    parser_group_options = false;

    async init() {
        if (this.options.delay) {
            this.options.delay = utils.parseTime(this.options.delay);
        }
        if (this.options.trigger === "auto") {
            const ImagesLoaded = (await import("imagesloaded")).default;
            // Only calculate the offset when all images are loaded
            ImagesLoaded(document.body, this.scrollTo.bind(this));
        }
        if (this.options.trigger === "auto" || this.options.trigger === "click") {
            this.el.addEventListener("click", this.scrollTo.bind(this));
        }
    }

    get_target() {
        const selector = this.options.selector;
        if (!selector && this.el.href?.includes("#")) {
            return document.querySelector(`#${this.el.href.split("#").pop()}`);
        } else if (!selector || ["self", "top", "bottom"].includes(selector)) {
            return this.el;
        }
        return document.querySelector(selector);
    }

    async scrollTo() {
        if (this.options.delay) {
            await utils.timeout(this.options.delay);
        }

        const target = this.get_target() || document.body;
        const scroll_container =
            target === document.body
                ? document.body
                : dom.find_scroll_container(
                      target.parentElement,
                      this.options.direction === "top" ? "y" : "x",
                      window
                  );

        // Set/remove classes on beginning and end of scroll
        this.el.classList.add("pat-scroll-animated");
        const debounced_scroll_end = utils.debounce(() => {
            this.el.classList.remove("pat-scroll-animated");
            events.remove_event_listener(this.el, "pat-scroll__scroll_end");
            log.debug("scroll_end");
        }, 100);
        events.add_event_listener(
            scroll_container === window ? document : scroll_container,
            "scroll",
            "pat-scroll__scroll_end",
            debounced_scroll_end.bind(this)
        );
        debounced_scroll_end();

        // now scroll
        if (this.options.selector === "top") {
            dom.scroll_to_top(scroll_container, this.options.offset);
        } else if (this.options.selector === "bottom") {
            dom.scroll_to_bottom(scroll_container, this.options.offset);
        } else {
            dom.scroll_to_element(
                target,
                scroll_container,
                this.options.offset,
                this.options.direction
            );
        }
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };
