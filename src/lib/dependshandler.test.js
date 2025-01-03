import $ from "jquery";
import DependsHandler from "./dependshandler";

describe("pat-dependshandler", function () {
    describe("Basic tests", function () {
        it("uses a form as context, if there is one.", function () {
            document.body.innerHTML = `
                <form>
                    <input id="lab" />
                </form>
            `;

            lab = document.getElementById("lab");
            const handler = new DependsHandler(lab, "dummy_expression");

            expect(handler.context).toBe(document.querySelector("form"));
        });

        it("uses the document as context, if there is no form", function () {
            document.body.innerHTML = `
                <div>
                    <input id="lab" />
                </div>
            `;

            lab = document.getElementById("lab");
            const handler = new DependsHandler(lab, "dummy_expression");

            expect(handler.context).toBe(document);
        });
    });

    describe("_find_input", function () {
        it("no input, nothing found", function () {
            document.body.innerHTML = `
                <div id="lab"></div>
            `;
            const lab = document.getElementById("lab");
            const handler = new DependsHandler(lab, "dummy_expression");
            expect(handler._find_input("foo")).toBe(null);
        });

        it("find input by name", function () {
            document.body.innerHTML = `
                <div id="lab">
                    <input name="foo"/>
                </div>
            `;
            const lab = document.getElementById("lab");
            const foo = document.querySelector("[name=foo]");
            const handler = new DependsHandler(lab, "dummy_expression");
            expect(handler._find_input("foo")).toBe(foo);
        });

        it("find input by id", function () {
            document.body.innerHTML = `
                <div id="lab">
                    <input id="bar"/>
                </div>
            `;
            const lab = document.getElementById("lab");
            const bar = document.getElementById("bar");
            const handler = new DependsHandler(lab, "dummy_expression");

            expect(handler._find_input("bar")).toBe(bar);
        });

        it("Restrict searches to current form", function () {
            document.body.innerHTML = `
                <input id="foo0" name="foo"/>
                <form>
                    <div id="lab"></div>
                    <input id="foo1" name="foo"/>
                </form>
            `;
            const lab = document.getElementById("lab");
            const foo1 = document.getElementById("foo1");
            const handler = new DependsHandler(lab, "dummy_expression");

            expect(handler._find_input("foo")).toBe(foo1);
        });
    });

    describe("_getValue", function () {
        it("Unchecked checkbox returns no value", function () {
            document.body.innerHTML = `
                <div id="lab">
                    <input type="checkbox" name="foo" value="bar"/>
                </div>
            `;
            const lab = document.getElementById("lab");
            const handler = new DependsHandler(lab, "dummy_expression");

            expect(handler._getValue("foo")).toBeNull();
        });

        it("Checked checkbox returns value", function () {
            document.body.innerHTML = `
                <div id="lab">
                    <input type="checkbox" name="foo" value="bar" checked/>
                </div>
            `;
            const lab = document.getElementById("lab");
            const handler = new DependsHandler(lab, "dummy_expression");

            expect(handler._getValue("foo")).toBe("bar");
        });

        it("Unchecked radio button returns no value", function () {
            document.body.innerHTML = `
                <div id="lab">
                    <input type="radio" name="foo" value="bar"/>
                </div>
            `;
            const lab = document.getElementById("lab");
            const handler = new DependsHandler(lab, "dummy_expression");

            expect(handler._getValue("foo")).toBeNull();
        });

        it("Checked radio button", function () {
            document.body.innerHTML = `
                <div id="lab">
                    <input type="radio" name="foo" value="bar" checked/>
                </div>
            `;
            const lab = document.getElementById("lab");
            const handler = new DependsHandler(lab, "dummy_expression");

            expect(handler._getValue("foo")).toBe("bar");
        });
    });

    describe("getAllInputs", function () {
        it("Simple expression", function () {
            document.body.innerHTML = `
                <div id="lab">
                    <input name="foo"/>
                    <input name="bar"/>
                </div>
            `;
            const lab = document.getElementById("lab");
            const handler = new DependsHandler(lab, "foo");
            const inputs = handler.getAllInputs();

            expect(inputs.length).toBe(1);
            expect(inputs[0].name).toBe("foo");
        });

        it("Nested expression", function () {
            document.body.innerHTML = `
                <div id="lab">
                    <input name="foo"/>
                    <input name="bar"/>
                    <input name="buz"/>
                </div>
            `;
            const lab = document.getElementById("lab");
            const handler = new DependsHandler(lab, "foo or (foo and buz)");
            const inputs = handler.getAllInputs();

            expect(inputs.length).toBe(2);
            expect(inputs[0].name).toBe("foo");
            expect(inputs[1].name).toBe("buz");
        });
    });

    describe("evaluate", function () {
        describe("truthy", function () {
            it("Text input with value", function () {
                document.body.innerHTML = `
                    <div id="lab">
                        <input name="foo" value="xyz"/>
                    </div>
                `;
                const lab = document.getElementById("lab");
                const handler = new DependsHandler(lab, "foo");

                expect(handler.evaluate()).toBe(true);
            });

            it("Text input without value", function () {
                document.body.innerHTML = `
                    <div id="lab">
                        <input name="foo"/>
                    </div>
                `;
                const lab = document.getElementById("lab");
                const handler = new DependsHandler(lab, "foo");

                expect(handler.evaluate()).toBe(false);
            });
        });

        describe("Number comparisons", function () {
            it("Number below expression value", function () {
                document.body.innerHTML = `
                    <div id="lab">
                        <input type="number" name="foo" value="10"/>
                    </div>
                `;
                const lab = document.getElementById("lab");
                const handler = new DependsHandler(lab, "foo<15");

                expect(handler.evaluate()).toBe(true);
            });

            it("Number above expression value", function () {
                document.body.innerHTML = `
                    <div id="lab">
                        <input type="number" name="foo" value="20"/>
                    </div>
                `;
                const lab = document.getElementById("lab");
                const handler = new DependsHandler(lab, "foo<15");

                expect(handler.evaluate()).toBe(false);
            });

            it("Negative number below expression value", function () {
                document.body.innerHTML = `
                    <div id="lab">
                        <input type="number" name="foo" value="-10"/>
                    </div>
                `;
                const lab = document.getElementById("lab");
                const handler = new DependsHandler(lab, "foo<15");

                expect(handler.evaluate()).toBe(true);
            });

            describe.skip("Negative expression values not yet supported.", function () {
                it("Negative number above negative expression value", function () {
                    document.body.innerHTML = `
                        <div id="lab">
                            <input type="number" name="foo" value="-10"/>
                        </div>
                    `;
                    const lab = document.getElementById("lab");
                    const handler = new DependsHandler(lab, "foo<-15");

                    expect(handler.evaluate()).toBe(false);
                });
            });

            it("Number equal to expression value", function () {
                document.body.innerHTML = `
                    <div id="lab">
                        <input type="number" name="foo" value="15"/>
                    </div>
                `;
                const lab = document.getElementById("lab");
                const handler = new DependsHandler(lab, "foo<=15");

                expect(handler.evaluate()).toBe(true);
            });

            it("Text equal to expression value", function () {
                document.body.innerHTML = `
                    <div id="lab">
                        <input name="foo" value="buz"/>
                    </div>
                `;
                const lab = document.getElementById("lab");
                const handler = new DependsHandler(lab, "foo=buz");

                expect(handler.evaluate()).toBe(true);
            });

            it("Text not equal to expression value", function () {
                document.body.innerHTML = `
                    <div id="lab">
                        <input name="foo" value="bar"/>
                    </div>
                `;
                const lab = document.getElementById("lab");
                const handler = new DependsHandler(lab, "foo=buz");

                expect(handler.evaluate()).toBe(false);
            });
        });

        describe("NOT expressions", function () {
            it("Text input with value where expressions expects no value", function () {
                document.body.innerHTML = `
                    <div id="lab">
                        <input name="foo" value="xyz"/>
                    </div>
                `;
                const lab = document.getElementById("lab");
                const handler = new DependsHandler(lab, "not foo");

                expect(handler.evaluate()).toBe(false);
            });

            it("Text input without value where expression expects no value", function () {
                document.body.innerHTML = `
                    <div id="lab">
                        <input name="foo"/>
                    </div>
                `;
                const lab = document.getElementById("lab");
                const handler = new DependsHandler(lab, "not foo");

                expect(handler.evaluate()).toBe(true);
            });
        });

        describe("AND expressions", function () {
            it("All options true", function () {
                document.body.innerHTML = `
                    <div id="lab">
                        <input name="one" value="1"/>
                        <input name="two" value="2"/>
                    </div>
                `;
                const lab = document.getElementById("lab");
                const handler = new DependsHandler(lab, "one and two");

                expect(handler.evaluate()).toBe(true);
            });

            it("Not all options true", function () {
                document.body.innerHTML = `
                    <div id="lab">
                        <input name="one" value="1"/>
                        <input name="two"/>
                    </div>
                `;
                const lab = document.getElementById("lab");
                const handler = new DependsHandler(lab, "one and two");

                expect(handler.evaluate()).toBe(false);
            });
        });

        describe("OR expressions", function () {
            it("No options true", function () {
                document.body.innerHTML = `
                    <div id="lab">
                        <input name="one"/>
                        <input name="two"/>
                    </div>
                `;
                const lab = document.getElementById("lab");
                const handler = new DependsHandler(lab, "one or two");

                expect(handler.evaluate()).toBe(false);
            });

            it("One option true", function () {
                document.body.innerHTML = `
                    <div id="lab">
                        <input name="one" value="1"/>
                        <input name="two"/>
                    </div>
                `;
                const lab = document.getElementById("lab");
                const handler = new DependsHandler(lab, "one or two");

                expect(handler.evaluate()).toBe(true);
            });
        });
    });
});
