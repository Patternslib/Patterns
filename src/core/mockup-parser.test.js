import $ from "jquery";
import mockupParser from "./mockup-parser";

describe("The mockup-parser", function () {
    it("parses the data attribute of a single node", function () {
        const $el = $(`
            <span data-pat-testpattern="option1: value1; option2: value2">
                mockup parser test
            </span>`);
        const options = mockupParser.getOptions($el, "testpattern");
        expect(options.option1).toBe("value1");
        expect(options.option2).toBe("value2");
    });
    it("parses the data attribute of nested nodes", function () {
        const $el = $(`
            <div data-pat-testpattern="parentOption1: value1; parentOption2: value2">
                <span data-pat-testpattern="option1: subvalue1; option2: subvalue2">
                    nested mockup parser test
                </span>
            </div>`);
        const options = mockupParser.getOptions($el, "testpattern");
        expect(options.parentOption1).toBe("value1");
        expect(options.parentOption2).toBe("value2");
        expect(options.option1).toBe(undefined);
        expect(options.option2).toBe(undefined);
    });
    it("parses the data attribute of a single node and preserves injected options", function () {
        const $el = $(`
            <span data-pat-testpattern="option1: value1; option2: value2">
                mockup parser test
            </span>
        `);
        const options = mockupParser.getOptions($el, "testpattern", {
            injectedOption: "injectedValue",
        });
        expect(options.option1).toBe("value1");
        expect(options.option2).toBe("value2");
        expect(options.injectedOption).toBe("injectedValue");
    });
});
