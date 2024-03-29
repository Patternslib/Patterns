import registry from "../../core/registry";
import $ from "jquery";
import pattern from "./subform";
import { jest } from "@jest/globals";

describe("subform base tests", function () {
    describe("Triggering of the pattern", function () {
        it("happens when a fieldset has the pat-subform class", function () {
            var $form = $(
                '<form onsubmit="return false;">' +
                    '  <fieldset class="pat-subform">' +
                    '    <input type="text" name="q" placeholder="Search query"/>' +
                    "  </fieldset>" +
                    "</form>"
            );
            var spy_init = jest.spyOn(pattern, "init");
            registry.scan($form);
            expect(spy_init).toHaveBeenCalled();
        });
    });

    describe("Entering a return", function () {
        it("does nothing if the pat-autosubmit class is missing", function () {
            var $form = $(
                '<form onsubmit="return false;">' +
                    '  <fieldset class="pat-subform">' +
                    '    <input type="text" name="q" placeholder="Search query"/>' +
                    "  </fieldset>" +
                    "</form>"
            );
            const pat = new pattern($(".pat-subform", $form));
            const spy_keyboard_handler = jest.spyOn(pat.__proto__, "keyboard_handler");
            const spy_submit = jest.spyOn(pat.__proto__, "submit");
            registry.scan($form);
            $form.find("[name=q]").trigger({
                type: "keydown",
                keyCode: 13,
            });
            expect(spy_keyboard_handler).toHaveBeenCalled();
            expect(spy_submit).not.toHaveBeenCalled();
        });
        it("submits the subform when the pat-autosubmit class is present", function () {
            var $form = $(
                '<form onsubmit="return false;">' +
                    '  <fieldset class="pat-subform pat-autosubmit">' +
                    '    <input type="text" name="q" placeholder="Search query"/>' +
                    "  </fieldset>" +
                    "</form>"
            );
            const pat = new pattern($(".pat-subform", $form));
            const spy_keyboard_handler = jest.spyOn(pat.__proto__, "keyboard_handler");
            const spy_submit = jest.spyOn(pat.__proto__, "submit");
            registry.scan($form);
            $form.find("[name=q]").trigger({
                type: "keydown",
                keyCode: 13,
            });
            expect(spy_keyboard_handler).toHaveBeenCalled();
            expect(spy_submit).toHaveBeenCalled();
        });
        it("does not submit the parent autosubmit form when the pat-autosubmit class is present on both", function () {
            var $form = $(
                '<form class="pat-autosubmit" onsubmit="return false;">' +
                    '  <fieldset class="pat-subform pat-autosubmit">' +
                    '    <input type="text" name="q" placeholder="Search query"/>' +
                    "  </fieldset>" +
                    '  <button type="submit" name="submit">Submit</button>' +
                    "</form>"
            );
            const pat = new pattern($(".pat-subform", $form));
            const spy_keyboard_handler = jest.spyOn(pat.__proto__, "keyboard_handler");
            const spy_submit = jest.spyOn(pat.__proto__, "submit");
            const spy_formsubmit = jest.spyOn($form, "submit");
            registry.scan($form);
            $form.find("[name=q]").trigger({
                type: "keydown",
                keyCode: 13,
            });
            expect(spy_keyboard_handler).toHaveBeenCalled();
            expect(spy_submit).toHaveBeenCalled();
            expect(spy_formsubmit).not.toHaveBeenCalled();
        });
    });
});
