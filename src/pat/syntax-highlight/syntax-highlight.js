import { BasePattern } from "../../core/basepattern";
import Parser from "../../core/parser";
import registry from "../../core/registry";
import utils from "../../core/utils";

export const parser = new Parser("syntax-highlight");
parser.addArgument("language", "html");
parser.addArgument("theme", "dark", ["dark", "light"]);
parser.addArgument("features", null, ["line-highlight", "line-numbers"], true);

class Pattern extends BasePattern {
    static name = "syntax-highlight";
    static trigger = ".pat-syntax-highlight";
    static parser = parser;

    async init() {
        let _el = this.el;
        const code_el = [...this.el.children].filter((it) => it.tagName === "CODE")?.[0];
        if (code_el) {
            _el = code_el;
        }

        let theme;
        if (
            this.options.theme === "light" ||
            _el.classList.contains("light-bg") ||
            this.el.classList.contains("light-bg")
        ) {
            theme = "stackoverflow-light";
        } else if (this.options.theme === "dark") {
            theme = "stackoverflow-dark";
        } else {
            theme = this.options.theme;
        }

        import(`highlight.js/styles/${theme}.css`);
        const hljs = (await import("highlight.js")).default;

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
        _el.classList.add("hljs");

        let high;
        const value = utils.unescape_html(_el.innerHTML).trim();
        if (language) {
            try {
                // language to import path mapping
                const import_path_mapping = {
                    atom: "xml",
                    html: "xml",
                    plist: "xml",
                    rss: "xml",
                    svg: "xml",
                    wsf: "xml",
                    xhtml: "xml",
                    xjb: "xml",
                    xsd: "xml",
                    xsl: "xml",
                };
                const lang_file = import_path_mapping[language] || language;
                const hljs_language = (
                    await import(`highlight.js/lib/languages/${lang_file}`)
                ).default;
                hljs.registerLanguage("javascript", hljs_language);
                high = hljs.highlight(value, { language: language }).value;
            } catch {
                high = hljs.highlightAuto(value).value;
            }
        } else {
            high = hljs.highlightAuto(value).value;
        }
        _el.innerHTML = high;
    }
}

registry.register(Pattern);
export default Pattern;
export { Pattern };
