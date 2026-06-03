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

    it("parses JSON data attribute of a single node", function () {
        const el = document.createElement("div");
        el.setAttribute(
            "data-pat-testpattern",
            '{"option1": "value1", "option2": "value2"}'
        );

        const options = mockupParser.getOptions(el, "testpattern");

        expect(options.option1).toBe("value1");
        expect(options.option2).toBe("value2");
    });

    it("parses JSON data attributes and interprets native types", function () {
        const el = document.createElement("div");
        el.setAttribute(
            "data-pat-testpattern",
            `{
                "option1": "value1",
                "option2": true,
                "option3": false,
                "option4": 0,
                "option5": 1,
                "option6": 1000,
                "option7": 0.001
             }`
        );

        const options = mockupParser.getOptions(el, "testpattern");

        expect(options.option1).toBe("value1");
        expect(options.option2).toBe(true);
        expect(options.option3).toBe(false);
        expect(options.option4).toBe(0);
        expect(options.option5).toBe(1);
        expect(options.option6).toBe(1000);
        expect(options.option7).toBe(0.001);
    });

    it("parses JSON and breaks if invalid", function () {
        const el = document.createElement("div");
        el.setAttribute(
            "data-pat-testpattern",
            `{
                "option1": "value1",
             }`
        );

        const options = mockupParser.getOptions(el, "testpattern");

        // Invalid JSON strings will result in "undefined"
        expect(options.option1).toBe(undefined);
    });
});
