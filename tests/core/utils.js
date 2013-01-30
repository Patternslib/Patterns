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
    });

});
