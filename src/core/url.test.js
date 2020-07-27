import url from "./url";

describe("Core / url / UrlArgumentParser", function() {
    describe("_decodeQS", function() {
        it("Basic string", function() {
            var parser=new url.UrlArgumentParser();
            expect(parser._decodeQS("Foo")).toBe("Foo");
        });

        it("String with whitespace", function() {
            var parser=new url.UrlArgumentParser();
            expect(parser._decodeQS("Aap+Noot+Mies")).toBe("Aap Noot Mies");
        });

        it("String with encoded characters", function() {
            var parser=new url.UrlArgumentParser();
            expect(parser._decodeQS("Jip%26Janneke")).toBe("Jip&Janneke");
        });
    });

    describe("_parse", function() {
        it("No query string", function() {
            var parser=new url.UrlArgumentParser();
            expect(parser._parse("")).toEqual({});
        });

        it("No parameter specified", function() {
            var parser=new url.UrlArgumentParser();
            expect(parser._parse("?")).toEqual({});
        });

        it("Parameter without value", function() {
            var parser=new url.UrlArgumentParser();
            expect(parser._parse("?key")).toEqual({key: [null]});
        });

        it("Parameter with empty value", function() {
            var parser=new url.UrlArgumentParser();
            expect(parser._parse("?key=")).toEqual({key: [""]});
        });

        it("Parameter with plain value", function() {
            var parser=new url.UrlArgumentParser();
            expect(parser._parse("?key=value")).toEqual({key: ["value"]});
        });

        it("Multiple parameters", function() {
            var parser=new url.UrlArgumentParser();
            expect(parser._parse("?one=en&two=to")).toEqual({one: ["en"], "two": ["to"]});
        });

        it("Parameter with multiple values", function() {
            var parser=new url.UrlArgumentParser();
            expect(parser._parse("?key=value&key=other")).toEqual({key: ["value", "other"]});
        });
    });
});

describe("Core / url / parameters", function() {
    it("Bound to working parser", function() {
        expect(url.parameters()).not.toBe(undefined);
    });
});
