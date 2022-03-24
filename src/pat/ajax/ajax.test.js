import registry from "../../core/registry";
import pattern from "./ajax";
import $ from "jquery";
import { jest } from "@jest/globals";

var $lab;

describe("pat-ajax", function () {
    describe("anchor", function () {
        beforeEach(function () {
            $lab = $("<div/>", { id: "lab" }).appendTo(document.body);
        });

        afterEach(function () {
            document.body.innerHTML = "";
            jest.restoreAllMocks();
        });

        it("triggers ajax request on click", function () {
            var $a = $("<a href='href.html' />").appendTo($lab);
            pattern.init($a);
            jest.spyOn($, "ajax");
            $a.click();
            var ajaxargs = $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
            expect(ajaxargs.context[0]).toBe($a[0]);
            expect(ajaxargs.url).toBe("href.html");
        });
    });

    //
    // ATTENTION: These might fail on IE8 due to different code
    // path in jquery.form that does not use $.ajax
    //
    describe("form", function () {
        var $form, $button, spy_ajax;

        beforeEach(function () {
            $lab = $("<div/>", { id: "lab" }).appendTo(document.body);
            $form = $("<form action='action.html'></form>").appendTo($lab);
            $button = $(
                "<button type='submit' name='submit' value='submit' />"
            ).appendTo($form);
            $("<input name='input1' value='value1' />").appendTo($form);
            pattern.init($form);
            spy_ajax = jest.spyOn($, "ajax");
        });

        afterEach(function () {
            document.body.innerHTML = "";
            jest.restoreAllMocks();
        });

        it("triggers ajax request on submit", function () {
            $form.submit();
            expect(spy_ajax).toHaveBeenCalled();
        });

        it("honors method='post'", function () {
            $form.attr("method", "post");
            $form.submit();
            var ajaxargs = $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
            expect(ajaxargs.url).toEqual("action.html");
            expect(ajaxargs.method).toEqual("POST");
            expect(ajaxargs.data.get("input1")).toContain("value1");
        });

        it("triggers ajax request on click submit", function () {
            $button.click();
            expect(spy_ajax).toHaveBeenCalled();
        });

        it("does include submit button clicked", function () {
            $button.click();
            var ajaxargs = $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
            expect(ajaxargs.url).toEqual("action.html");
            expect(ajaxargs.data).toEqual("input1=value1&submit=submit");
        });

        it("does not include submit buttons if not clicked", function () {
            $form.submit();
            var ajaxargs = $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
            expect(ajaxargs.url).toEqual("action.html");
            expect(ajaxargs.data).toEqual("input1=value1");
        });
    });

    describe("Arguments can be set", function () {
        afterEach(function () {
            document.body.innerHTML = "";
            jest.restoreAllMocks();
        });

        // URL
        it("Gets URL from anchor-href", function () {
            document.body.innerHTML = `<a class="pat-ajax" href="somewhere.html"/>`;
            registry.scan(document.body);
            jest.spyOn($, "ajax");
            document.body.querySelector(".pat-ajax").click();
            const ajaxargs = $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
            expect(ajaxargs.url).toEqual("somewhere.html");
        });
        it("Gets URL from form-action", function () {
            document.body.innerHTML = `<form class="pat-ajax" action="somewhere.html"/>`;
            registry.scan(document.body);
            jest.spyOn($, "ajax");
            $(".pat-ajax").submit();
            const ajaxargs = $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
            expect(ajaxargs.url).toEqual("somewhere.html");
        });
        it("Can explicitly set URL on anchor", function () {
            document.body.innerHTML = `
              <a
                  class="pat-ajax"
                  href="somewhere.html"
                  data-pat-ajax="url: else.html"
              />
            `;
            registry.scan(document.body);
            jest.spyOn($, "ajax");
            document.body.querySelector(".pat-ajax").click();
            const ajaxargs = $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
            expect(ajaxargs.url).toEqual("else.html");
        });
        it("Can explicitly set URL on form", function () {
            document.body.innerHTML = `
              <form
                  class="pat-ajax"
                  action="somewhere.html"
                  data-pat-ajax="url: else.html"
              />
            `;
            registry.scan(document.body);
            jest.spyOn($, "ajax");
            $(".pat-ajax").submit();
            const ajaxargs = $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
            expect(ajaxargs.url).toEqual("else.html");
        });

        // Accept
        it("Default accept header", function () {
            document.body.innerHTML = `<a class="pat-ajax" />`;
            registry.scan(document.body);
            jest.spyOn($, "ajax");
            document.body.querySelector(".pat-ajax").click();
            const ajaxargs = $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
            expect(ajaxargs.headers).toEqual({ Accept: "text/html" });
        });
        it("Can set accept header", function () {
            document.body.innerHTML = `<a class="pat-ajax" data-pat-ajax="accept: */*"/>`;
            registry.scan(document.body);
            jest.spyOn($, "ajax");
            document.body.querySelector(".pat-ajax").click();
            const ajaxargs = $.ajax.mock.calls[$.ajax.mock.calls.length - 1][0];
            expect(ajaxargs.headers).toEqual({ Accept: "*/*" });
        });
    });

    describe("caching", () => {
        afterEach(function () {
            document.body.innerHTML = "";
        });

        it("does not cache by default", function () {
            const spy_ajax = jest.spyOn($, "ajax");
            document.body.innerHTML = `<a
                class="pat-ajax"
                />`;
            registry.scan(document.body);
            document.body.querySelector(".pat-ajax").click();
            const ajaxargs = spy_ajax.mock.calls[spy_ajax.mock.calls.length - 1][0];
            expect(ajaxargs.cache).toBe(false);
            spy_ajax.mockRestore();
        });

        it("does not cache when explicitly set", function () {
            const spy_ajax = jest.spyOn($, "ajax");
            document.body.innerHTML = `<a
                class="pat-ajax"
                data-pat-ajax="browser-cache: no-cache"
                />`;
            registry.scan(document.body);
            document.body.querySelector(".pat-ajax").click();
            const ajaxargs = spy_ajax.mock.calls[spy_ajax.mock.calls.length - 1][0];
            expect(ajaxargs.cache).toBe(false);
            spy_ajax.mockRestore();
        });

        it("does cache when explicitly set", function () {
            const spy_ajax = jest.spyOn($, "ajax");
            document.body.innerHTML = `<a
                class="pat-ajax"
                data-pat-ajax="browser-cache: cache"
                />`;
            registry.scan(document.body);
            document.body.querySelector(".pat-ajax").click();
            const ajaxargs = spy_ajax.mock.calls[spy_ajax.mock.calls.length - 1][0];
            expect(ajaxargs.cache).toBe(true);
            spy_ajax.mockRestore();
        });

        it("does not cache on POST forms, regardless of the setting", function () {
            const spy_ajax = jest.spyOn($, "ajax");
            document.body.innerHTML = `<form
                class="pat-ajax"
                method="POST"
                data-pat-ajax="browser-cache: cache"
                />`;
            registry.scan(document.body);
            $(".pat-ajax").submit(); // need jquery submit here
            const ajaxargs = spy_ajax.mock.calls[spy_ajax.mock.calls.length - 1][0];
            expect(ajaxargs.cache).toBe(false);
            spy_ajax.mockRestore();
        });
    });
});
