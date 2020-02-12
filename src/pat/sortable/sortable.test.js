define([import registry from "../../core/registry"; "pat-sortable"], function(registry, Sortable) {
    describe("pat-sortable", function() {
        beforeEach(function() {
            $("div#lab").remove();
            $("<div/>", { id: "lab" }).appendTo(document.body);
        });
        afterEach(function() {
            $("#lab").remove();
        });

        it("adds class on drag start", function() {
            var $el = $(
                "" +
                    '<ul class="pat-sortable">' +
                    "<li>One</li>" +
                    "<li>Two</li>" +
                    "<li>Three</li>" +
                    "</ul>"
            ).appendTo("#lab");
            var sortable = new Sortable($el);
            var $dragged = $el.find("li").eq(0);
            var $handle = $dragged.children(".sortable-handle");
            $handle.trigger("dragstart");
            expect($dragged.hasClass(sortable.options.dragClass)).toEqual(true);
        });

        it("adds a sortable handle to sortable elements", function() {
            var $lab = $("#lab");
            $lab.html(
                '<ul class="pat-sortable">' +
                    "    <li>1</li>" +
                    "    <li>2</li>" +
                    "    <li>3</li>" +
                    "    <li>4</li>" +
                    "</ul>"
            );
            registry.scan($lab);
            var $handles = $("li a.sortable-handle");
            expect($handles.length).toBe(4);
            if ("draggable" in document.createElement("span")) {
                expect($handles.attr("draggable"), "true");
            }
        });

        it("submits a form if there is a .sortable-amount input and .sortable-button-(up|down) buttons", function() {
            var $lab = $("#lab");
            $lab.html(
                "<form>" +
                    '    <ol class="pat-sortable" data-pat-sortable="selector: .sortable">' +
                    '        <li class="sortable" id="item1">' +
                    "            Item 1" +
                    '            <span class="button-cluster">' +
                    '                <button class="button sortable-button-up" type="submit" name="up_item_1" value="up" hidden>Up</button>' +
                    '                <button class="button sortable-button-down" type="submit" name="down_item_1" value="down" hidden>down</button>' +
                    "            </span>" +
                    "        </li>" +
                    '        <li class="sortable" id="item2">' +
                    "            Item 2" +
                    '            <span class="button-cluster">' +
                    '                <button class="button sortable-button-up" type="submit" name="up_item_2" value="up">Up</button>' +
                    '                <button class="button sortable-button-down" type="submit" name="down_item_2" value="down">down</button>' +
                    "            </span>" +
                    "        </li>" +
                    '        <li class="sortable" id="item3">' +
                    "            Item 3" +
                    '            <span class="button-cluster">' +
                    '                <button class="button sortable-button-up" type="submit" name="up_item_3" value="up">Up</button>' +
                    '                <button class="button sortable-button-down" type="submit" name="down_item_3" value="down">down</button>' +
                    "            </span>" +
                    "        </li>" +
                    "    </ol>" +
                    '    <input type="hidden" name="amount" class="sortable-amount" value="1"/>' +
                    "</form>"
            );
            registry.scan($lab);
            var $handles = $("li a.sortable-handle");
            expect($handles.length).toBe(3);
            var $form = $("form");

            $("#item3").prependTo($("ol")); // Simulate dragging it to the top.
            var submitCallback = jasmine.createSpy().and.returnValue(false);
            $form.submit(submitCallback);
            $("#item3 a.sortable-handle").trigger("dragend");
            expect($(".sortable-amount").attr("value")).toEqual("2");
            expect(submitCallback).toHaveBeenCalled();
        });
    });
});
