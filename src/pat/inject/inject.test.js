define(["pat-inject", import utils from "../../core/utils";], function(pattern, utils) {
    describe("pat-inject", function() {
        var deferred;

        var answer = function(html) {
            deferred.resolve(html, "ok", { responseText: html });
        };

        beforeEach(function() {
            deferred = new $.Deferred();
            $("<div/>", { id: "lab" }).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("The next-href argument", function() {
            afterEach(function() {
                $("#lab").empty();
            });

            it("allows you to specify the href to be applied to the clicked element after injection", function() {
                var $a = $(
                    '<a class="pat-inject" data-pat-inject="next-href: http://patternslib.com" href="/src/pat/inject/inject-sources.html#pos-1">link</a>'
                );
                var $div = $('<div id="pos-1" />');
                $("#lab")
                    .append($a)
                    .append($div);
                var dummy_event = {
                    jqxhr: { responseText: "foo" },
                    isPropagationStopped: function() {
                        return true;
                    }
                };
                var cfgs = pattern.extractConfig($a, {});
                pattern.verifyConfig(cfgs, $a);
                pattern._onInjectSuccess($a, cfgs, dummy_event);
                expect(cfgs[0].nextHref).toBe("http://patternslib.com");
                expect($a.attr("href")).toBe("http://patternslib.com");
            });
        });

        describe("The loading-class argument", function() {
            afterEach(function() {
                $("#lab").empty();
            });

            it("has a default value of 'injecting' and gets added to the target while content is still loading'", function() {
                spyOn($, "ajax").and.returnValue(deferred);
                var $a = $(
                    '<a class="pat-inject" href="test.html#someid">link</a>'
                );
                var $div = $('<div id="someid" />');
                $("#lab")
                    .empty()
                    .append($a)
                    .append($div);

                var callback = jasmine.createSpy("patterns-injected");
                $(document).on("patterns-injected", callback);

                pattern.init($a);
                $a.trigger("click");

                var cfgs = pattern.extractConfig($a, {});
                expect(cfgs[0].loadingClass).toBe("injecting");

                expect($div.hasClass("injecting")).toBeTruthy();

                answer(
                    "<html><body>" +
                        '<div id="someid">repl</div>' +
                        "</body></html>"
                );
                expect($div.hasClass("injecting")).toBeFalsy();
                expect(callback).toHaveBeenCalled();
            });

            it("can be set to another string value which then gets added to the target while content is still loading'", function() {
                spyOn($, "ajax").and.returnValue(deferred);
                var $a = $(
                    '<a class="pat-inject" data-pat-inject="loading-class: other-class;" href="test.html#someid">link</a>'
                );
                var $div = $('<div id="someid" />');
                $("#lab")
                    .empty()
                    .append($a)
                    .append($div);

                pattern.init($a);
                $a.trigger("click");

                var cfgs = pattern.extractConfig($a, {});
                expect(cfgs[0].loadingClass).toBe("other-class");

                expect($div.hasClass("other-class")).toBeTruthy();

                answer(
                    "<html><body>" +
                        '<div id="someid">repl</div>' +
                        "</body></html>"
                );
                expect($div.hasClass("other-class")).toBeFalsy();
            });

            it("can be set to an empty string value so that nothing gets added to the target while content is still loading'", function() {
                spyOn($, "ajax");
                var $a = $(
                    '<a class="pat-inject" data-pat-inject="loading-class: ;" href="test.html#someid">link</a>'
                );
                var $div = $('<div id="someid" />');
                $("#lab")
                    .empty()
                    .append($a)
                    .append($div);
                pattern.init($a);
                $a.trigger("click");
                var cfgs = pattern.extractConfig($a, {});
                expect(cfgs[0].loadingClass).toBe("");
                expect($div[0].className).toBe("");
            });
        });

        describe("The confirm argument", function() {
            afterEach(function() {
                $("#lab").empty();
            });

            it("is by default set to 'class', which means it asks for confirmation based on a class on the target", function() {
                var $a = $(
                    '<a class="pat-inject" href="test.html#someid">link</a>'
                );
                var $div = $('<div id="someid" />');
                $("#lab")
                    .empty()
                    .append($a)
                    .append($div);
                spyOn(pattern, "onTrigger").and.callThrough();
                var spy_confirm = spyOn(window, "confirm").and.returnValue(
                    false
                );

                // Test default value for parser argument
                var cfgs = pattern.extractConfig($a, {});
                expect(cfgs[0].confirm).toBe("class");

                // Test that confirm doesn't get called
                pattern.init($a);
                $a.trigger("click");
                expect(spy_confirm).not.toHaveBeenCalled();

                $div.addClass("is-dirty");
                $a.trigger("click");
                expect(spy_confirm).toHaveBeenCalled();
            });

            it("can be set to 'never' to never ask for confirmation", function() {
                var $a = $(
                    '<a class="pat-inject" href="test.html#someid" data-pat-inject="confirm: never">link</a>'
                );
                var $div = $('<div id="someid" />');
                $("#lab")
                    .empty()
                    .append($a)
                    .append($div);
                var spy_onTrigger = spyOn(
                    pattern,
                    "onTrigger"
                ).and.callThrough();
                var spy_confirm = spyOn(window, "confirm").and.returnValue(
                    false
                );

                // Test default value for parser argument
                var cfgs = pattern.extractConfig($a, {});
                expect(cfgs[0].confirm).toBe("never");

                // Test that confirm doesn't get called
                pattern.init($a);
                $a.trigger("click");
                expect(spy_confirm).not.toHaveBeenCalled();
                expect(spy_onTrigger).toHaveBeenCalled();
            });

            it("can be set to 'always' to always ask for confirmation before injecting", function() {
                var $a = $(
                    '<a class="pat-inject" href="test.html#someid" data-pat-inject="confirm: always">link</a>'
                );
                var $div = $('<div id="someid" />');
                $("#lab")
                    .empty()
                    .append($a)
                    .append($div);
                var spy_onTrigger = spyOn(
                    pattern,
                    "onTrigger"
                ).and.callThrough();
                var spy_confirm = spyOn(window, "confirm").and.returnValue(
                    true
                );

                // Test default value for parser argument
                var cfgs = pattern.extractConfig($a, {});
                expect(cfgs[0].confirm).toBe("always");

                // Test that confirm does get called
                pattern.init($a);
                $a.trigger("click");
                expect(spy_onTrigger).toHaveBeenCalled();
                expect(spy_confirm).toHaveBeenCalled();
            });

            it("can be set to 'form-data' to ask for confirmation before injecting over form fields changed by the user", function() {
                var $a = $(
                    '<a class="pat-inject" href="test.html#someid" data-pat-inject="confirm: form-data">link</a>'
                );
                var $div = $(
                    '<form id="someid"><input type="text" name="name"/></form>'
                );
                $("#lab")
                    .empty()
                    .append($a)
                    .append($div);
                var spy_onTrigger = spyOn(
                    pattern,
                    "onTrigger"
                ).and.callThrough();
                var spy_confirm = spyOn(window, "confirm").and.returnValue(
                    true
                );

                // Test default value for parser argument
                var cfgs = pattern.extractConfig($a, {});
                expect(cfgs[0].confirm).toBe("form-data");

                $('[name="name"]').val("hello world");

                // Test that confirm does get called
                pattern.init($a);
                $a.trigger("click");
                expect(spy_confirm).toHaveBeenCalled();

                $('[name="name"]').val("");
                $a.trigger("click");
                expect(window.confirm.calls.count()).toBe(1);
                expect(spy_onTrigger).toHaveBeenCalled();
            });

            describe("The confirm-message argument", function() {
                afterEach(function() {
                    $("#lab").empty();
                });

                it("can be used to provide a custom confirmation prompt message", function() {
                    var $a = $(
                        '<a class="pat-inject" href="test.html#someid" data-pat-inject="confirm: always; confirm-message: Hello world">link</a>'
                    );
                    var $div = $('<div id="someid" />');
                    $("#lab")
                        .empty()
                        .append($a)
                        .append($div);
                    spyOn(pattern, "onTrigger").and.callThrough();
                    var spy_confirm = spyOn(window, "confirm").and.returnValue(
                        false
                    );

                    // Test default value for parser argument
                    var cfgs = pattern.extractConfig($a, {});
                    expect(cfgs[0].confirm).toBe("always");

                    // Test that confirm doesn't get called
                    pattern.init($a);
                    $a.trigger("click");
                    expect(spy_confirm).toHaveBeenCalled();
                    expect(spy_confirm).toHaveBeenCalledWith("Hello world");
                });
            });
        });

        describe("rebaseHTML", function() {
            it("Basic markup with DOCTYPE", function() {
                expect(
                    pattern._rebaseHTML(
                        "base",
                        "<!DOCTYPE html>\n<p>This is a simple <em>test</em></p>"
                    )
                ).toBe("<p>This is a simple <em>test</em></p>");
            });

            it("Basic markup", function() {
                expect(
                    pattern._rebaseHTML(
                        "base",
                        "<p>This is a simple <em>test</em></p>"
                    )
                ).toBe("<p>This is a simple <em>test</em></p>");
            });

            it("Recover from unclosed tags", function() {
                expect(
                    pattern._rebaseHTML(
                        "base",
                        "<p>This is a simple <em>test</p>"
                    )
                ).toBe("<p>This is a simple <em>test</em></p>");
            });

            it("Element without link attribute", function() {
                var spy_rebaseURL = spyOn(utils, "rebaseURL");
                expect(
                    pattern._rebaseHTML("base", "<a>This is a test</a>")
                ).toBe("<a>This is a test</a>");
                expect(spy_rebaseURL).not.toHaveBeenCalled();
            });

            it("Element with link attribute", function() {
                var spy_rebaseURL = spyOn(utils, "rebaseURL").and.returnValue(
                    "REBASED"
                );
                expect(
                    pattern._rebaseHTML(
                        "base",
                        '<a href="example.com">This is a test</a>'
                    )
                ).toBe('<a href="REBASED">This is a test</a>');
                expect(spy_rebaseURL).toHaveBeenCalledWith(
                    "base",
                    "example.com"
                );
            });

            it("Automatically fix casing of attribute", function() {
                spyOn(utils, "rebaseURL").and.returnValue("REBASED");
                expect(
                    pattern._rebaseHTML(
                        "base",
                        '<a HrEf="example.com">This is a test</a>'
                    )
                ).toBe('<a href="REBASED">This is a test</a>');
            });

            it("Check if image is rebased correctly", function() {
                spyOn(utils, "rebaseURL").and.returnValue("REBASED");
                expect(
                    pattern._rebaseHTML("base", '<img src="example.com">')
                ).toBe('<img src="REBASED">');
            });

            it("Leave non attribute occurences of src intact", function() {
                spyOn(utils, "rebaseURL").and.returnValue("REBASED");
                expect(
                    pattern._rebaseHTML(
                        "base",
                        "<p>This string has    src = \"foo\" , src= bar , and SrC='foo'</p>"
                    )
                ).toBe(
                    "<p>This string has    src = \"foo\" , src= bar , and SrC='foo'</p>"
                );
            });
        });

        describe("parseRawHtml", function() {
            it("Roundtrip attributes with double quotes", function() {
                var value =
                        '{"plugins": "paste", "content_css": "/_themes/Style/tiny-body.css"}',
                    input = "<a data-tinymce-json='" + value + "'>Test</a>",
                    $output = pattern._parseRawHtml(input, null);
                expect($output.find("a").attr("data-tinymce-json")).toBe(value);
            });

            it("Roundtrip attributes with single quotes", function() {
                var value =
                        "{'plugins': 'paste', 'content_css': '/_themes/Style/tiny-body.css'}",
                    input = '<a data-tinymce-json="' + value + '">Test</a>',
                    $output = pattern._parseRawHtml(input, null);
                expect($output.find("a").attr("data-tinymce-json")).toBe(value);
            });
        });

        describe("Functional tests", function() {
            describe("extract/verifyConfig", function() {
                var $a, $target;

                beforeEach(function() {
                    $a = $(
                        '<a class="pat-inject" href="test.html#someid">link</a>'
                    );
                    $target = $('<div id="someid">');

                    $("#lab")
                        .append($a)
                        .append($target);
                });
                afterEach(function() {
                    $target.remove();
                });

                it("fall back to href id", function() {
                    var cfgs = pattern.extractConfig($a);
                    expect(pattern.verifyConfig(cfgs)).toBeTruthy();

                    expect(cfgs.length).toBe(1);
                    expect(cfgs[0].source).toBe("#someid");
                    expect(cfgs[0].target).toBe("#someid");
                });

                it("take first positional option as source and target", function() {
                    var cfgs;
                    $a.attr("data-pat-inject", "#otherid");
                    $target.attr("id", "otherid");
                    cfgs = pattern.extractConfig($a);
                    expect(pattern.verifyConfig(cfgs)).toBeTruthy();

                    expect(cfgs[0].source).toBe("#otherid");
                    expect(cfgs[0].target).toBe("#otherid");
                });

                it("take two positional options as source and target resp.", function() {
                    var cfgs;

                    $a.attr("data-pat-inject", "#otherid #yetanotherid");
                    $target.attr("id", "yetanotherid");
                    cfgs = pattern.extractConfig($a);
                    expect(pattern.verifyConfig(cfgs)).toBeTruthy();

                    expect(cfgs[0].source).toBe("#otherid");
                    expect(cfgs[0].target).toBe("#yetanotherid");
                });

                it("Use trigger as target", function() {
                    $a.attr("data-pat-inject", "target: self::after");
                    var cfgs = pattern.extractConfig($a);
                    expect(pattern.verifyConfig(cfgs, $a)).toBeTruthy();
                    expect(cfgs[0].target).toBe("self");
                    expect(cfgs[0].$target[0]).toBe($a[0]);
                });

                it("create target if it doesn't exist", function() {
                    var cfgs = pattern.extractConfig($a);

                    $target.remove();
                    expect(pattern.verifyConfig(cfgs)).toBeTruthy();

                    $target = $("#someid");
                    expect($target.length).toBeGreaterThan(0);
                    expect($target.parent().prop("tagName")).toBe("BODY");
                });

                it("parse autload delay argument", function() {
                    $a.attr(
                        "data-pat-inject",
                        "trigger: autoload; delay: 1000;"
                    );
                    var cfgs = pattern.extractConfig($a);
                    expect(pattern.verifyConfig(cfgs)).toBeTruthy();
                    expect(cfgs[0].trigger).toBe("autoload");
                    expect(cfgs[0].delay).toBe(1000);
                });
            });
        });

        describe("DOM tests", function() {
            beforeEach(function() {});

            describe("The patterns-injected event", function() {
                it("gets triggered after injection has finished'", function() {
                    spyOn($, "ajax").and.returnValue(deferred);
                    var $a = $(
                        '<a class="pat-inject" href="test.html#someid">link</a>'
                    );
                    var $div = $('<div id="someid" />');
                    $("#lab")
                        .empty()
                        .append($a)
                        .append($div);
                    var callback = jasmine.createSpy("patterns-injected");
                    $(document).on("patterns-injected", callback);
                    pattern.init($a);
                    $a.trigger("click");
                    answer(
                        "<html><body>" +
                            '<div id="someid">repl</div>' +
                            "</body></html>"
                    );
                    expect(callback).toHaveBeenCalled();
                });
            });

            describe("Injection on an anchor element", function() {
                var $a, $div;

                beforeEach(function() {
                    spyOn($, "ajax").and.returnValue(deferred);
                    $a = $(
                        '<a class="pat-inject" href="test.html#someid">link</a>'
                    );
                    $div = $('<div id="someid" />');
                    $("#lab")
                        .append($a)
                        .append($div);
                });

                it("fetches url on click", function() {
                    pattern.init($a);
                    $a.trigger("click");
                    expect($.ajax).toHaveBeenCalled();
                    expect($.ajax.calls.mostRecent().args[0].url).toBe(
                        "test.html"
                    );
                });

                it("fetches url on autoload", function() {
                    $a.attr("data-pat-inject", "autoload");
                    pattern.init($a);
                    expect($.ajax).toHaveBeenCalled();
                    expect($.ajax.calls.mostRecent().args[0].url).toBe(
                        "test.html"
                    );
                });

                it("fetches url on autoload-delayed", function() {
                    $a.attr("data-pat-inject", "autoload-delayed");
                    pattern.init($a);
                    // this needs to be checked async - is beyond me
                    // expect($.ajax).toHaveBeenCalled();
                    // expect($.ajax.calls.mostRecent().args[0].url).toBe("test.html");
                });
                it("fetches url on push_marker sent", function() {
                    $a.attr("data-pat-inject", "push-marker: content-updated");
                    pattern.init($a);
                    $("body").trigger("push", ["content-updated"]);
                    expect($.ajax).toHaveBeenCalled();
                    expect($.ajax.calls.mostRecent().args[0].url).toBe(
                        "test.html"
                    );
                });

                it("injects into existing div", function() {
                    pattern.init($a);
                    $a.trigger("click");
                    answer(
                        '<html><body><div id="someid">replacement</div></body></html>'
                    );

                    expect($div.html()).toBe("replacement");
                });

                it("injects multiple times", function() {
                    pattern.init($a);
                    $a.trigger("click");
                    answer(
                        '<html><body><div id="someid">replacement</div></body></html>'
                    );
                    expect($div.html()).toBe("replacement");

                    // Deferred objects are supposed to be resolved only once.
                    // This is a trick to force the second ajax() call to return a new Deferred().
                    // It is only needed here, because this is the only test case that makes two ajax() calls.
                    deferred = new $.Deferred();
                    $.ajax.calls.reset();
                    $.ajax.and.returnValue(
                        (function() {
                            return deferred;
                        })()
                    );

                    $a.trigger("click");
                    answer(
                        '<html><body><div id="someid">new replacement</div></body></html>'
                    );
                    expect($div.html()).toBe("new replacement");
                });

                it("takes multiple source-target pairs", function() {
                    $a.attr(
                        "data-pat-inject",
                        "#someid1 #otherid1 && #someid2 #otherid2"
                    );
                    var $target1 = $('<div id="otherid1" />'),
                        $target2 = $('<div id="otherid2" />');
                    $div.append($target1).append($target2);

                    pattern.init($a);
                    $a.trigger("click");
                    answer(
                        "<html><body>" +
                            '<div id="someid1">repl1</div>' +
                            '<div id="someid2">repl2</div>' +
                            "</body></html>"
                    );

                    expect($target1.html()).toBe("repl1");
                    expect($target2.html()).toBe("repl2");
                });

                it("acts on other selectors as well", function() {
                    $a.attr("data-pat-inject", "target: #someid > .someclass");
                    var $target1 = $('<div class="someclass" />'),
                        $target2 = $('<div class="someclass" />');
                    $div.append($target1).append($target2);

                    pattern.init($a);
                    $a.trigger("click");
                    answer(
                        "<html><body>" +
                            '<div id="someid">repl</div>' +
                            "</body></html>"
                    );

                    expect($target1.html()).toBe("repl");
                    expect($target2.html()).toBe("repl");
                });

                it("copies into target if source has ::element", function() {
                    $a.attr("data-pat-inject", "#otherid::element #someid");

                    pattern.init($a);
                    $a.trigger("click");
                    answer(
                        "<html><body>" +
                            '<div id="otherid" class="someclass">repl</div>' +
                            "</body></html>"
                    );

                    expect($div.children().attr("id")).toBe("otherid");
                    expect($div.children().attr("class")).toBe("someclass");
                });

                it("replaces target if both selectors have ::element", function() {
                    $a.attr(
                        "data-pat-inject",
                        "#someid::element #otherid::element"
                    );
                    $div.append($('<div id="otherid" />'));

                    pattern.init($a);
                    $a.trigger("click");
                    answer(
                        "<html><body>" +
                            '<div id="someid" class="someclass">repl</div>' +
                            "</body></html>"
                    );

                    expect($div.children().attr("id")).toBe("someid");
                    expect($div.children().attr("class")).toBe("someclass");
                });

                it("allows ::before and ::after in target selector", function() {
                    $a.attr(
                        "data-pat-inject",
                        "target: #target1::after && target: #target2::before"
                    );
                    var $target1 = $('<div id="target1">content</div>'),
                        $target2 = $('<div id="target2">content</div>');
                    $div.append($target1).append($target2);

                    pattern.init($a);
                    $a.trigger("click");
                    answer(
                        "<html><body>" +
                            '<div id="someid">repl</div>' +
                            "</body></html>"
                    );

                    expect($target1.html()).toBe("contentrepl");
                    expect($target2.html()).toBe("replcontent");
                });

                it("allows mixing ::element and ::after in target", function() {
                    $a.attr(
                        "data-pat-inject",
                        "target: #otherid::element::after"
                    );
                    $div.append($('<div id="otherid" />'));

                    pattern.init($a);
                    $a.trigger("click");
                    answer(
                        "<html><body>" +
                            '<div id="someid">repl</div>' +
                            "</body></html>"
                    );

                    expect(
                        $div
                            .contents()
                            .last()
                            .text()
                    ).toBe("repl");
                });
            });

            describe("inject on forms", function() {
                var $form, $div;

                beforeEach(function() {
                    spyOn($, "ajax").and.returnValue(deferred);
                    $form = $(
                        '<form class="pat-inject" action="test.html#someid" />'
                    );
                    $div = $('<div id="someid" />');
                    $("#lab")
                        .append($form)
                        .append($div);
                });

                it("trigger injection on submit", function() {
                    pattern.init($form);
                    $form.trigger("submit");
                    answer(
                        "<html><body>" +
                            '<div id="someid">repl</div>' +
                            "</body></html>"
                    );

                    expect($div.html()).toBe("repl");
                });

                it("pass get form parameters in ajax call as data", function() {
                    $form.attr("method", "get");
                    $form.append(
                        $(
                            '<input type="text" name="param" value="somevalue" />'
                        )
                    );

                    pattern.init($form);
                    $form.trigger("submit");

                    var ajaxargs = $.ajax.calls.mostRecent().args[0];
                    expect($.ajax).toHaveBeenCalled();
                    expect(ajaxargs.data).toContain("param=somevalue");
                });

                it("pass post form parameters in ajax call as data", function() {
                    $form.attr("method", "post");
                    $form.append(
                        $(
                            '<input type="text" name="param" value="somevalue" />'
                        )
                    );

                    pattern.init($form);
                    $form.trigger("submit");

                    //var ajaxargs = $.ajax.calls.mostRecent().args[0];
                    expect($.ajax).toHaveBeenCalled();
                    // Commenting this out because phantomjs doesn't support formdata
                    // https://github.com/ariya/phantomjs/issues/14867
                    //expect(ajaxargs.data.get('param')).toContain("somevalue");
                });
                it("pass submit button value in ajax call as data", function() {
                    var $submit = $(
                        '<input type="submit" name="submit" value="label" />'
                    );

                    $form.attr("method", "post");
                    $form.append($submit);

                    pattern.init($form);
                    $submit.trigger("click");

                    //var ajaxargs = $.ajax.calls.mostRecent().args[0];
                    expect($.ajax).toHaveBeenCalled();
                    // Commenting this out because phantomjs doesn't support formdata
                    // https://github.com/ariya/phantomjs/issues/14867
                    //expect(ajaxargs.data.get('submit')).toContain("label");
                });

                describe("formaction attribute on submit buttons", function() {
                    it("use submit button formaction value as action URL", function() {
                        var $submit1 = $(
                                '<input type="submit" name="submit" value="default" />'
                            ),
                            $submit2 = $(
                                '<input type="submit" name="submit" value="special" />'
                            );

                        $submit2.attr("formaction", "other.html");
                        $form.append($submit1).append($submit2);

                        pattern.init($form);
                        $submit2.trigger("click");

                        var ajaxargs = $.ajax.calls.mostRecent().args[0];
                        expect($.ajax).toHaveBeenCalled();
                        expect(ajaxargs.url).toBe("other.html");
                        expect(ajaxargs.data).toBe("submit=special");
                    });

                    it("use an image submit with a formaction value as action URL", function() {
                        var $submit1 = $(
                                '<input type="submit" name="submit" value="default" />'
                            ),
                            $submit2 = $(
                                '<input type="image" name="submit" value="special" />'
                            );

                        $submit2.attr("formaction", "other.html");
                        $form.append($submit1).append($submit2);

                        pattern.init($form);
                        $submit2.trigger("click");

                        var ajaxargs = $.ajax.calls.mostRecent().args[0];
                        expect($.ajax).toHaveBeenCalled();
                        expect(ajaxargs.url).toBe("other.html");
                        expect(ajaxargs.data).toBe("submit=special");
                    });

                    it("use fragment in formaction value as source + target selector", function() {
                        var $submit1 = $(
                                '<input type="submit" name="submit" value="default" />'
                            ),
                            $submit2 = $(
                                '<input type="submit" name="submit" value="special" />'
                            ),
                            $target = $('<div id="otherid" />');

                        $submit2.attr("formaction", "other.html#otherid");
                        $form.append($submit1).append($submit2);
                        $div.append($target);

                        pattern.init($form);
                        $submit2.trigger("click");
                        answer(
                            "<html><body>" +
                                '<div id="otherid">other</div>' +
                                "</body></html>"
                        );

                        var ajaxargs = $.ajax.calls.mostRecent().args[0];
                        expect($.ajax).toHaveBeenCalled();
                        expect(ajaxargs.url).toBe("other.html");
                        expect(ajaxargs.data).toContain("submit=special");
                        expect($target.html()).toBe("other");
                    });

                    it("use fragment in formaction value as source selector, respect target", function() {
                        var $submit1 = $(
                                '<input type="submit" name="submit" value="default" />'
                            ),
                            $submit2 = $(
                                '<input type="submit" name="submit" value="special" />'
                            ),
                            $target = $('<div id="othertarget" />');

                        $form.attr("data-pat-inject", "target: #othertarget");
                        $submit2.attr("formaction", "other.html#otherid");
                        $form.append($submit1).append($submit2);
                        $div.append($target);

                        pattern.init($form);
                        $submit2.trigger("click");
                        answer(
                            "<html><body>" +
                                '<div id="otherid">other</div>' +
                                "</body></html>"
                        );

                        var ajaxargs = $.ajax.calls.mostRecent().args[0];
                        expect($.ajax).toHaveBeenCalled();
                        expect(ajaxargs.url).toBe("other.html");
                        expect(ajaxargs.data).toContain("submit=special");
                        expect($target.html()).toBe("other");
                    });

                    it("formaction works with multiple targets", function() {
                        var $submit1 = $(
                                '<input type="submit" name="submit" value="default" />'
                            ),
                            $submit2 = $(
                                '<input type="submit" name="submit" value="special" />'
                            ),
                            $target1 = $('<div id="target1" />'),
                            $target2 = $('<div id="target2" />');

                        $form.attr(
                            "data-pat-inject",
                            "target: #target1 && target: #target2"
                        );
                        $submit2.attr("formaction", "other.html#otherid");
                        $form.append($submit1).append($submit2);
                        $div.append($target1).append($target2);

                        pattern.init($form);
                        $submit2.trigger("click");
                        answer(
                            "<html><body>" +
                                '<div id="otherid">other</div>' +
                                "</body></html>"
                        );

                        var ajaxargs = $.ajax.calls.mostRecent().args[0];
                        expect($.ajax).toHaveBeenCalled();
                        expect(ajaxargs.url).toBe("other.html");
                        expect(ajaxargs.data).toContain("submit=special");
                        expect($target1.html()).toBe("other");
                        expect($target2.html()).toBe("other");
                    });

                    it("formaction works with multiple sources", function() {
                        var $submit1 = $(
                                '<input type="submit" name="submit" value="default" />'
                            ),
                            $submit2 = $(
                                '<input type="submit" name="submit" value="special" />'
                            ),
                            $target1 = $('<div id="target1" />'),
                            $target2 = $('<div id="target2" />');

                        $form.attr(
                            "data-pat-inject",
                            "#someid #target1 && #otherid #target2"
                        );
                        $submit2.attr("formaction", "other.html#otherid");
                        $form.append($submit1).append($submit2);
                        $div.append($target1).append($target2);

                        pattern.init($form);
                        $submit2.trigger("click");
                        answer(
                            "<html><body>" +
                                '<div id="someid">some</div>' +
                                '<div id="otherid">other</div>' +
                                "</body></html>"
                        );

                        var ajaxargs = $.ajax.calls.mostRecent().args[0];
                        expect($.ajax).toHaveBeenCalled();
                        expect(ajaxargs.url).toBe("other.html");
                        expect(ajaxargs.data).toContain("submit=special");
                        expect($target1.html()).toBe("some");
                        expect($target2.html()).toBe("other");
                    });

                    it("formaction works source and target on the button", function() {
                        var $submit1 = $(
                                '<input type="submit" name="submit" value="default" />'
                            ),
                            $submit2 = $(
                                '<input type="submit" name="submit" value="special" />'
                            ),
                            $target1 = $('<div id="target1" />'),
                            $target2 = $('<div id="target2" />');

                        $submit2.attr(
                            "data-pat-inject",
                            "#someid #target1 && #otherid #target2"
                        );
                        $submit2.attr("formaction", "other.html#otherid");
                        $form.append($submit1).append($submit2);
                        $div.append($target1).append($target2);

                        pattern.init($form);
                        $submit2.trigger("click");
                        answer(
                            "<html><body>" +
                                '<div id="someid">some</div>' +
                                '<div id="otherid">other</div>' +
                                "</body></html>"
                        );

                        var ajaxargs = $.ajax.calls.mostRecent().args[0];
                        expect($.ajax).toHaveBeenCalled();
                        expect(ajaxargs.url).toBe("other.html");
                        expect(ajaxargs.data).toContain("submit=special");
                        expect($target1.html()).toBe("some");
                        expect($target2.html()).toBe("other");
                    });
                });
            });
        });
    });
});
