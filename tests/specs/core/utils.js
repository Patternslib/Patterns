define(["utils"], function(utils) {
    describe("utils", function() {
        describe("rebaseURL", function() {
            it("Keep URL with scheme", function() {
                expect(
                    utils.rebaseURL("http://example.com/foo/", "http://other.com/me"))
                    .toBe("http://other.com/me");
            });

            it("Keep URL with absolute path", function() {
                expect(
                    utils.rebaseURL("http://example.com/foo/", "/me"))
                    .toBe("/me");
            });

            it("Rebase to base with filename", function() {
                expect(
                    utils.rebaseURL("http://example.com/foo/index.html", "me/page.html"))
                    .toBe("http://example.com/foo/me/page.html");
            });

            it("Rebase to base with directory path", function() {
                expect(
                    utils.rebaseURL("http://example.com/foo/", "me/page.html"))
                    .toBe("http://example.com/foo/me/page.html");
            });
        });

        describe("findLabel", function() {
            beforeEach(function() {
                $("<div/>", {id: "lab"}).appendTo(document.body);
            });

            afterEach(function() {
                $("#lab").remove();
            });

            it("Input without a label", function() {
                $("#lab").html("<input id=\"input\"/>");
                var input = document.getElementById("input");
                expect(utils.findLabel(input)).toBeNull();
            });

            it("Input wrapped in a label", function() {
                $("#lab").html("<label id=\"label\"><input id=\"input\"/></label>");
                var input = document.getElementById("input"),
                    label = utils.findLabel(input);
                expect(label.id).toBe("label");
            });

            it("External label referencing input by id", function() {
                $("#lab").html("<label id=\"label\" for=\"input\">Label</label><input id=\"input\"/>");
                var input = document.getElementById("input"),
                    label = utils.findLabel(input);
                expect(label.id).toBe("label");
            });

            it("External label in same form referencing input by name", function() {
                $("#lab").html("<form><label id=\"label\" for=\"name\">Label</label><input name=\"name\" id=\"input\"/>");
                var input = document.getElementById("input"),
                    label = utils.findLabel(input);
                expect(label.id).toBe("label");
            });

            it("External label in different form referencing input by name", function() {
                $("#lab").html("<form><label id=\"label\" for=\"name\">Label</label></form><input name=\"name\" id=\"input\"/>");
                var input = document.getElementById("input");
                expect(utils.findLabel(input)).toBeNull();
            });
        });
    });
});
