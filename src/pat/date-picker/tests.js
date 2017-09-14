define(['pat-date-picker'], function(pattern) {

    describe('pat-date-picker', function() {

        beforeEach(function () {
            $('<link href="src/pat/date-picker/date-picker.css" rel="stylesheet"/>').appendTo(document.head);
        });
        afterEach(function () {
            //$('head link[href$="date-picker.css"').remove();
            $('input.pat-date-picker').remove();
            $('.pika-single, .pika-lendar').remove();
        });

        it('Default date picker.', function () {
            var $pika = $('<input type="date" class="pat-date-picker"/>').appendTo(document.body);
            pattern.init($pika);
            $pika.click();

            var date = new Date();
            var day = date.getDate().toString();
            var month = (date.getMonth()).toString();  // remember, month-count starts from 0
            var year = date.getFullYear().toString();

            // TODO: I'd love to set the date via the UI but I  can't get day.click() to have any effect...

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


        it('Date picker with pre-set value.', function () {
            var $pika = $('<input type="date" class="pat-date-picker" value="1900-01-01"/>').appendTo(document.body);
            pattern.init($pika);
            $pika.click();

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

        it('Date picker with week numbers.', function () {
            var $pika = $('<input type="date" class="pat-date-picker" data-pat-date-picker="week-numbers: show;" value="2017-09-18"/>').appendTo(document.body);
            pattern.init($pika);
            $pika.click();

            expect(
                document.querySelectorAll('.pika-lendar .pika-week')[0].textContent
            ).toBe('35');

        });

    });
});
