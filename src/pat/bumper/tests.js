define(["pat-bumper"], function(pattern) {

    describe("pat-bumper", function() {
        beforeEach(function() {
            $("#lab").remove();
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        describe("init", function(){
            it("Return jQuery object", function() {
                var jq = jasmine.createSpyObj("jQuery", ["each"]);
                jq.each.andReturn(jq);
                expect(pattern.init(jq)).toBe(jq);
            });
        });

        describe("Check if _findScrollContainer", function() {
            it("handles a normal object", function() {
                $("#lab").append("<div id='sticker'/>");
                var el = document.getElementById("sticker");
                expect(pattern._findScrollContainer(el)).toBeNull();
            });

            it("handles an object in an overflow-auto container", function() {
                var lab = document.getElementById("lab"),
                    container = document.createElement("div"),
                    sticker = document.createElement("p");
                container.style.overflowY="auto";
                sticker.style.margin="0";
                sticker.style.height="50px";
                container.appendChild(sticker);
                lab.appendChild(container);
                expect(pattern._findScrollContainer(sticker)).toBe(container);
            });

            it("handles an object in an overflow-scroll container", function() {
                var lab = document.getElementById("lab"),
                    container = document.createElement("div"),
                    sticker = document.createElement("p");
                container.style.overflowY="scroll";
                sticker.style.margin="0";
                sticker.style.height="50px";
                container.appendChild(sticker);
                lab.appendChild(container);
                expect(pattern._findScrollContainer(sticker)).toBe(container);
            });
        });

        describe("Check if _markBumped", function() {
            it("updates classes for bumped item", function() {
                var sticker = document.createElement("p"),
                    $sticker = $(sticker);
                $sticker.addClass("plain");
                pattern._markBumped($sticker, {bump: {add: "bumped", remove: "plain"}}, true);
                expect(sticker.className).toBe("bumped");
            });

            it("updates classes for unbumped item", function() {
                var sticker = document.createElement("p"),
                    $sticker = $(sticker);
                $sticker.addClass("bumped");
                pattern._markBumped($sticker, {unbump: {add: "plain", remove: "bumped"}}, false);
                expect(sticker.className).toBe("plain");
            });
        });

        describe("Check if in a scrolling container _updateStatus", function() {
            it("correctly transitions an element to bumped at the top", function() {
                var lab = document.getElementById("lab"),
                    container = document.createElement("div"),
                    padding = document.createElement("div"),
                    sticker = document.createElement("p");
                container.style.overflowY="scroll";
                container.style.height="15px";
                container.style.position="relative";
                lab.appendChild(container);
                sticker.style.margin="0";
                sticker.style.height="5px";
                sticker.style.position="relative";
                container.appendChild(sticker);
                padding.style.clear="both";
                padding.style.height="30px";
                container.appendChild(padding);
                container.scrollTop=5;
                spyOn(pattern, "_markBumped");
                $(sticker).data("pat-bumper:config", {margin: 0, bumptop: true});
                pattern._updateStatus(sticker, container);
                expect(pattern._markBumped).toHaveBeenCalled();
                expect(pattern._markBumped.mostRecentCall.args[2]).toBeTruthy();
                expect(sticker.style.top).toBe("5px");
            });

            it("correctly transitions an element to unbumped", function() {
                var lab = document.getElementById("lab"),
                    container = document.createElement("div"),
                    padding = document.createElement("div"),
                    sticker = document.createElement("p");
                container.style.overflowY="scroll";
                container.style.height="15px";
                container.style.position="relative";
                lab.appendChild(container);
                sticker.style.margin="0";
                sticker.style.height="5px";
                sticker.style.position="relative";
                container.appendChild(sticker);
                padding.style.clear="both";
                padding.style.height="30px";
                container.appendChild(padding);
                container.scrollTop=0;
                spyOn(pattern, "_markBumped");
                pattern._updateStatus(sticker, container);
                expect(pattern._markBumped).toHaveBeenCalled();
                expect(pattern._markBumped.mostRecentCall.args[2]).toBeFalsy();
                expect(sticker.style.top).toBe("");
            });
        });

        describe("Check if _updateStatus", function() {
            it("correctly transitions to bumped at the top", function() {
                var lab = document.getElementById("lab"),
                    padding = document.createElement("div"),
                    sticker = document.createElement("p");
                sticker.style.margin="0";
                sticker.style.height="5px";
                sticker.style.position="relative";
                lab.appendChild(sticker);
                $(sticker).data("pat-bumper:config", {margin: 0, bumptop: true});
                padding.style.clear="both";
                padding.style.height="3000px";
                lab.appendChild(padding);
                window.scrollTo(0, sticker.offsetTop+5);
                spyOn(pattern, "_markBumped");
                pattern._updateStatus(sticker);
                expect(pattern._markBumped).toHaveBeenCalled();
                expect(pattern._markBumped.mostRecentCall.args[2]).toBeTruthy();
                expect(Math.floor(sticker.style.top.replace("px", ""))).toBe(5);
            });

            it("correctly transitions to unbumped at the top", function() {
                var lab = document.getElementById("lab"),
                    padding = document.createElement("div"),
                    sticker = document.createElement("p");
                sticker.style.margin="0";
                sticker.style.height="5px";
                sticker.style.position="relative";
                sticker.style.top="5px";
                lab.appendChild(sticker);
                $(sticker).data("pat-bumper:config", {margin: 0});
                padding.style.clear="both";
                padding.style.height="3000px";
                lab.appendChild(padding);
                window.scrollTo(0, 0);
                spyOn(pattern, "_markBumped");
                pattern._updateStatus(sticker);
                expect(pattern._markBumped).toHaveBeenCalled();
                expect(pattern._markBumped.mostRecentCall.args[2]).toBeFalsy();
                expect(sticker.style.top).toBe("");
            });
        });
    });
});
