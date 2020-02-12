define([import registry from "../../core/registry"; "pat-autosubmit"], function(registry, pattern) {
    describe("pat-autosubmit", function() {
        beforeEach(function() {
            $("<div/>", { id: "lab" }).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("Triggering of the pattern", function() {
            it("happens when a form has the pat-autosubmit class", function() {
                var $form = $(
                    '<form class="pat-autosubmit">' +
                        "  <fieldset>" +
                        '   <input type="text" name="q" placeholder="Search query"/>' +
                        '   <label><input type="checkbox" name="local"/> Only search in this section</label>' +
                        " </fieldset>" +
                        "</form>"
                );
                var spy_init = spyOn(pattern, "init");
                registry.scan($form);
                expect(spy_init).toHaveBeenCalled();
            });

            it("when a grouping of inputs has the pat-autosubmit class", function() {
                var $form = $(
                    "<form>" +
                        '  <fieldset class="pat-autosubmit">' +
                        '   <input type="text" name="q" placeholder="Search query"/>' +
                        '   <label><input type="checkbox" name="local"/> Only search in this section</label>' +
                        " </fieldset>" +
                        "</form>"
                );
                var spy_init = spyOn(pattern, "init");
                registry.scan($form);
                expect(spy_init).toHaveBeenCalled();
            });

            it("when a single input has the pat-autosubmit class", function() {
                var $form = $(
                    '<form><input class="pat-autosubmit" type="text" name="q" placeholder="Search query"/></form>'
                );
                var spy_init = spyOn(pattern, "init");
                registry.scan($form);
                expect(spy_init).toHaveBeenCalled();
            });
        });

        describe("parsing of the delay option", function() {
            it("can be done in shorthand notation", function() {
                pattern.$el = $("<form></form>");
                var pat = pattern.init(pattern.$el);
                var options = pat.parser.parse(
                    $("<input data-pat-autosubmit='500ms'/>")
                );
                expect(options.delay).toBe(500);
                options = pat.parser.parse(
                    $("<input data-pat-autosubmit='500ms'/>")
                );
                expect(options.delay).toBe(500);
                options = pat.parser.parse(
                    $("<input data-pat-autosubmit='defocus'/>")
                );
                expect(options.delay).toBe("defocus");
            });

            it("can be done in longhand notation", function() {
                pattern.$el = $("<form></form>");
                var pat = pattern.init(pattern.$el);
                var options = pat.parser.parse(
                    $(
                        "<input class=\"pat-autosubmit\" data-pat-autosubmit='delay: 500ms'/>"
                    )
                );
                expect(options.delay).toBe(500);
                options = pat.parser.parse(
                    $(
                        "<input class=\"pat-autosubmit\" data-pat-autosubmit='delay: 500ms'/>"
                    )
                );
                expect(options.delay).toBe(500);
                options = pat.parser.parse(
                    $(
                        "<input class=\"pat-autosubmit\" data-pat-autosubmit='defocus'/>"
                    )
                );
                expect(options.delay).toBe("defocus");
            });
        });
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
