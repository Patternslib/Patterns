import $ from "jquery";
import { BasePattern } from "../../core/basepattern";
import dom from "../../core/dom";
import events from "../../core/events";
import logging from "../../core/logging";
import registry from "../../core/registry";
import utils from "../../core/utils";

const log = logging.getLogger("pat.markdown");
const is_markdown_resource = /\.md$/;

class Pattern extends BasePattern {
    static name = "markdown";
    static trigger = ".pat-markdown";

    async init() {
        if (this.el.matches(this.trigger)) {
            /* This pattern can either be used standalone or as an enhancement
             * to pat-inject. The following only applies to standalone, when
             * the element is explicitly configured with the pat-markdown
             * trigger.
             */
            const source = dom.is_input(this.el) ? this.el.value : this.el.innerHTML;
            const rendered = await this.render(source);
            this.el.replaceWith(...rendered);
        }
    }

    async render(text) {
        const marked = (await import("marked")).marked;
        const DOMPurify = (await import("dompurify")).default;

        const wrapper = document.createElement("div");
        const parsed = DOMPurify.sanitize(marked.parse(text));
        wrapper.innerHTML = parsed;

        // If pat-syntax-highlight is available, highlight code blocks.
        const SyntaxHighlight = registry.patterns["syntax-highlight"];
        if (SyntaxHighlight) {
            for (const item of wrapper.querySelectorAll("pre > code")) {
                const pre = item.parentElement;
                pre.classList.add("pat-syntax-highlight");
                // If the code block language was set in a fenced code block,
                // marked has already set the language as a class on the code tag.
                // pat-syntax-highlight will understand this.
                new SyntaxHighlight(pre);
                await events.await_event(pre, "init.syntax-highlight.patterns");
            }
        }

        return $(wrapper);
    }

    async renderForInjection(cfg, data) {
        let header;
        let source = data;
        if (cfg.source && (header = /^#+\s*(.*)/.exec(cfg.source)) !== null) {
            source = this.extractSection(source, header[1]);
            if (source === null) {
                log.warn('Could not find section "' + cfg.source + '" in ' + cfg.url);
                return $("<div/>").attr("data-src", cfg.url);
            }
            source += "\n"; // Needed for some markdown syntax
        }
        const rendered = await this.render(source);
        return rendered.attr("data-src", cfg.source ? cfg.url + cfg.source : cfg.url);
    }

    extractSection(text, header) {
        let pattern;
        header = utils.escapeRegExp(header);
        let matcher = new RegExp(
            "^((#+)\\s*@TEXT@\\s*|@TEXT@\\s*\\n([=-])+\\s*)$".replace(/@TEXT@/g, header),
            "m"
        );
        let match = matcher.exec(text);
        if (match === null) {
            return null;
        } else if (match[2]) {
            // We have a ##-style header.
            const level = match[2].length;
            pattern =
                "^#{@LEVEL@}\\s*@TEXT@\\s*$\\n+((?:.|\\n)*?(?=^#{1,@LEVEL@}\\s)|.*(?:.|\\n)*)";
            pattern = pattern.replace(/@LEVEL@/g, level);
        } else if (match[3]) {
            // We have an underscore-style header.
            if (match[3] === "=")
                pattern =
                    "^@TEXT@\\s*\\n=+\\s*\\n+((?:.|\\n)*?(?=^.*?\\n=+\\s*$)|(?:.|\\n)*)";
            else
                pattern =
                    "^@TEXT@\\s*\\n-+\\s*\\n+((?:.|\\n)*?(?=^.*?\\n[-=]+\\s*$)|(?:.|\\n)*)";
        } else {
            log.error("Unexpected section match result", match);
            return null;
        }
        pattern = pattern.replace(/@TEXT@/g, header);
        matcher = new RegExp(pattern, "m");
        match = matcher.exec(text);
        if (match === null) {
            log.error("Failed to find section with known present header?");
        }
        return match !== null ? match[0] : null;
    }
}

dom.document_ready(() => {
    $(document.body).on(
        "patterns-inject-triggered.pat-markdown",
        "a.pat-inject",
        function identifyMarkdownURLs() {
            /* Identify injected URLs which point to markdown files and set their
             * datatype so that we can register a type handler for them.
             */
            const cfgs = $(this).data("pat-inject");
            cfgs.forEach(function (cfg) {
                if (is_markdown_resource.test(cfg.url)) {
                    cfg.dataType = "markdown";
                }
            });
        }
    );
});

async function register_external_handlers() {
    await utils.timeout(1);

    const inject = registry.patterns.inject;
    if (inject) {
        inject.registerTypeHandler("markdown", {
            async sources(cfgs, data) {
                return await Promise.all(
                    cfgs.map(async function (cfg) {
                        const pat = new Pattern(cfg.$target[0]);
                        const rendered = await pat.renderForInjection(cfg, data);
                        return rendered;
                    })
                );
            },
        });
    }
}
register_external_handlers();

registry.register(Pattern);
export default Pattern;
export { Pattern };
