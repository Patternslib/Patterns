define(["pat-registry", "pat-validation"], function(registry, pattern) {

    describe("pat-validation", function() {
        beforeEach(function() {
            $("<div/>", {id: "lab"}).appendTo(document.body);
        });

        afterEach(function() {
            $("#lab").remove();
        });

        it("validates required inputs", function() {
            var $el = $(
                '<form class="pat-validation">'+
                '<input type="text" name="name" required="required">'+
                '</form>');
            pattern.init($el);
            $el.find(':input').trigger('change');
            expect($el.find('em.warning').length).toBe(1);

            // Check that validation passes when required is not here.
            $el = $(
                '<form class="pat-validation">'+
                '<input type="text" name="name">'+
                '</form>');
            $el.find(':input').trigger('change');
            expect($el.find('em.warning').length).toBe(0);
        });

        it("can show custom validation messages", function() {
            var $el = $(
                '<form class="pat-validation" data-pat-validation="message-required: I\'m sorry Dave, I can\'t let you do that.">'+
                    '<input type="text" name="name" required="required">'+
                '</form>');
            var $input = $el.find(':input');
            pattern.init($el);
            $input.trigger('change');
            expect($el.find('em.warning').length).toBe(1);
            expect($el.find('em.warning').text()).toBe("I'm sorry Dave, I can't let you do that.");
        });

        it("can show custom per-field validation messages", function() {
            var $el = $(
                '<form class="pat-validation" data-pat-validation="message-required: I\'m sorry Dave, I can\'t let you do that.">'+
                    '<input type="text" name="name" required="required" data-pat-validation="message-required: Computer says no">'+
                '</form>');
            var $input = $el.find(':input');
            pattern.init($el);
            $input.trigger('change');
            expect($el.find('em.warning').length).toBe(1);
            expect($el.find('em.warning').text()).toBe("Computer says no");
        });

        it("validates email inputs", function() {
            var $el = $(
                '<form class="pat-validation">'+
                    '<input type="email" name="email">'+
                '</form>');
            var $input = $el.find(':input');
            $input.val('invalid email');
            pattern.init($el);
            $input.trigger('change');
            expect($el.find('em.warning').length).toBe(1);
            expect($el.find('em.warning').text()).toBe("This value must be a valid email address");
            $el = $(
                '<form class="pat-validation">'+
                    '<input type="email" name="email">'+
                '</form>');
            $input = $el.find(':input');
            $input.val('person@mail.com');
            pattern.init($el);
            $input.trigger('change');
            expect($el.find('em.warning').length).toBe(0);
        });

        it("validates number limits", function() {
            var $el = $(
                '<form class="pat-validation">'+
                    '<input type="number" min="5" name="number">'+
                '</form>');
            var $input = $el.find(':input');
            $input.val(4);
            pattern.init($el);
            $input.trigger('change');
            expect($el.find('em.warning').length).toBe(1);
            expect($el.find('em.warning').text()).toBe("This value must be greater than or equal to 5");

            $input.val(6);
            pattern.init($el);
            $input.trigger('change');
            expect($el.find('em.warning').length).toBe(0);

            $el = $(
                '<form class="pat-validation">'+
                    '<input type="number" max="5" name="number">'+
                '</form>');
            $input = $el.find(':input');
            $input.val(6);
            pattern.init($el);
            $input.trigger('change');
            expect($el.find('em.warning').length).toBe(1);
            expect($el.find('em.warning').text()).toBe("This value must be less than or equal to 5");
        });

        it("validates integers", function() {
            var $el = $(
                '<form class="pat-validation">'+
                    '<input type="number" name="integer" data-pat-validation="type: integer;">'+
                '</form>');
            var $input = $el.find(':input');
            $input.val(4.5);
            pattern.init($el);
            $input.trigger('change');
            expect($el.find('em.warning').length).toBe(1);
            expect($el.find('em.warning').text()).toBe("This value must be an integer");

            $el = $(
                '<form class="pat-validation">'+
                    '<input type="number" name="integer"'+
                     'data-pat-validation="type: integer; message-integer: Slegs heelgetalle">'+
                '</form>');
            $input = $el.find(':input');
            $input.val(4.5);
            pattern.init($el);
            $input.trigger('change');
            expect($el.find('em.warning').length).toBe(1);
            expect($el.find('em.warning').text()).toBe("Slegs heelgetalle");
        });

        it("doesn't validate disabled elements", function() {
            var $el = $(
                '<form class="pat-validation">'+
                '<input type="text" name="disabled" required="required" disabled="disabled">'+
                '</form>');
            pattern.init($el);
            $el.find(':input').trigger('change');
            expect($el.find('em.warning').length).toBe(0);
        });

        it("validates radio buttons", function() {
            var $el = $(
                '<form class="pat-validation">'+
                    '<label><input name="colour" required="required" type="radio" value="blue"/> Blue</label>'+
                    '<label><input name="colour" required="required" type="radio" value="pink"/> Pink</label>'+
                    '<label><input name="colour" required="required" type="radio" value="red"/> Red</label>'+
                    '<label><input name="colour" required="required" type="radio" value="yellow"/> yellow</label>'+
                '</form>');
            pattern.init($el);
            $el.submit();
            expect($el.find('em.warning').length).toBe(1);
            expect($el.find('em.warning').text()).toBe("This field is required");

            $el.find('input')[0].checked = true;
            $el.on('submit', function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
            });
            $el.submit();
            expect($el.find('em.warning').length).toBe(0);
        });

        it("removes a field's error message if it becomes valid", function() {
            /* Check that an error message appears after the field with invalid data.
             * Also check that the message gets removed if the field's data
             * becomes valid, but that other messages are *not* removed.
             */
            var $el = $(
                '<form class="pat-validation">'+
                    '<input type="number" name="integer1" data-pat-validation="type: integer;">'+
                    '<input type="number" name="integer2" data-pat-validation="type: integer;">'+
                '</form>');
            var $input1 = $el.find(':input[name="integer1"]');
            $input1.val(4.5);
            pattern.init($el);
            $input1.trigger('change');
            expect($el.find('em.warning').length).toBe(1);
            expect($el.find('em.warning').text()).toBe("This value must be an integer");

            var $input2 = $el.find(':input[name="integer2"]');
            $input2.val(5.1);
            $input2.trigger('change');
            expect($el.find('em.warning').length).toBe(2);
            expect($input2.next('em.warning').length).toBe(1);
            expect($input2.next('em.warning').text()).toBe("This value must be an integer");

            $input2.val(5);
            $input2.trigger('change');
            expect($input2.next('em.warning').length).toBe(0);
            expect($input1.next('em.warning').length).toBe(1);
            expect($el.find('em.warning').length).toBe(1);
        });

        it("can disable certain form elements when validation fails", function() {
            /* Tests the disable-selector argument */
            var $el = $(
                '<form class="pat-validation" data-pat-validation="disable-selector:#form-buttons-create">'+
                    '<input type="number" name="integer" data-pat-validation="type: integer;">'+
                    '<button id="form-buttons-create" type="submit">Submit</button>'+
                '</form>');
            $('#lab').append($el);
            var $input = $el.find(':input');
            $input.val(4.5);
            pattern.init($el);
            $input.trigger('change');
            expect($el.find('em.warning').length).toBe(1);
            expect($el.find('em.warning').text()).toBe("This value must be an integer");
            expect($el.find('#form-buttons-create')[0].disabled).toBe(true);

            $input.val(5);
            $input.trigger('change');
            expect($el.find('em.warning').length).toBe(0);
            expect($el.find('#form-buttons-create')[0].disabled).toBe(false);
        });
    });
});
