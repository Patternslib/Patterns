import { BasePattern } from "../../core/basepattern";
import Parser from "../../core/parser";
import registry from "../../core/registry";

export const parser = new Parser("syntax-highlight");
parser.addArgument("language", "html");
parser.addArgument("theme", "dark", ["dark", "light"]);
parser.addArgument("features", null, ["line-highlight", "line-numbers"], true);

class Pattern extends BasePattern {
    static name = "syntax-highlight";
    static trigger = ".pat-syntax-highlight";
    parser = parser;

    async init() {
        let theme;
        if (this.options.theme === "light") {
            theme = "";
        } else if (this.options.theme === "dark") {
            theme = "okaidia";
        } else {
            theme = this.options.theme;
        }

        import(`prismjs/themes/prism${theme ? "-" + theme : ""}.css`);
        const Prism = (await import("prismjs")).default;

        if (this.options.features.includes("line-highlight")) {
            import("prismjs/plugins/line-highlight/prism-line-highlight.css");
            await import("prismjs/plugins/line-highlight/prism-line-highlight.js");
        }

        if (this.options.features.includes("line-numbers")) {
            import("prismjs/plugins/line-numbers/prism-line-numbers.css");
            await import("prismjs/plugins/line-numbers/prism-line-numbers.js");
            this.el.classList.add("line-numbers");
        }

        Prism.manual = true;

        let _el = this.el;
        const code_el = [...this.el.children].filter((it) => it.tagName === "CODE")?.[0];
        if (code_el) {
            _el = code_el;
        }

        // Get the language
        let language = [..._el.classList, ...this.el.classList]
            .filter((it) => {
                return it.startsWith("language-") || it.startsWith("lang-");
            })?.[0]
            ?.replace("language-", "")
            ?.replace("lang-", "");
        // CSS class language always win.
        language = language || this.options.language || "html";
        // Set the language on the code element (ignored if already set)
        this.el.classList.add(`language-${language}`);
        _el.classList.add(`language-${language}`);

        Prism.highlightElement(_el);
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };
