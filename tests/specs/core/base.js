define(["pat-registry", "pat-base"], function(registry, Base) {

    describe("The Base class for patterns", function() {

        it("can be extended and used in similar way as classes", function(done) {
            var Tmp = Base.extend({
                name: "example",
                trigger: "pat-example",
                some: "thing",
                init: function() {
                    expect(this.$el.hasClass("pat-example")).to.equal(true);
                    expect(this.options).to.have.keys(["option"]);
                    this.extra();
                },
                extra: function() {
                    expect(this.some).to.equal("thing");
                    done();
                }
            });
            var tmp = new Tmp($("<div class=\"pat-example\"/>"), {option: "value"});
            expect(tmp instanceof Tmp).toBeTruthy();
        });

        it("will automatically register a pattern in the registry when extended", function() {
            spyOn(registry, "register").andCallThrough();
            var NewPattern = Base.extend({
                name: "example",
                trigger: ".pat-example"
            });
            expect(NewPattern.trigger).toEqual(".pat-example");
            expect(NewPattern.name).toEqual("example");
            expect(registry.register).toHaveBeenCalled();
            expect(Object.keys(registry.patterns).length).to.be.equal(1);
            expect(Object.keys(registry.patterns)[0]).to.be.equal("example");
        });

        it("will not automatically register a pattern without a \"name\" attribute", function() {
            spyOn(registry, "register").andCallThrough();
            var NewPattern = Base.extend({trigger: ".pat-example"});
            expect(NewPattern.trigger).toEqual(".pat-example");
            expect(registry.register).not.toHaveBeenCalled();
        });

        it("will not automatically register a pattern without a \"trigger\" attribute", function() {
            spyOn(registry, "register").andCallThrough();
            var NewPattern = Base.extend({name: "example"});
            expect(registry.register).not.toHaveBeenCalled();
            expect(NewPattern.name).toEqual("example");
        });

        it("will instantiate new instances of a pattern when the DOM is scanned", function() {
            var NewPattern = Base.extend({
                name: "example",
                trigger: ".pat-example",
                init: function() {}
            });
            spyOn(NewPattern, "init");
            registry.scan($("<div class=\"pat-example\"/>"));
            expect(NewPattern).toHaveBeenCalled();
            // Test this somehow
            // debugger;
            // expect(this.$el.attr("class")).to.be.equal("pat-example");
        });

        it("requires that patterns that extend it provide an object of properties", function() {
            expect(Base.extend.bind(Base, {}))
                .toThrow(
                    new Error("Pattern configuration properties required when calling Base.extend")
                );
        });

        xit("can be extended multiple times", function(done) {
            var Tmp1 = Base.extend({
                name: "thing",
                trigger: "pat-thing",
                something: "else",
                init: function() {
                    expect(this.some).to.equal("thing3");
                    expect(this.something).to.equal("else");
                done();
                }
            });
            var Tmp2 = Tmp1.extend({
                name: "thing",
                trigger: "pat-thing",
                some: "thing2",
                init: function() {
                    expect(this.some).to.equal("thing3");
                    expect(this.something).to.equal("else");
                    this.constructor.__super__.constructor.__super__.init.call(this);
                }
            });
            var Tmp3 = Tmp2.extend({
                name: "thing",
                trigger: "pat-thing",
                some: "thing3",
                init: function() {
                    expect(this.some).to.equal("thing3");
                    expect(this.something).to.equal("else");
                    this.constructor.__super__.init.call(this);
                }
            });
            var tmp3 = new Tmp3("element", {option: "value"});
            alert(tmp3.val());
        });

        xit("has on/emit helpers to prefix events", function(done) {
            var Tmp = Base.extend({
                name: "tmp",
                trigger: ".pat-tmp",
                init: function() {
                    this.on("something", function(e, arg1) {
                        expect(arg1).to.be("yaay!");
                        done();
                    });
                    this.emit("somethingelse", ["yaay!"]);
                }
            });
            var tmp = new Tmp(
                $("<div/>").on("somethingelse.tmp.patterns", function(e, arg1) {
                $(this).trigger("something.tmp.patterns", [arg1]);
                done();
                })
            );
            alert(tmp.val());
        });
    });
});

