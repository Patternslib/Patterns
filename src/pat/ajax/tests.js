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
                var ajaxargs = $.ajax.calls.mostRecent().args[0];
                expect(ajaxargs.context[0]).toBe($a[0]);
                expect(ajaxargs.url).toBe("href.html");
            });
        });

        //
        // ATTENTION: These might fail on IE8 due to different code
        // path in jquery.form that does not use $.ajax
        //
        describe("form", function() {
            var $form, $button, spy_ajax;

            beforeEach(function() {
                $form = $("<form action='action.html'></form>").appendTo($lab);
                $button = $(
                    "<button type='submit' name='submit' value='submit' />"
                ).appendTo($form);
                $("<input name='input1' value='value1' />").appendTo($form);
                pattern.init($form);
                spy_ajax = spyOn($, "ajax");
            });

            it("triggers ajax request on submit", function() {
                $form.submit();
                expect(spy_ajax).toHaveBeenCalled();
            });

            it("honors method='post'", function() {
                $form.attr("method", "post");
                $form.submit();
                var ajaxargs = $.ajax.calls.mostRecent().args[0];
                expect(ajaxargs.url).toEqual("action.html");
                expect(ajaxargs.method).toEqual("POST");
                // Commenting this out because phantomjs doesn't support formdata
                // https://github.com/ariya/phantomjs/issues/14867
                //expect(ajaxargs.data.get('input1')).toContain("value1");
            });

            it("triggers ajax request on click submit", function() {
                $button.click();
                expect(spy_ajax).toHaveBeenCalled();
            });

            it("does include submit button clicked", function() {
                $button.click();
                var ajaxargs = $.ajax.calls.mostRecent().args[0];
                expect(ajaxargs.url).toEqual("action.html");
                expect(ajaxargs.data).toEqual("input1=value1&submit=submit");
            });

            it("does not include submit buttons if not clicked", function() {
                $form.submit();
                var ajaxargs = $.ajax.calls.mostRecent().args[0];
                expect(ajaxargs.url).toEqual("action.html");
                expect(ajaxargs.data).toEqual("input1=value1");
            });
        });
    });

});
