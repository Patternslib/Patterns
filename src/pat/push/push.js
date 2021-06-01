import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "../../core/base";
import logging from "../../core/logging";
import Parser from "../../core/parser";

const logger = logging.getLogger("push");

export const parser = new Parser("push");
parser.addArgument("url", null);
parser.addArgument("push-id", null);

export default Base.extend({
    name: "push",
    trigger: ".pat-push",

    init() {
        this.options = parser.parse(this.el, this.options);
        document.body.addEventListener("push", (e) => {
            logger.debug("received push marker");
            const data = e?.detail?.body;
            if (data === this.options.pushId) {
                if (this.el.tagName === "FORM") {
                    this.el.submit();
                } else {
                    this.perform_inject();
                }
            }
        });
    },

    async perform_inject() {
        try {
            const response = await fetch(this.options.url);
            const data = await response.text();
            this.el.innerHTML = data;
        } catch (e) {
            logger.error(
                `Could not fetch from ${this.options.url} on push-id ${this.options.pushId}.`
            );
        }
    },
});
