import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import events from "@patternslib/patternslib/src/core/events";
import Parser from "@patternslib/patternslib/src/core/parser";
import registry from "@patternslib/patternslib/src/core/registry";

export const parser = new Parser("update");
parser.addArgument("event", "pat-update");
parser.addArgument("action", "scan", ["scan", "reload"]);
parser.addArgument("selector", null);
parser.addArgument("reload-url", null);
parser.addArgument("reload-url-append", null);
parser.addArgument("scan-patterns", null);

class Pattern extends BasePattern {
    static name = "update";
    static trigger = ".pat-update";
    static parser = parser;

    parser_group_options = false;

    init() {
        let targets = [this.el];
        if (this.options.selector) {
            targets = document.querySelectorAll(this.options.selector);
        }

        let listener = this.el;

        // Navigate needs to listen on window.navigation.
        // NOTE: We have a polyfill for window.navigation.
        if (this.options.event === "navigate") {
            listener = window.navigation;
        }

        // NOTE: Listens only to native JavaScript events, not to jQuery events.
        events.add_event_listener(
            listener,
            this.options.event,
            "pat-update--listener",
            async () => {
                for (const el of targets) {
                    let url;
                    if (this.options.action === "reload") {
                        if (this.options.event === "navigate") {
                            url = window.location.href;
                        } else {
                            // Get the URL, if possible.
                            url =
                                this.options["reload-url"] ||
                                el.getAttribute("href") ||
                                el.getAttribute("src") ||
                                document.body.dataset?.baseUrl;
                        }

                        // Append to URL if defined.
                        if (url && this.options["reload-url-append"]) {
                            url = url.split("@@")[0]; // Use URL without any `@@` view.
                            url = `${url}/${this.options["reload-url-append"]}`;
                        }
                    }
                    if (url) {
                        const response = await fetch(url);
                        const html = await response.text();
                        el.innerHTML = html;
                    }

                    // Always scan.
                    registry.scan(
                        el,
                        // If there are any patterns defined, pass them here
                        this.options["scan-patterns"]?.split(",").map((it) => it.trim())
                    );
                }
            }
        );
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };
