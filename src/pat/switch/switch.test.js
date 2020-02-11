define(["pat-switch", "jquery"], function(pattern, jQuery) {
    describe("pat-switch", function() {
        beforeEach(function() {
            $("<div/>", { id: "lab" }).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        describe("When the switch is clicked", function() {
            describe("if the switch is a hyperlink", function() {
                it("the default click action is prevented", function() {
                    var $el = $("<a/>", {
                        id: "anchor",
                        href: "#anchor",
                        text: "Switch",
                        class: "pat-switch",
                        "data-pat-switch": "#lab on off"
                    }).appendTo(document.body);
                    var ev = {
                        type: "click",
                        preventDefault: function() {}
                    };
                    var spy_onClick = spyOn(
                        pattern,
                        "_onClick"
                    ).and.callThrough();
                    var spy_go = spyOn(pattern, "_go");
                    var spy_preventDefault = spyOn(ev, "preventDefault");
                    pattern.init($el);
                    $el.trigger(ev);
                    expect(spy_onClick).toHaveBeenCalled();
                    expect(spy_go).toHaveBeenCalled();
                    expect(spy_preventDefault).toHaveBeenCalled();
                    $el.remove();
                });
            });

            describe("if the switch is not a hyperlink", function() {
                it("the default click action is not prevented", function() {
                    var $el = $("<button/>", {
                        id: "anchor",
                        text: "Switch",
                        class: "pat-switch",
                        "data-pat-switch": "#lab on off"
                    }).appendTo(document.body);

                    var ev = {
                        type: "click",
                        preventDefault: function() {}
                    };
                    var spy_onClick = spyOn(
                        pattern,
                        "_onClick"
                    ).and.callThrough();
                    var spy_go = spyOn(pattern, "_go");
                    var spy_preventDefault = spyOn(ev, "preventDefault");
                    pattern.init($el);
                    $el.trigger(ev);
                    expect(spy_onClick).toHaveBeenCalled();
                    expect(spy_go).toHaveBeenCalled();
                    expect(spy_preventDefault).not.toHaveBeenCalled();
                    $el.remove();
                });
            });
        });

        describe("_validateOptions", function() {
            it("Bad options", function() {
                var options = pattern._validateOptions([{}]);
                expect(options).toEqual([]);
            });

            it("Mix valid and invalid options", function() {
                var options = pattern._validateOptions([
                    { selector: "#victim", add: "purple" },
                    {}
                ]);
                expect(options.length).toBe(1);
                expect(options[0]).toEqual({
                    selector: "#victim",
                    add: "purple"
                });
            });
        });

        describe("_update", function() {
            it("No targets", function() {
                var spy_addClass = spyOn(jQuery.fn, "addClass");
                var spy_removeClass = spyOn(jQuery.fn, "removeClass");
                pattern._update(".missing");
                expect(spy_addClass).not.toHaveBeenCalled();
                expect(spy_removeClass).not.toHaveBeenCalled();
            });

            it("Remove basic class", function() {
                $("#lab").html("<div class='on'/>");
                pattern._update("#lab div", "on");
                expect($("#lab div").hasClass("on")).toBe(false);
            });

            it("Remove wildcard postfix class", function() {
                $("#lab").html("<div class='icon-small'/>");
                pattern._update("#lab div", "icon-*");
                expect($("#lab div").attr("class")).toBeFalsy();
            });

            it("Add class", function() {
                $("#lab").html("<div/>");
                pattern._update("#lab div", null, "icon-alert");
                expect($("#lab div").attr("class")).toBe("icon-alert");
            });

            it("Send pat-update event", function() {
                $("#lab").html("<div id='victim' class='always'/>");
                var spy_trigger = spyOn($.fn, "trigger");
                pattern._update("#lab div", null, "icon-alert");
                expect(spy_trigger).toHaveBeenCalledWith("pat-update", {
                    pattern: "switch"
                });
            });
        });

        describe("jQuery plugin usage", function() {
            describe("Initialise via jQuery", function() {
                it("Specify defaults via API", function() {
                    $("#lab").html("<button>Click me</button>");
                    $("#lab button").patternSwitch({
                        selector: "#victim",
                        add: "pink"
                    });
                    var $trigger = $("#lab button");
                    expect($trigger.data("patternSwitch")).toEqual([
                        { store: "none", selector: "#victim", add: "pink" }
                    ]);
                });

                it("Invalid defaults via API", function() {
                    $("#lab").html("<button>Click me</button>");
                    $("#lab button").patternSwitch({ selector: "#victim" });
                    var $trigger = $("#lab button");
                    expect($trigger.data("patternSwitch")).toBeFalsy();
                });

                it("Parse defaults from DOM", function() {
                    $("#lab").html(
                        "<button data-pat-switch='#victim foo bar'>Click me</button>"
                    );
                    $("#lab button").patternSwitch();
                    var $trigger = $("#lab button");
                    expect($trigger.data("patternSwitch")).toEqual([
                        {
                            store: "none",
                            selector: "#victim",
                            remove: "foo",
                            add: "bar"
                        }
                    ]);
                });

                it("Setup click event handler", function() {
                    // Note that this relies on jQuery implementation details to check
                    // for registered event handlers.
                    $("#lab").html(
                        "<button data-pat-switch='#victim foo'>Click me</button>"
                    );
                    var $trigger = $("#lab button").patternSwitch(),
                        events = $._data($trigger[0]).events;
                    expect(events.click).toBeDefined();
                    expect(events.click[0].namespace).toBe("patternSwitch");
                });
            });

            it("Execute changes", function() {
                $("#lab")
                    .append(
                        "<button data-pat-switch='#victim foo'>Click me</button>"
                    )
                    .append("<div id='victim' class='foo'/>");
                var $trigger = $("#lab button").patternSwitch();
                $trigger.patternSwitch("execute");
                expect($("#victim").hasClass("foo")).toBeFalsy();
            });

            describe("Destroy all hooks", function() {
                it("Setup click event handler", function() {
                    // Note that this relies on jQuery implementation details to check
                    // for registered event handlers.
                    $("#lab").html(
                        "<button data-pat-switch='#victim foo'>Click me</button>"
                    );
                    var $trigger = $("#lab button").patternSwitch(),
                        events = $._data($trigger[0]).events;
                    expect(events.click).toBeDefined();
                    $trigger.patternSwitch("destroy");
                    expect(events.click).not.toBeDefined();
                    expect($trigger.data("patternSwitch")).toBeFalsy();
                });
            });
        });
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
