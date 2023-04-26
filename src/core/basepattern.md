# BasePattern base pattern class.

A Base pattern for creating scoped patterns.

Each instance of a pattern has its own local scope.
A new instance is created for each DOM element on which a pattern applies.

## Pattern initialization order

The order of patterns in the patterns registry can be modified using the order
property. Lower values will sort and initialize those patterns earlier than
others with higher numbers. The default is 1000 - if you don't have any special
needs, just leave out the `order` property from your Pattern class.
**pat-validation** needs to be initialized early before other patterns can handle
`submit` events - it has a sort order of 100.
**pat-clone-code** needs to copy the Pattern markup before it is eventually
modified - it has a sort order of 200.

## Usage:

Also see: https://github.com/Patternslib/pat-PATTERN_TEMPLATE

```javascript
import { BasePattern } from "@patternslib/patternslib/src/core/basepattern";
import Parser from "@patternslib/patternslib/src/core/parser";
import registry from "@patternslib/patternslib/src/core/registry";

export const parser = new Parser("test-pattern");
parser.addArgument("example-option", "Stranger");

class Pattern extends BasePattern {
    static name = "test-pattern";
    static trigger = ".pat-test-pattern";
    static parser = parser;
    static order = 1000; // Optional. Leave out for the default value of 1000.

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
```
