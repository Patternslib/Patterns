define(["pat-registry", "pat-subform"], function(registry, pattern) {
    describe("pat-subform", function() {
        beforeEach(function() {
            jasmine.clock().install();
        });

        afterEach(function() {
            jasmine.clock().uninstall();
        });

        describe("Triggering of the pattern", function() {
            it("happens when a fieldset has the pat-subform class", function() {
                var $form = $(
                    "<form>" +
                        '  <fieldset class="pat-subform">' +
                        '    <input type="text" name="q" placeholder="Search query"/>' +
                        "  </fieldset>" +
                        "</form>"
                );
                var spy_init = spyOn(pattern, "init");
                registry.scan($form);
                expect(spy_init).toHaveBeenCalled();
            });
        });

        describe("Entering a return", function() {
            it("does nothing if the pat-autosubmit class is missing", function() {
                var $form = $(
                    "<form>" +
                        '  <fieldset class="pat-subform">' +
                        '    <input type="text" name="q" placeholder="Search query"/>' +
                        "  </fieldset>" +
                        "</form>"
                );
                var spy_keyboard_handler = spyOn(
                    pattern,
                    "keyboard_handler"
                ).and.callThrough();
                var spy_submit = spyOn(pattern, "submit");
                registry.scan($form);
                $form.find("[name=q]").trigger({
                    type: "keydown",
                    keyCode: 13
                });
                jasmine.clock().tick(2000);
                expect(spy_keyboard_handler).toHaveBeenCalled();
                expect(spy_submit).not.toHaveBeenCalled();
            });
            it("submits the subform when the pat-autosubmit class is present", function() {
                var $form = $(
                    "<form>" +
                        '  <fieldset class="pat-subform pat-autosubmit">' +
                        '    <input type="text" name="q" placeholder="Search query"/>' +
                        "  </fieldset>" +
                        "</form>"
                );
                var spy_keyboard_handler = spyOn(
                    pattern,
                    "keyboard_handler"
                ).and.callThrough();
                var spy_submit = spyOn(pattern, "submit");
                registry.scan($form);
                $form.find("[name=q]").trigger({
                    type: "keydown",
                    keyCode: 13
                });
                jasmine.clock().tick(2000);
                expect(spy_keyboard_handler).toHaveBeenCalled();
                expect(spy_submit).toHaveBeenCalled();
            });
            it("does not submit the parent autosubmit form when the pat-autosubmit class is present on both", function() {
                var $form = $(
                    '<form class="pat-autosubmit">' +
                        '  <fieldset class="pat-subform pat-autosubmit">' +
                        '    <input type="text" name="q" placeholder="Search query"/>' +
                        "  </fieldset>" +
                        '  <button type="submit" name="submit">Submit</button>' +
                        "</form>"
                );
                var spy_keyboard_handler = spyOn(
                    pattern,
                    "keyboard_handler"
                ).and.callThrough();
                var spy_submit = spyOn(pattern, "submit");
                var spy_formsubmit = spyOn($form, "submit");
                registry.scan($form);
                $form.find("[name=q]").trigger({
                    type: "keydown",
                    keyCode: 13
                });
                jasmine.clock().tick(2000);
                expect(spy_keyboard_handler).toHaveBeenCalled();
                expect(spy_submit).toHaveBeenCalled();
                expect(spy_formsubmit).not.toHaveBeenCalled();
            });
        });
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
