define(["pat-toggle", "jquery"], function(pattern, $) {

    describe("pat-toggle", function() {

        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("_update", function() {
            it("No targets", function() {
                spyOn($.fn, "toggleClass");
                spyOn($.fn, "removeAttr");
                spyOn($.fn, "attr");
                pattern._update(".missing");
                expect($.fn.toggleClass).not.toHaveBeenCalled();
                expect($.fn.removeAttr).not.toHaveBeenCalled();
                expect($.fn.attr).not.toHaveBeenCalled();
            });

            it("Toggle class", function() {
                $("#lab").html("<div id='victim' class='always'/>");
                pattern._update("#victim", "class", "check on", false);
                expect($("#victim").hasClass("on")).toBe(true);
                expect($("#victim").hasClass("always")).toBe(true);
                pattern._update("#victim", "class", "on", false);
                expect($("#victim").hasClass("on")).toBe(false);
                expect($("#victim").hasClass("always")).toBe(true);
            });

            it("Toggle attribute", function() {
                $("#lab").html("<input type='checkbox' id='victim'/>");
                var $checkbox = $("#victim");
                pattern._update("#victim", "checked", "checked", false);
                expect($checkbox.attr("checked")).toBeTruthy();
                pattern._update("#victim", "checked", "checked", false);
                expect($checkbox.attr("checked")).toBeFalsy();
            });

            it("Toggle does not reset initial state", function() {
                $("#lab").html("<input type='checkbox' id='victim'/>");
                var $checkbox = $("#victim");
                $checkbox[0].defaultChecked=true;
                $checkbox[0].checked=true;
                pattern._update("#victim", "checked", "checked", false);
                expect($checkbox.attr("checked")).toBeFalsy();
                expect($checkbox[0].defaultChecked).toBe(true);
            });

            it("Multiple targets", function() {
                $("#lab")
                    .append("<div id='one' class='victim'/>")
                    .append("<div id='two' class='victim'/>");
                pattern._update(".victim", "class", "on", false);
                expect($("#one").hasClass("on")).toBe(true);
                expect($("#two").hasClass("on")).toBe(true);
            });

            it("Send pat-update event", function() {
                $("#lab").html("<div id='victim' class='always'/>");
                spyOn($.fn, "trigger");
                pattern._update("#victim", "class", "check on", false);
                expect($.fn.trigger).toHaveBeenCalledWith(
                    "pat-update", {pattern: "toggle"});
            });
        });
    });

});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
