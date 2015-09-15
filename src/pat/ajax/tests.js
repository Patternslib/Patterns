define(["pat-ajax"], function(pattern) {
    var $lab;

    describe("pat-ajax", function() {

        beforeEach(function() {
            $lab = $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("anchor", function() {
            it("triggers ajax request on click", function() {
                var $a = $("<a href='href.html' />").appendTo($lab);
                pattern.init($a);
                spyOn($, "ajax");
                $a.click();
                expect($.ajax.calls[0].args[0].context[0]).toBe($a[0]);
                expect($.ajax.calls[0].args[0].url).toBe("href.html");
            });
        });

        //
        // ATTENTION: These might fail on IE8 due to different code
        // path in jquery.form that does not use $.ajax
        //
        describe("form", function() {
            var $form, $button;

            beforeEach(function() {
                $form = $("<form action='action.html'></form>").appendTo($lab);
                $button = $(
                    "<button type='submit' name='submit' value='submit' />"
                ).appendTo($form);
                $("<input name='input1' value='value1' />").appendTo($form);
                pattern.init($form);
                spyOn($, "ajax");
            });

            it("triggers ajax request on submit", function() {
                $form.submit();
                expect($.ajax).toHaveBeenCalled();
            });

            it("honors method='post'", function() {
                $form.attr("method", "post");
                $form.submit();
                expect($.ajax.calls[0].args[0].url).toEqual("action.html");
                expect($.ajax.calls[0].args[0].data).toEqual("input1=value1");
            });

            it("triggers ajax request on click submit", function() {
                $button.click();
                expect($.ajax).toHaveBeenCalled();
            });

            it("does include submit button clicked", function() {
                $button.click();
                expect($.ajax.calls[0].args[0].url)
                    .toEqual("action.html?input1=value1&submit=submit");
            });

            it("does not include submit buttons if not clicked", function() {
                $form.submit();
                expect($.ajax.calls[0].args[0].url)
                    .toEqual("action.html?input1=value1");
            });
        });
    });

});
