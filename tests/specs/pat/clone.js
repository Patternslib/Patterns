define(["pat-registry", "pat-clone"], function(registry) {

    describe("pat-clone", function() {
        beforeEach(function() {
            $("div#lab").remove();
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });
        afterEach(function() {
            $("#lab").remove();
        });

        it("clones the node's first child when .add-clone is clicked and places the clone after the cloned element", function() {
            var $lab = $('#lab');
            $lab.html(
                '<div class="pat-clone">' +
                '    <div class="item">Clone Me</div>' +
                '    <button class="add-clone">Clone!</button>' +
                '</div>');
            registry.scan($lab);
            expect($('div.item').length).toBe(1);
            $lab.find('.add-clone').click();
            expect($('div.item').length).toBe(2);

            // Try now a different variation with the trigger inside the cloned
            // element.
            $lab.empty().html(
                '<div class="pat-clone">' +
                '    <div class="item">' +
                '       <button class="add-clone">Clone!</button>' +
                '    </div>' +
                '</div>');
            registry.scan($lab);
            expect($('div.item').length).toBe(1);
            $lab.find('.add-clone').click();
            expect($('div.item').length).toBe(2);
            $lab.find('.add-clone:last').click();
            expect($('div.item').length).toBe(3);
            $lab.find('.add-clone:first').click();
            expect($('div.item').length).toBe(4);
        });

        it("allows the trigger element to be configured", function() {
            var $lab = $('#lab');
            $lab.html(
                '<div class="pat-clone" data-pat-clone="trigger-element: .real-add-clone;">' +
                '    <div class="item">Clone Me</div>' +
                '    <button class="add-clone">Will not Clone!</button>' +
                '    <button class="real-add-clone">Clone!</button>' +
                '</div>');
            registry.scan($lab);
            expect($('div.item').length).toBe(1);
            $lab.find('.add-clone').click();
            expect($('div.item').length).toBe(1);
            $lab.find('.real-add-clone').click();
            expect($('div.item').length).toBe(2);
        });

        it("allows the cloned element to be configured", function() {
            var $lab = $('#lab');
            $lab.html(
                '<div class="pat-clone" data-pat-clone="template: #my-template">' +
                '    <div class="item">Original item</div>' +
                '    <div class="item" id="my-template">Clone template</div>' +
                '</div>' +
                '<button class="add-clone">Clone!</button>');
            registry.scan($lab);
            expect($('div.item').length).toBe(2);
            $lab.find('.add-clone').click();
            expect($('div.item').length).toBe(3);
            expect($('div.item:last').text()).toBe('Clone template');
            expect($("div.item:contains('Clone template')").length).toBe(2);
        });

        it("will automatically increment any number in name and value attributes.", function() {
            var $lab = $('#lab');
            $lab.html(
                '<div class="pat-clone">' +
                '    <p class="legend" name="item-#{1}">Family member #{1}</p>' +
                '</div>' +
                '<button class="add-clone">Clone!</button>');
            registry.scan($lab);
            expect($('p.legend').length).toBe(1);

            $lab.find('.add-clone').click();
            expect($('p.legend').length).toBe(2);
            expect($('p.legend:last').attr('name')).toBe('item-2');

            $lab.find('.add-clone').click();
            expect($('p.legend').length).toBe(3);
            expect($('p.legend:last').attr('name')).toBe('item-3');
        });

        it("will remove a clone when .remove-clone inside the clone is clicked.", function() {
            var $lab = $('#lab');
            $lab.html(
                '<div class="pat-clone">' +
                '    <div class="item"><button type="button" class="remove-clone">Remove</button></div>' +
                '</div>' +
                '<button class="add-clone">Clone!</button>');
            registry.scan($lab);
            expect($('div.item').length).toBe(1);

            $lab.find('.add-clone').click();
            expect($('div.item').length).toBe(2);

            $lab.find('.remove-clone:last').click();
            expect($('div.item').length).toBe(1);

            $lab.find('.remove-clone').click();
            expect($('div.item').length).toBe(0);
        });

        it("allows the remove element to be configured", function() {
            var $lab = $('#lab');
            $lab.html(
                '<div class="pat-clone" data-pat-clone="remove-element: .custom-remove-class;">' +
                '    <div class="item"><button type="button" class="custom-remove-class">Remove</button></div>' +
                '</div>' +
                '<button class="add-clone">Clone!</button>');
            registry.scan($lab);
            expect($('div.item').length).toBe(1);

            $lab.find('.add-clone').click();
            expect($('div.item').length).toBe(2);

            $lab.find('.custom-remove-class:last').click();
            expect($('div.item').length).toBe(1);

            $lab.find('.custom-remove-class').click();
            expect($('div.item').length).toBe(0);
        });
    });
});
