define(["utils"], function(utils) {
    describe("removeWildcardClass", function() {
        it("Remove basic class", function() {
            var $el = $("<div class='on'/>");
            utils.removeWildcardClass($el, "on");
            expect($el.hasClass("on")).toBe(false);
        });

        it("Keep other classes", function() {
            var $el = $("<div class='one two'/>");
            utils.removeWildcardClass($el, "one");
            expect($el.attr("class")).toBe("two");
        });

        it("Remove uses whole words", function() {
            var $el = $("<div class='cheese-on-bread'/>");
            utils.removeWildcardClass($el, "on");
            expect($el.attr("class")).toBe("cheese-on-bread");
        });

        it("Remove wildcard postfix class", function() {
            var $el = $("<div class='icon-small'/>");
            utils.removeWildcardClass($el, "icon-*");
            expect($el.attr("class")).toBeFalsy();
        });

        it("Remove wildcard infix class", function() {
            var $el = $("<div class='icon-small-alert/>");
            utils.removeWildcardClass($el, "icon-*-alert");
            expect($el.attr("class")).toBeFalsy();
        });

        it("Keep other classes when removing wildcards", function() {
            var $el = $("<div class='icon-small foo'/>");
            utils.removeWildcardClass($el, "icon-*");
            expect($el.attr("class")).toBe("foo");
        });
    });
});
