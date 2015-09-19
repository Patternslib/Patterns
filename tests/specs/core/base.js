define(["pat-registry", "pat-base", "underscore"], function(registry, Base, _) {

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

        it("will override default values if options are passed in", function() {
            var Tmp = Base.extend({
                name: 'example',
                trigger: 'pat-example',
                some: 'thing',
                defaults: {
                    'val1': 'default',
                    'val2': 'default',
                    'val3': {
                        'child1': 'default',
                        'child2': 'default',
                        'child3': ['1', '2', '3'],
                        'child4': ['1', '2', '3']
                    },
                    'val4': ['a', 'b', 'c'],
                    'val5': ['a', 'b', 'c'],
                    'val6': 'a',
                    'val7': ['a'],
                    'val8': null,
                    'val9': null,
                    'val10': null,
                    'val11': null,
                    'val12': 'a'
                },
                init: function() {
                    expect(this.$el.hasClass('pat-example')).toEqual(true);
                    this.extra();
                },
                extra: function() {
                    expect(Object.keys(this.options).length).toEqual(13);
                    expect(this.options.val1).toEqual('value');
                    expect(this.options.val2).toEqual('default');
                    expect(Object.keys(this.options.val3).length).toEqual(5);
                    expect(this.options.val3.child1).toEqual('value');
                    expect(this.options.val3.child2).toEqual('default');
                    expect(this.options.val3.child3).toEqual(['4']);
                    expect(this.options.val3.child4).toEqual(['1', '2', '3']);
                    expect(Object.keys(this.options.val3.child5).length).toEqual(1);
                    expect(this.options.val3.child5.sub1).toEqual('a');
                    expect(this.options.val4).toEqual(['d']);
                    expect(this.options.val5).toEqual(['a', 'b', 'c']);
                    expect(this.options.val6).toEqual(['b', 'c']);
                    expect(this.options.val7).toEqual('b');
                    expect(this.options.val8).toEqual('e');
                    expect(this.options.val9).toEqual(['f']);
                    expect(Object.keys(this.options.val10).length).toEqual(1);
                    expect(this.options.val10.child1).toEqual('value');
                    expect(this.options.val11).toBe(null);
                    expect(this.options.val12).toBe(null);
                    expect(this.options.val13).toBe(null);
                }
            });
            new Tmp(
                $('<div class="pat-example"/>'),
                  {'val1': 'value',
                   'val3': {'child1': 'value', 'child3':['4'], 'child5':{'sub1': 'a'}},
                   'val4': ['d'],
                   'val6': ['b', 'c'],
                   'val7': 'b',
                   'val8': 'e',
                   'val9': ['f'],
                   'val10': {'child1': 'value'},
                   'val12': null,
                   'val13': null
                  }
                );
        });

        it("will automatically register a pattern in the registry when extended", function() {
            spyOn(registry, "register").andCallThrough();
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
            spyOn(registry, "register").andCallThrough();
            var NewPattern = Base.extend({trigger: ".pat-example"});
            expect(NewPattern.prototype.trigger).toEqual(".pat-example");
            expect(registry.register).not.toHaveBeenCalled();
        });

        it("will not automatically register a pattern without a \"trigger\" attribute", function() {
            spyOn(registry, "register").andCallThrough();
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
            spyOn(NewPattern, "init").andCallThrough();
            registry.scan($("<div class=\"pat-example\"/>"));
            expect(NewPattern.init).toHaveBeenCalled();
        });

        it("requires that patterns that extend it provide an object of properties", function() {
            expect(Base.extend)
                .toThrow(
                    new Error("Pattern configuration properties required when calling Base.extend")
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
});

