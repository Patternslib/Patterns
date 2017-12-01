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

        it("will replace #{1} in element attributes with the number of the clone", function() {
            var $lab = $('#lab');
            $lab.html(
                '<div class="pat-clone">' +
                '    <p class="legend clone clone#{1}" hidden name="item-#{1}">Family member #{1}</p>' +
                '</div>' +
                '<button class="add-clone">Clone!</button>');
            registry.scan($lab);
            expect($('p.legend').length).toBe(1);
            expect($('p.legend:last').attr('class')).toBe('legend clone clone#{1}');

            $lab.find('.add-clone').click();
            expect($('p.legend').length).toBe(2);
            expect($('p.legend:last').attr('name')).toBe('item-2');
            expect($('p.legend:last').attr('class')).toBe('legend clone clone2');

            $lab.find('.add-clone').click();
            expect($('p.legend').length).toBe(3);
            expect($('p.legend:last').attr('name')).toBe('item-3');
            expect($('p.legend:last').attr('class')).toBe('legend clone clone3');
        });

        it("will replace #{1} in the element id with the number of the clone and remove ids without the substring #{1}", function() {
            var $lab = $('#lab');
            $lab.html(
                '<div class="pat-clone">' +
                '    <p id="hello world#{1}" class="clone legend clone#{1}" name="item-#{1}">Family member #{1}</p>' +
                '</div>' +
                '<button class="add-clone">Clone!</button>');
            registry.scan($lab);
            expect($('p.legend').length).toBe(1);
            expect($('p.legend:last').attr('id')).toBe('hello world#{1}');

            $lab.find('.add-clone').click();
            expect($('p.legend').length).toBe(2);
            expect($('p.legend:last').attr('id')).toBe('world2');

            $lab.find('.add-clone').click();
            expect($('p.legend').length).toBe(3);
            expect($('p.legend:last').attr('id')).toBe('world3');
        });

        it("has a \"clone-element\" argument which is necessary when starting with pre-existing clones", function() {
            spyOn(window, 'confirm').and.callFake(function () {
                return true;
            });
            var $lab = $('#lab');
            $lab.html(
                '<div class="pat-clone" data-pat-clone="clone-element: .item">' +
                '    <div class="item"><button type="button" class="remove-clone">Remove</button></div>' +
                '    <div class="item"><button type="button" class="remove-clone">Remove</button></div>' +
                '    <div class="item"><button type="button" class="remove-clone">Remove</button></div>' +
                '</div>' +
                '<button class="add-clone">Clone!</button>');
            registry.scan($lab);
            expect($('div.item').length).toBe(3);

            $lab.find('.add-clone').click();
            expect($('div.item').length).toBe(4);

            $lab.find('.remove-clone:last').click();
            expect($('div.item').length).toBe(3);

            $lab.find('.remove-clone:last').click();
            expect($('div.item').length).toBe(2);

            $lab.find('.remove-clone:last').click();
            expect($('div.item').length).toBe(1);

            $lab.find('.remove-clone:last').click();
            expect($('div.item').length).toBe(0);
        });

        it("will remove a clone when .remove-clone inside the clone is clicked.", function() {
            var spy_window = spyOn(window, 'confirm').and.callFake(function () {
                return true;
            });
            var $lab = $('#lab');
            $lab.html(
                '<div class="pat-clone" data-pat-clone="clone-element: .item">' +
                '    <div class="item"><button type="button" class="remove-clone">Remove</button></div>' +
                '</div>' +
                '<button class="add-clone">Clone!</button>');
            registry.scan($lab);
            expect($('div.item').length).toBe(1);

            $lab.find('.add-clone').click();
            expect($('div.item').length).toBe(2);

            $lab.find('.remove-clone:last').click();
            expect(spy_window).toHaveBeenCalled();
            expect($('div.item').length).toBe(1);

            $lab.find('.remove-clone').click();
            expect(spy_window).toHaveBeenCalled();
            expect($('div.item').length).toBe(0);
        });

        it("allows the remove element to be configured", function() {
            var spy_window = spyOn(window, 'confirm').and.callFake(function () {
                return true;
            });
            var $lab = $('#lab');
            $lab.html(
                '<div class="pat-clone" data-pat-clone="clone-element: .item; remove-element: .custom-remove-class;">' +
                '    <div class="item"><button type="button" class="custom-remove-class">Remove</button></div>' +
                '</div>' +
                '<button class="add-clone">Clone!</button>');
            registry.scan($lab);
            expect($('div.item').length).toBe(1);

            $lab.find('.add-clone').click();
            expect($('div.item').length).toBe(2);

            $lab.find('.custom-remove-class:last').click();
            expect(spy_window).toHaveBeenCalled();
            expect($('div.item').length).toBe(1);

            $lab.find('.custom-remove-class').click();
            expect(spy_window).toHaveBeenCalled();
            expect($('div.item').length).toBe(0);
        });

        it("will by default ask for confirmation before removing elements, but can be configured otherwise", function() {
            var spy_confirm = spyOn(window, 'confirm').and.callFake(function () {
                return true;
            });
            var $lab = $('#lab');
            $lab.html(
                '<div class="pat-clone" data-pat-clone="clone-element: .item; remove-behaviour: confirm">' +
                '    <div class="item"><button type="button" class="remove-clone">Remove</button></div>' +
                '</div>' +
                '<button class="add-clone">Clone!</button>');
            registry.scan($lab);
            expect($('div.item').length).toBe(1);

            $lab.find('.add-clone').click();
            expect($('div.item').length).toBe(2);

            $lab.find('.remove-clone:last').click();
            expect(spy_confirm).toHaveBeenCalled();
            expect(window.confirm.calls.count()).toBe(1);
            expect($('div.item').length).toBe(1);

            $lab.empty();
            $lab.html(
                '<div class="pat-clone" data-pat-clone="clone-element: .item; remove-behaviour: none">' +
                '    <div class="item"><button type="button" class="remove-clone">Remove</button></div>' +
                '</div>' +
                '<button class="add-clone">Clone!</button>');
            registry.scan($lab);
            expect($('div.item').length).toBe(1);

            $lab.find('.add-clone').click();
            expect($('div.item').length).toBe(2);

            $lab.find('.remove-clone:last').click();
            expect(window.confirm.calls.count()).toBe(1);
            expect($('div.item').length).toBe(1);
        });
    });
});
