import { BasePattern } from "../../core/basepattern";
import code_wrapper_template from "./templates/code-wrapper.html";
import dom from "../../core/dom";
import Parser from "../../core/parser";
import registry from "../../core/registry";
import utils from "../../core/utils";

export const parser = new Parser("clone-code");
parser.addArgument("source", ":first-child");
parser.addArgument("features", null, ["format"]);

class Pattern extends BasePattern {
    static name = "clone-code";
    static trigger = ".pat-clone-code";
    static parser = parser;

    async init() {
        // Source
        if (this.options.source.lastIndexOf(":", 0) === 0) {
            this.source = this.el.querySelector(this.options.source);
        } else {
            this.source = document.querySelector(this.options.source);
        }
        await this.clone();
    }

    async clone() {
        // Clone the template.
        let markup =
            this.source.nodeName === "TEMPLATE"
                ? this.source.innerHTML
                : this.source.outerHTML;

        // Create temporary wrapper.
        let tmp_wrapper;
        if (this.source.nodeName === "HTML") {
            // We have a full HTML document which we cannot wrap into a div.
            tmp_wrapper = new DOMParser().parseFromString(markup, "text/html");
        } else {
            tmp_wrapper = document.createElement("div");
            tmp_wrapper.innerHTML = markup;
        }

        // Remove elements with the class ``clone-ignore``.
        const ignore = tmp_wrapper.querySelectorAll(".clone-ignore");
        for (const _el of ignore) {
            _el.remove();
        }

        // Get back the clone string depending of what the wrapper is.
        markup =
            tmp_wrapper instanceof HTMLDocument
                ? tmp_wrapper.documentElement.outerHTML
                : tmp_wrapper.innerHTML;

        if (this.options.features?.includes("format")) {
            // Format the markup.
            const prettier = (await import("prettier/standalone")).default;
            const parser_html = (await import("prettier/parser-html")).default;
            markup = prettier.format(markup, {
                parser: "html",
                plugins: [parser_html],
            });
        }

        markup = utils.escape_html(markup);
        const pre_code_markup = dom.template(code_wrapper_template, { markup: markup });

        // Now we need to wrap the contents in any case in a div.
        tmp_wrapper = document.createElement("div");
        tmp_wrapper.innerHTML = pre_code_markup;
        const pre_code_el = tmp_wrapper.children[0];

        this.el.appendChild(pre_code_el);
        registry.scan(pre_code_el);
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };
