define(['pat-datetime-picker'], function(pattern) {

    describe('pat-datetime-picker', function() {

        beforeEach(function () {
            $('<link href="src/pat/datetime-picker/datetime-picker.css" rel="stylesheet"/>').appendTo(document.head);
        });
        afterEach(function () {
            //$('head link[href$="date-picker.css"').remove();
            $('input.pat-datetime-picker').remove();
            $('.datetime-picker-wrapper').remove();
            $('.pika-single, .pika-lendar').remove();
        });

        it('Default datetime picker.', function () {
            var $el = $('<input type="datetime-local" class="pat-datetime-picker"/>').appendTo(document.body);
            pattern.init($el);

            $('input.date', $el.next()).click();

            var date = new Date();
            var day = date.getDate().toString();
            var month = (date.getMonth()).toString();  // remember, month-count starts from 0
            var year = date.getFullYear().toString();

            expect(
                document.querySelector('.pika-lendar .pika-select-year option[selected="selected"]').textContent
            ).toBe(year);

            expect(
                document.querySelector('.pika-lendar .pika-select-month option[selected="selected"]').value
            ).toBe(month);

            expect(
                document.querySelector('.pika-lendar td.is-today button').getAttribute('data-pika-day')
            ).toBe(day);

        });


        it('Date/Time picker with pre-set value.', function () {
            var $el = $('<input type="datetime-local" class="pat-datetime-picker" value="1900-01-01T00:00"/>').appendTo(document.body);
            pattern.init($el);

            $('input.date', $el.next()).click();

            expect(
                document.querySelector('.pika-lendar .pika-select-year option[selected="selected"]').textContent
            ).toBe('1900');

            expect(
                document.querySelector('.pika-lendar .pika-select-month option[selected="selected"]').value
            ).toBe('0');

            expect(
                document.querySelector('.pika-lendar td.is-selected button').getAttribute('data-pika-day')
            ).toBe('1');

        });

        it('Date/Time picker with week numbers.', function () {
            var $el = $('<input type="datetime-local" class="pat-datetime-picker" data-pat-datetime-picker="week-numbers: show;" value="2017-09-18T23:42"/>').appendTo(document.body);
            pattern.init($el);

            $('input.date', $el.next()).click();

            expect(
                document.querySelectorAll('.pika-lendar .pika-week')[0].textContent
            ).toBe('35');

        });

        it('Set Date/Time to today.', function () {

            var baseDate = new Date('2010-10-10T12:34:00.000Z');

            spyOn(window, 'Date').and.callFake(function() {
                return {
                    toTimeString: function () {
                        return baseDate.toTimeString();
                    },
                    toISOString: function () {
                        return baseDate.toISOString();
                    }
                };
            });

            var $el = $('<input type="datetime-local"/>').appendTo(document.body);
            pattern.init($el);
            var $wrapper = $el.next();
            var $date = $('input.date', $wrapper);
            var $time = $('input.time', $wrapper);

            expect($el.val()).toBe('');
            expect($date.val()).toBe('');
            expect($time.val()).toBe('');

            $('button.today', $wrapper).click();

            expect($el.val()).toBe('2010-10-10T12:34');
            expect($date.val()).toBe('2010-10-10');
            expect($time.val()).toBe('12:34');

        });



    });
});
