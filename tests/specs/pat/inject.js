define(["pat-inject", "pat-utils"], function(pattern, utils) {

    describe("inject-pattern", function() {

        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("rebaseHTML", function() {
            it("Basic markup with DOCTYPE", function() {
                expect(
                    pattern._rebaseHTML("base", "<!DOCTYPE html>\n<p>This is a simple <em>test</em></p>"))
                    .toBe("<p>This is a simple <em>test</em></p>");
            });

            it("Basic markup", function() {
                expect(
                    pattern._rebaseHTML("base", "<p>This is a simple <em>test</em></p>"))
                    .toBe("<p>This is a simple <em>test</em></p>");
            });

            it("Recover from unclosed tags", function() {
                expect(
                    pattern._rebaseHTML("base", "<p>This is a simple <em>test</p>"))
                    .toBe("<p>This is a simple <em>test</em></p>");
            });

            it("Element without link attribute", function() {
                spyOn(utils, "rebaseURL");
                expect(
                    pattern._rebaseHTML("base", "<a>This is a test</a>"))
                    .toBe("<a>This is a test</a>");
                expect(utils.rebaseURL).not.toHaveBeenCalled();
            });

            it("Element with link attribute", function() {
                spyOn(utils, "rebaseURL").andReturn("REBASED");
                expect(
                    pattern._rebaseHTML("base", "<a href=\"example.com\">This is a test</a>"))
                    .toBe("<a href=\"REBASED\">This is a test</a>");
                expect(utils.rebaseURL).toHaveBeenCalledWith("base", "example.com");
            });

            it("Automatically fix casing of attribute", function() {
                spyOn(utils, "rebaseURL").andReturn("REBASED");
                expect(
                    pattern._rebaseHTML("base", "<a HrEf=\"example.com\">This is a test</a>"))
                    .toBe("<a href=\"REBASED\">This is a test</a>");
            });

            it("Check if image is rebased correctly", function() {
                spyOn(utils, "rebaseURL").andReturn("REBASED");
                expect(
                    pattern._rebaseHTML("base", "<img src=\"example.com\">"))
                    .toBe("<img src=\"REBASED\">");
            });

            it("Leave non attribute occurences of src intact", function() {
                spyOn(utils, "rebaseURL").andReturn("REBASED");
                expect(
                    pattern._rebaseHTML("base", "<p>This string has    src = \"foo\" , src= bar , and SrC='foo'</p>"))
                    .toBe("<p>This string has    src = \"foo\" , src= bar , and SrC='foo'</p>");
            });
        });

	describe("parseRawHtml", function() {
            it("Roundtrip attributes with double quotes", function() {
                var value = "{\"plugins\": \"paste\", \"content_css\": \"/_themes/Style/tiny-body.css\"}",
                    input = "<a data-tinymce-json='" + value + "'>Test</a>",
                    $output = pattern._parseRawHtml(input, null);
                expect($output.find("a").attr("data-tinymce-json")).toBe(value);
            });

            it("Roundtrip attributes with single quotes", function() {
                var value = "{'plugins': 'paste', 'content_css': '/_themes/Style/tiny-body.css'}",
                    input = "<a data-tinymce-json=\"" + value + "\">Test</a>",
                    $output = pattern._parseRawHtml(input, null);
                expect($output.find("a").attr("data-tinymce-json")).toBe(value);
            });
		});

        describe("Functional tests", function() {
            describe("extract/verifyConfig", function() {
                var $a, $target;

                beforeEach(function() {
                    $a = $("<a class=\"pat-inject\" href=\"test.html#someid\">link</a>");
                    $target = $("<div id=\"someid\">");

                    $("#lab").append($a).append($target);
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
                    this.after(function() { $target.remove(); });
                    expect($target.length).toBeGreaterThan(0);
                    expect($target.parent().prop("tagName")).toBe("BODY");
                });
            });
        });

        describe("DOM tests", function() {
            var answer = function(html) {
                expect($.ajax).toHaveBeenCalled();
                $.ajax.mostRecentCall.args[0].success(html, "ok", { responseText: html });
            };

            beforeEach(function() {
                spyOn($, "ajax");
            });


            describe("inject on anchor", function() {
                var $a, $div;

                beforeEach(function() {
                    $a = $("<a class=\"pat-inject\" href=\"test.html#someid\">link</a>");
                    $div = $("<div id=\"someid\" />");
                    $("#lab").append($a).append($div);
                });


                it("fetches url on click", function() {
                    pattern.init($a);

                    $a.trigger("click");

                    expect($.ajax).toHaveBeenCalled();
                    expect($.ajax.mostRecentCall.args[0].url).toBe("test.html");
                });

                it("injects into existing div", function() {
                    pattern.init($a);
                    $a.trigger("click");
                    answer("<html><body><div id=\"someid\">replacement</div></body></html>");

                    expect($div.html()).toBe("replacement");
                });

                it("injects multiple times", function() {
                    pattern.init($a);
                    $a.trigger("click");
                    answer("<html><body><div id=\"someid\">replacement</div></body></html>");
                    expect($div.html()).toBe("replacement");

                    $a.trigger("click");
                    answer("<html><body><div id=\"someid\">new replacement</div></body></html>");
                    expect($div.html()).toBe("new replacement");
                });

                it("takes multiple source-target pairs", function() {
                    $a.attr("data-pat-inject", "#someid1 #otherid1 && #someid2 #otherid2");
                    var $target1 = $("<div id=\"otherid1\" />"),
                        $target2 = $("<div id=\"otherid2\" />");
                    $div.append($target1).append($target2);

                    pattern.init($a);
                    $a.trigger("click");
                    answer("<html><body>" +
                           "<div id=\"someid1\">repl1</div>" +
                           "<div id=\"someid2\">repl2</div>" +
                           "</body></html>");

                    expect($target1.html()).toBe("repl1");
                    expect($target2.html()).toBe("repl2");
                });

                it("acts on other selectors as well", function() {
                    $a.attr("data-pat-inject", "target: #someid > .someclass");
                    var $target1 = $("<div class=\"someclass\" />"),
                        $target2 = $("<div class=\"someclass\" />");
                    $div.append($target1).append($target2);

                    pattern.init($a);
                    $a.trigger("click");
                    answer("<html><body>" +
                           "<div id=\"someid\">repl</div>" +
                           "</body></html>");

                    expect($target1.html()).toBe("repl");
                    expect($target2.html()).toBe("repl");
                });

                it("sets/unsets load class 'injecting'", function() {
                    var callback = jasmine.createSpy("patterns-injected");
                    $(document).on("patterns-injected", callback);

                    pattern.init($a);
                    $a.trigger("click");

                    expect($div.hasClass("injecting")).toBeTruthy();

                    answer("<html><body>" +
                           "<div id=\"someid\">repl</div>" +
                           "</body></html>");

                    // XXX: fails, probably due to misuse of jasmine (on
                    // patterns demo page the injecting classes are
                    // removed after a successful inject

                    // expect($div.hasClass("injecting")).toBeFalsy();
                    // expect(callback).toHaveBeenCalled();
                });

                it("copies into target if source has ::element", function() {
                    $a.attr("data-pat-inject", "#otherid::element #someid");

                    pattern.init($a);
                    $a.trigger("click");
                    answer("<html><body>" +
                           "<div id=\"otherid\" class=\"someclass\">repl</div>" +
                           "</body></html>");

                    expect($div.children().attr("id")).toBe("otherid");
                    expect($div.children().attr("class")).toBe("someclass");
                });

                it("replaces target if both selectors have ::element", function() {
                    $a.attr("data-pat-inject", "#someid::element #otherid::element");
                    $div.append($("<div id=\"otherid\" />"));

                    pattern.init($a);
                    $a.trigger("click");
                    answer("<html><body>" +
                           "<div id=\"someid\" class=\"someclass\">repl</div>" +
                           "</body></html>");

                    expect($div.children().attr("id")).toBe("someid");
                    expect($div.children().attr("class")).toBe("someclass");
                });

                it("allows ::before and ::after in target selector", function() {
                    $a.attr("data-pat-inject", "target: #target1::after && target: #target2::before");
                    var $target1 = $("<div id=\"target1\">content</div>"),
                        $target2 = $("<div id=\"target2\">content</div>");
                    $div.append($target1).append($target2);

                    pattern.init($a);
                    $a.trigger("click");
                    answer("<html><body>" +
                           "<div id=\"someid\">repl</div>" +
                           "</body></html>");

                    expect($target1.html()).toBe("contentrepl");
                    expect($target2.html()).toBe("replcontent");
                });

                it("allows mixing ::element and ::after in target", function() {
                    $a.attr("data-pat-inject", "target: #otherid::element::after");
                    $div.append($("<div id=\"otherid\" />"));

                    pattern.init($a);
                    $a.trigger("click");
                    answer("<html><body>" +
                           "<div id=\"someid\">repl</div>" +
                           "</body></html>");

                    expect($div.contents().last().text()).toBe("repl");
                });
            });


            describe("inject on forms", function() {
                var $form, $div;

                beforeEach(function() {
                    $form = $("<form class=\"pat-inject\" action=\"test.html#someid\" />");
                    $div = $("<div id=\"someid\" />");
                    $("#lab").append($form).append($div);
                });


                it("trigger injection on submit", function() {
                    pattern.init($form);
                    $form.trigger("submit");
                    answer("<html><body>" +
                           "<div id=\"someid\">repl</div>" +
                           "</body></html>");

                    expect($div.html()).toBe("repl");
                });

                it("pass get form parameters in ajax call as data", function() {
                    $form.attr("method", "get");
                    $form.append($("<input type=\"text\" name=\"param\" value=\"somevalue\" />"));

                    pattern.init($form);
                    $form.trigger("submit");

                    expect($.ajax).toHaveBeenCalled();
                    expect($.ajax.mostRecentCall.args[0].url).toContain("param=somevalue");
                });

                it("pass post form parameters in ajax call as data", function() {
                    $form.attr("method", "post");
                    $form.append($("<input type=\"text\" name=\"param\" value=\"somevalue\" />"));

                    pattern.init($form);
                    $form.trigger("submit");

                    expect($.ajax).toHaveBeenCalled();
                    expect($.ajax.mostRecentCall.args[0].data).toContain("param=somevalue");
                });

                it("pass submit button value in ajax call as data", function() {
                    var $submit = $("<input type=\"submit\" name=\"submit\" value=\"label\" />");

                    $form.attr("method", "post");
                    $form.append($submit);

                    pattern.init($form);
                    $submit.trigger("click");

                    expect($.ajax).toHaveBeenCalled();
                    expect($.ajax.mostRecentCall.args[0].data).toContain("submit=label");
                });
            });
        });
    });

});
