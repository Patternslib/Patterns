import registry from "./registry";
import $ from "jquery";
import Base from "./base";
import _ from "underscore";

describe("pat-base: The Base class for patterns", function() {
    var patterns = registry.patterns;

    beforeEach(function () {
        registry.clear();
    });

    afterEach(function () {
        registry.patterns = patterns;
    });

    it("can be extended and used in similar way as classes", function() {
        var Tmp = Base.extend({
            name: "example",
            trigger: "pat-example",
            some: "thing",
            init: function() {
                expect(this.$el.hasClass("pat-example")).toEqual(true);
                expect(_.includes(_.keys(this.options), "option")).toBeTruthy();
                this.extra();
            },
            extra: function() {
                expect(this.some).toEqual("thing");
            }
        });
        var tmp = new Tmp($("<div class=\"pat-example\"/>"), {option: "value"});
        expect(tmp instanceof Tmp).toBeTruthy();
    });

    it("will automatically register a pattern in the registry when extended", function() {
        spyOn(registry, "register").and.callThrough();
        var NewPattern = Base.extend({
            name: "example",
            trigger: ".pat-example"
        });
        expect(NewPattern.prototype.trigger).toEqual(".pat-example");
        expect(NewPattern.prototype.name).toEqual("example");
        expect(registry.register).toHaveBeenCalled();
        expect(Object.keys(registry.patterns).length).toEqual(1);
        expect(_.includes(_.keys(registry.patterns), "example")).toBeTruthy();
    });

    it("will not automatically register a pattern without a \"name\" attribute", function() {
        spyOn(registry, "register").and.callThrough();
        var NewPattern = Base.extend({trigger: ".pat-example"});
        expect(NewPattern.prototype.trigger).toEqual(".pat-example");
        expect(registry.register).not.toHaveBeenCalled();
    });

    it("will not automatically register a pattern without a \"trigger\" attribute", function() {
        spyOn(registry, "register").and.callThrough();
        var NewPattern = Base.extend({name: "example"});
        expect(registry.register).not.toHaveBeenCalled();
        expect(NewPattern.prototype.name).toEqual("example");
    });

    it("will instantiate new instances of a pattern when the DOM is scanned", function() {
        var NewPattern = Base.extend({
            name: "example",
            trigger: ".pat-example",
            init: function() {
                expect(this.$el.attr("class")).toEqual("pat-example");
            }
        });
        spyOn(NewPattern, "init").and.callThrough();
        registry.scan($("<div class=\"pat-example\"/>"));
        expect(NewPattern.init).toHaveBeenCalled();
    });

    it("requires that patterns that extend it provide an object of properties", function() {
        expect(Base.extend)
            .toThrowError(
                "Pattern configuration properties required when calling Base.extend"
            );
    });

    it("can be extended multiple times", function() {
        var Tmp1 = Base.extend({
            name: "thing",
            trigger: "pat-thing",
            something: "else",
            init: function() {
                expect(this.some).toEqual("thing3");
                expect(this.something).toEqual("else");
            }
        });
        var Tmp2 = Tmp1.extend({
            name: "thing",
            trigger: "pat-thing",
            some: "thing2",
            init: function() {
                expect(this.some).toEqual("thing3");
                expect(this.something).toEqual("else");
                this.constructor.__super__.constructor.__super__.init.call(this);
            }
        });
        var Tmp3 = Tmp2.extend({
            name: "thing",
            trigger: "pat-thing",
            some: "thing3",
            init: function() {
                expect(this.some).toEqual("thing3");
                expect(this.something).toEqual("else");
                this.constructor.__super__.init.call(this);
            }
        });
        new Tmp3($("<div>"), {option: "value"});
    });

    it("has on/emit helpers to prefix events", function() {
        var Tmp = Base.extend({
            name: "tmp",
            trigger: ".pat-tmp",
            init: function() {
                this.on("something", function(e, arg1) {
                    expect(arg1).toEqual("yaay!");
                });
                this.emit("somethingelse", ["yaay!"]);
            }
        });
        new Tmp(
            $("<div/>").on("somethingelse.tmp.patterns", function(e, arg1) {
                $(this).trigger("something.tmp.patterns", [arg1]);
            })
        );
    });
});
