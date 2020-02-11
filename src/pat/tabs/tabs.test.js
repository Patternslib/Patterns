define(["pat-tabs"], function(pattern) {
    describe("pat-tabs", function() {
        describe("When the size of all the tabs cannot fit in the pat-tabs div", function() {
            beforeEach(function() {
                $("<div/>", { id: "lab" }).appendTo(document.body);
            });
            afterEach(function() {
                $("#lab").remove();
            });

            it("some tabs will be placed in the extra-tabs span, which is a child of the pat-tabs element", function() {
                $("#lab").html(
                    [
                        '<nav class="navigation tabs pat-tabs" style="width:400px;">',
                        '<a href="" style="width:100px; display:block;">General</a>',
                        '<a href="" style="width:100px; display:block;">Members</a>',
                        '<a href="" style="width:100px; display:block;">Security</a>',
                        '<a href="" style="width:100px; display:block;">Advanced</a>',
                        "</nav>"
                    ].join("\n")
                );
                var $tabs = $(".pat-tabs");
                pattern.init($tabs);
                expect($tabs.find(".extra-tabs").length).toBeTruthy();
            });
        });

        describe("When the size of all the tabs (padding included) cannot fit in the pat-tabs div", function() {
            beforeEach(function() {
                $("<div/>", { id: "lab" }).appendTo(document.body);
            });
            afterEach(function() {
                $("#lab").remove();
            });

            it("some tabs will be placed in the extra-tabs span, which is a child of the pat-tabs element", function() {
                $("#lab").html(
                    [
                        '<nav class="navigation tabs pat-tabs" style="width:440px;">',
                        '<a href="" style="width:100px; padding: 0px 5px 0px 5px; display:block;">General</a>',
                        '<a href="" style="width:100px; padding: 0px 5px 0px 5px; display:block;">Members</a>',
                        '<a href="" style="width:100px; padding: 0px 5px 0px 5px; display:block;">Security</a>',
                        '<a href="" style="width:100px; padding: 0px 5px 0px 5px; display:block;">Advanced</a>',
                        "</nav>"
                    ].join("\n")
                );
                var $tabs = $(".pat-tabs");
                pattern.init($tabs);
                expect($tabs.find(".extra-tabs").length).toBeTruthy();
            });
        });

        describe("When the size of all the tabs can fit in the pat-tabs div", function() {
            beforeEach(function() {
                $("<div/>", { id: "lab" }).appendTo(document.body);
            });
            afterEach(function() {
                $("#lab").remove();
            });

            it("the extra-tabs span will not exist as a child of the pat-tabs element", function() {
                // XXX: Somehow the browsers doesn't behave so nicely, elements
                // wrap around even though according to our calculations they
                // don't have to. So we now check for 5% less than the
                // container width. That means, 401px must become 1.05*401 =422
                $("#lab").html(
                    [
                        '<nav class="navigation tabs pat-tabs" style="width:422px;">',
                        '<a href="" style="width:100px; display:block;">General</a>',
                        '<a href="" style="width:100px; display:block;">Members</a>',
                        '<a href="" style="width:100px; display:block;">Security</a>',
                        '<a href="" style="width:100px; display:block;">Advanced</a>',
                        "</nav>"
                    ].join("\n")
                );
                var $tabs = $(".pat-tabs");
                pattern.init($tabs);
                expect($tabs.find(".extra-tabs").length).toBeFalsy();
            });
        });

        describe("When the size of all the tabs (padding included) can fit in the pat-tabs div", function() {
            beforeEach(function() {
                $("<div/>", { id: "lab" }).appendTo(document.body);
            });
            afterEach(function() {
                $("#lab").remove();
            });

            it("the extra-tabs span will not exist as a child of the pat-tabs element", function() {
                // XXX: Somehow the browsers doesn't behave so nicely, elements
                // wrap around even though according to our calculations they
                // don't have to. So we now check for 5% less than the
                // container width. That means, 441px must become 1.05*441 =422
                $("#lab").html(
                    [
                        '<nav class="navigation tabs pat-tabs" style="width:464px;">',
                        '<a href="" style="width:100px; padding: 0px 5px 0px 5px; display:block;">General</a>',
                        '<a href="" style="width:100px; padding: 0px 5px 0px 5px; display:block;">Members</a>',
                        '<a href="" style="width:100px; padding: 0px 5px 0px 5px; display:block;">Security</a>',
                        '<a href="" style="width:100px; padding: 0px 5px 0px 5px; display:block;">Advanced</a>',
                        "</nav>"
                    ].join("\n")
                );
                var $tabs = $(".pat-tabs");
                pattern.init($tabs);
                expect($tabs.find(".extra-tabs").length).toBeFalsy();
            });
        });
    });
});
