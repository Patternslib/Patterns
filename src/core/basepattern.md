# BasePattern base pattern class.

A Base pattern for creating scoped patterns.

Each instance of a pattern has its own local scope.
A new instance is created for each DOM element on which a pattern applies.


## Usage:

Also see: https://github.com/Patternslib/pat-PATTERN_TEMPLATE


    import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
    import Parser from "@patternslib/patternslib/src/core/parser";
    import registry from "@patternslib/patternslib/src/core/registry";

    export const parser = new Parser("test-pattern");
    parser.addArgument("example-option", "Stranger");

    class Pattern extends BasePattern {
        static name = "test-pattern";
        static trigger = ".pat-test-pattern";
        static parser = parser;

        async init() {
            import("./test-pattern.scss");

            // Try to avoid jQuery, but here is how to import it.
            // eslint-disable-next-line no-unused-vars
            const $ = (await import("jquery")).default;

            // The options are automatically created, if parser is defined.
            const example_option = this.options.exampleOption;
            this.el.innerHTML = `
                <p>hello, ${example_option}, this is pattern ${this.name} speaking.</p>
            `;
        }
    }

    // Register Pattern class in the global pattern registry
    registry.register(Pattern);

    // Make it available
    export default Pattern;

