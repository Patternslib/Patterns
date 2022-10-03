import Base from "../../core/base";
import Parser from "../../core/parser";

export const parser = new Parser("syntax-highlight");
parser.addArgument("language", "html");
parser.addArgument("theme", "dark", ["dark", "light"]);
parser.addArgument("features", null, ["line-highlight", "line-numbers"], true);

export default Base.extend({
    name: "syntax-highlight",
    trigger: ".pat-syntax-highlight",

    async init() {
        this.options = parser.parse(this.el, this.options);

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
    },
});
