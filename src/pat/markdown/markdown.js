import $ from "jquery";
import logging from "../../core/logging";
import utils from "../../core/utils";
import Base from "../../core/base";
import inject from "../inject/inject";

const log = logging.getLogger("pat.markdown");
const is_markdown_resource = /\.md$/;

const Markdown = Base.extend({
    name: "markdown",
    trigger: ".pat-markdown",

    async init() {
        if (this.$el.is(this.trigger)) {
            /* This pattern can either be used standalone or as an enhancement
             * to pat-inject. The following only applies to standalone, when
             * $el is explicitly configured with the pat-markdown trigger.
             */
            const source = this.$el.is(":input")
                ? this.$el.val()
                : this.$el[0].innerHTML;
            let rendered = await this.render(source);
            this.el.innerHTML = "";
            this.el.append(...rendered[0].childNodes);
        }
    },

    async render(text) {
        const marked = (await import("marked")).marked;
        const DOMPurify = (await import("dompurify")).default;
        await import("../syntax-highlight/syntax-highlight").default;

        const wrapper = document.createElement("div");
        const parsed = DOMPurify.sanitize(marked.parse(text));
        wrapper.innerHTML = parsed;
        return $(wrapper);
    },

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
    },

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
    },
});

$(document).ready(function () {
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

inject.registerTypeHandler("markdown", {
    async sources(cfgs, data) {
        return await Promise.all(
            cfgs.map(async function (cfg) {
                const pat = new Markdown(cfg.$target[0]);
                const rendered = await pat.renderForInjection(cfg, data);
                return rendered;
            })
        );
    },
});

export default Markdown;
