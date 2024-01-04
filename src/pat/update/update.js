import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import events from "@patternslib/patternslib/src/core/events";
import Parser from "@patternslib/patternslib/src/core/parser";
import registry from "@patternslib/patternslib/src/core/registry";

export const parser = new Parser("update");
parser.addArgument("trigger", "pat-update");
parser.addArgument("patterns", null);

class Pattern extends BasePattern {
    static name = "update";
    static trigger = ".pat-update";
    static parser = parser;

    init() {
        // NOTE: Listens only to native JavaScript events, not to jQuery events.
        events.add_event_listener(
            this.el,
            this.options.trigger,
            "pat-update--listener",
            () => {
                registry.scan(
                    this.el,
                    // If there are any patterns defined, pass them here
                    this.options?.patterns.split(",").map((it) => it.trim())
                );
            }
        );
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };
