import { BasePattern } from "../../core/basepattern";
import dom from "../../core/dom";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import registry from "../../core/registry";
import utils from "../../core/utils";

const log = logging.getLogger("scroll-marker");
//logging.setLevel(logging.Level.DEBUG);

export const parser = new Parser("scroll-marker");
parser.addArgument("in-view-class", "in-view");
parser.addArgument("current-class", "current");
parser.addArgument("current-content-class", "scroll-marker-current");

parser.addArgument("side", "top", ["top", "bottom", "middle", "auto"]);
parser.addArgument("distance", "50%");
parser.addArgument("visibility", null, [null, "none", "most-visible"]);
parser.addArgument("selector", "a[href^='#']");

class Pattern extends BasePattern {
    static name = "scroll-marker";
    static trigger = ".pat-scroll-marker";
    static parser = parser;

    parser_group_options = false;

    // Used to disable automatically setting the current class when it's set
    // differently, e.g. by clicking in a pat-navigation menu.
    set_current_disabled = false;

    init() {
        // Get all elements that are referenced by links in the current page.
        this.observables = new Map(
            [...dom.querySelectorAllAndMe(this.el, this.options.selector)]
                .map(
                    // Create the structure:
                    // id: {link, target}
                    // to create the resulting Map holding all necessary information.
                    (it) => [
                        it.hash.split("#")[1],
                        {
                            link: it,
                            target: document.querySelector(dom.escape_css_id(it.hash)),
                        },
                    ]
                )
                .filter(
                    // Filter again for any missing targets.
                    (it) => it[1].target
                )
        );

        // Find a possible scroll container based on the first target/content
        // element in the observables map.
        // Note, a Map's values method returns an iterator.
        const first_observable = this.observables.values().next();
        if (!first_observable.value) {
            // No targets found.
            return;
        }
        this.scroll_container = dom.find_scroll_container(
            first_observable.value.target,
            "y",
            window
        );
        // window.innerHeight or el.clientHeight
        const scroll_container_height =
            typeof this.scroll_container.innerHeight !== "undefined"
                ? this.scroll_container.innerHeight
                : this.scroll_container.clientHeight;
        this.scroll_marker_distance = utils.parseLength(
            this.options.distance,
            scroll_container_height
        );

        log.debug("scroll_container: ", this.scroll_container);
        log.debug("scroll_container_height: ", scroll_container_height);
        log.debug("distance: ", this.options.distance);
        log.debug("distance parsed: ", this.scroll_marker_distance);
        log.debug("side: ", this.options.side);
        log.debug("visibility: ", this.options.visibility);

        this.debounced_scroll_marker_current_callback = utils.debounce(
            this.scroll_marker_current_callback.bind(this),
            200,
            { timer: null },
            false
        );

        // For debugging.
        this.callback_cnt = 0;

        const observer = new IntersectionObserver(
            this.scroll_marker_callback.bind(this),
            {
                root: this.scroll_container === window ? null : this.scroll_container,
                threshold: utils.threshold_list(10),
            }
        );
        for (const it of this.observables.values()) {
            observer.observe(it.target);
        }
    }

    scroll_marker_callback(entries) {
        log.debug("cnt: ", this.callback_cnt++);
        log.debug("entries: ", entries);

        for (const entry of entries) {
            // Set the in-view class on the link.
            const id = entry.target.getAttribute("id");
            const item = this.observables.get(id);
            if (!item) {
                continue;
            }

            if (entry.isIntersecting) {
                item.link.classList.add(this.options["in-view-class"]);
            } else {
                item.link.classList.remove(this.options["in-view-class"]);
            }
        }

        // Return if the scroll marker is disabled.
        // E.g. when navigation item was clicked.
        if (this.set_current_disabled) {
            return;
        }

        this.debounced_scroll_marker_current_callback();
    }

    scroll_marker_current_callback() {
        // Set the item which is nearest to the scroll container's middle to current.

        // First, set all to non-current.
        for (const item of this.observables.values()) {
            item.link.classList.remove(this.options["current-class"]);
            item.target.classList.remove(this.options["current-content-class"]);
        }

        // Sort by distance to the middle of the scroll container.
        let items_by_weight = [...this.observables.values()].map((it) => it.target);
        log.debug("items_by_weight initial: ", items_by_weight);

        if (this.options.visibility === "most-visible") {
            // Create a map with all ratios.
            const ratio_map = new Map(
                items_by_weight.map((it) => [
                    it,
                    dom.get_visible_ratio(it, this.scroll_container),
                ])
            );

            log.debug("ratio_map: ", ratio_map);

            // Sort items by ratio of visible area.
            items_by_weight.sort((a, b) => {
                const ratio_a = ratio_map.get(a);
                const ratio_b = ratio_map.get(b);
                if (ratio_a > ratio_b) {
                    return -1;
                }
                if (ratio_a < ratio_b) {
                    return 1;
                }
                return 0;
            });

            log.debug("items_by_weight per ratio: ", items_by_weight);

            // Filter all items which have a ratio smaller than the first item.
            const ratio_0 = ratio_map.get(items_by_weight[0]);
            items_by_weight = items_by_weight.filter(
                (it) => ratio_map.get(it) >= ratio_0
            );

            log.debug("items_by_weight filtered: ", items_by_weight);
            log.debug("ratio item 0: ", ratio_0);
        }
        // Always sort by distance.
        items_by_weight.sort((a, b) => {
            let distance_a;
            let distance_b;

            const a_rect = a.getBoundingClientRect();
            const b_rect = b.getBoundingClientRect();
            const scroll_marker_distance = this.scroll_marker_distance;

            switch (this.options.side) {
                case "top":
                    distance_a = Math.abs(a_rect.top - scroll_marker_distance);
                    distance_b = Math.abs(b_rect.top - scroll_marker_distance);
                    break;
                case "bottom":
                    distance_a = Math.abs(a_rect.bottom - scroll_marker_distance);
                    distance_b = Math.abs(b_rect.bottom - scroll_marker_distance);
                    break;
                case "middle":
                    distance_a = Math.abs(
                        (a_rect.top - a_rect.bottom) / 2 - scroll_marker_distance
                    );
                    distance_b = Math.abs(
                        (b_rect.top - b_rect.bottom) / 2 - scroll_marker_distance
                    );
                    break;
                default:
                    distance_a = Math.min(
                        Math.abs(a_rect.top - scroll_marker_distance),
                        Math.abs(a_rect.bottom - scroll_marker_distance)
                    );
                    distance_b = Math.min(
                        Math.abs(b_rect.top - scroll_marker_distance),
                        Math.abs(b_rect.bottom - scroll_marker_distance)
                    );
            }

            if (distance_a < distance_b) {
                return -1;
            }
            if (distance_a > distance_b) {
                return 1;
            }
            return 0;
        });

        log.debug("items_by_weight per distance: ", items_by_weight);

        // Finally, set the nearest to current.
        const nearest = items_by_weight[0];
        const nearest_link = this.observables.get(nearest?.getAttribute("id"))?.link;
        log.debug("nearest: ", nearest);
        log.debug("nearest_link: ", nearest_link);
        if (nearest_link) {
            nearest_link.classList.add(this.options["current-class"]);
            nearest.classList.add(this.options["current-content-class"]);
        }
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };
