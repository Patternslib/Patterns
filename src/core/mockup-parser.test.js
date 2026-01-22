import mockupParser from "./mockup-parser";

describe("The mockup-parser", function () {
    it("parses the data attribute of a single node", function () {
        const el = document.createElement("div");
        el.setAttribute("data-pat-testpattern", "option1: value1; option2: value2");

        const options = mockupParser.getOptions(el, "testpattern");

        expect(options.option1).toBe("value1");
        expect(options.option2).toBe("value2");
    });

    it("parses the data attribute of nested nodes", function () {
        const el = document.createElement("div");
        el.setAttribute(
            "data-pat-testpattern",
            "parentOption1: value1; parentOption2: value2"
        );
        const el2 = document.createElement("span");
        el2.setAttribute(
            "data-pat-testpattern",
            "option1: subvalue1; option2: subvalue2"
        );
        el.appendChild(el2);

        const options = mockupParser.getOptions(el2, "testpattern");

        expect(options.parentOption1).toBe("value1");
        expect(options.parentOption2).toBe("value2");
        expect(options.option1).toBe("subvalue1");
        expect(options.option2).toBe("subvalue2");
    });

    it("parses the data attribute of a single node and preserves injected options", function () {
        const el = document.createElement("div");
        el.setAttribute("data-pat-testpattern", "option1: value1; option2: value2");

        const options = mockupParser.getOptions(el, "testpattern", {
            injectedOption: "injectedValue",
        });

        expect(options.option1).toBe("value1");
        expect(options.option2).toBe("value2");
        expect(options.injectedOption).toBe("injectedValue");
    });
});
