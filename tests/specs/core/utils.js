define(["pat-utils"], function(utils) {
    describe("pat-utils", function() {
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

    describe("hideOrShow", function() {
        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
            jasmine.Clock.useMock();$("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        it("Hide without a transition", function() {
            $("#lab").append("<div/>");
            var $slave = $("#lab div");
            utils.hideOrShow($slave, false, {transition: "none", effect: {duration: "fast", easing: "swing"}});
            expect($slave[0].style.display).toBe("none");
            expect(Array.prototype.slice.call($slave[0].classList)).toEqual(["hidden"]);
        });

        it("Show without a transition", function() {
            $("#lab").append("<div style=\"display: none\"/>");
            var $slave = $("#lab div");
            utils.hideOrShow($slave, true, {transition: "none", effect: {duration: "fast", easing: "swing"}});
            expect($slave[0].style.display).toBe("");
            expect(Array.prototype.slice.call($slave[0].classList)).toEqual(["visible"]);
        });

        it("Single pat-update event without a transition", function() {
            $("#lab").append("<div style=\"display: none\"/>");
            var $slave = $("#lab div");
            spyOn($.fn, "trigger");
            utils.hideOrShow($slave, true, {transition: "none", effect: {duration: "fast", easing: "swing"}}, "depends");
            expect($.fn.trigger.calls.length).toEqual(1);
            expect($.fn.trigger).toHaveBeenCalledWith(
                "pat-update", {pattern: "depends", transition: "complete"});
        });

        it("Fadeout with 0 duration", function() {
            $("#lab").append("<div/>");
            var $slave = $("#lab div");
            utils.hideOrShow($slave, false, {transition: "slide", effect: {duration: 0, easing: "swing"}});
            expect($slave[0].style.display).toBe("none");
            expect(Array.prototype.slice.call($slave[0].classList)).toEqual(["hidden"]);
        });

        it("Fadeout with non-zero duration", function() {
            $("#lab").append("<div/>");
            var $slave = $("#lab div");
            utils.hideOrShow($slave, false, {transition: "slide", effect: {duration: "fast", easing: "swing"}});
            expect($slave[0].style.display).toBe("none");
            expect(Array.prototype.slice.call($slave[0].classList)).toEqual(["hidden"]);
        });

        it("pat-update event with a transition", function() {
            $("#lab").append("<div/>");
            var $slave = $("#lab div");
            spyOn($.fn, "trigger");
            utils.hideOrShow($slave, false, {transition: "slide", effect: {duration: "fast", easing: "swing"}}, "depends");
            expect($.fn.trigger.calls.length).toEqual(2);
            expect($.fn.trigger).toHaveBeenCalledWith(
                "pat-update", {pattern: "depends", transition: "start"});
            expect($.fn.trigger).toHaveBeenCalledWith(
                "pat-update", {pattern: "depends", transition: "complete"});
        });

        it("CSS-only hide", function() {
            $("#lab").append("<div/>");
            var $slave = $("#lab div");
            utils.hideOrShow($slave, false, {transition: "css", effect: {duration: "fast", easing: "swing"}});
            expect($slave[0].style.display).toBe("");
            expect(Array.prototype.slice.call($slave[0].classList)).toEqual(["hidden"]);
        });
    });
});
