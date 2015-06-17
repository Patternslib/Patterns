define(["pat-registry", "pat-sortable"], function(registry) {

    describe("pat-sortable", function() {
        beforeEach(function() {
            $("div#lab").remove();
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });
        afterEach(function() {
            $("#lab").remove();
        });

        it("adds a sortable handle to sortable elements", function() {
            var $lab = $('#lab');
            $lab.html(
                '<ul class="pat-sortable">'+
                '    <li>1</li>'+
                '    <li>2</li>'+
                '    <li>3</li>'+
                '    <li>4</li>'+
                '</ul>');
            registry.scan($lab);
            var $handles = $('li a.handle');
            expect($handles.length).toBe(4);
            if ("draggable" in document.createElement("span")) {
                expect($handles.attr("draggable"), "true");
            }
        });
    });
});
