define(["pat-date-picker"], function(pattern) {
    describe("pat-date-picker", function() {
        beforeEach(function() {
            $(
                '<link href="src/pat/date-picker/date-picker.css" rel="stylesheet"/>'
            ).appendTo(document.head);
        });
        afterEach(function() {
            //$('head link[href$="date-picker.css"').remove();
            $("input.pat-date-picker").remove();
            $(".pika-single, .pika-lendar").remove();
        });

        it("Default date picker.", function() {
            var $pika = $(
                '<input type="date" class="pat-date-picker"/>'
            ).appendTo(document.body);
            pattern.init($pika);
            $pika.click();

            var date = new Date();
            var day = date.getDate().toString();
            var month = date.getMonth().toString(); // remember, month-count starts from 0
            var year = date.getFullYear().toString();

            // TODO: I'd love to set the date via the UI but I  can't get day.click() to have any effect...

            expect(
                document.querySelector(
                    '.pika-lendar .pika-select-year option[selected="selected"]'
                ).textContent
            ).toBe(year);

            expect(
                document.querySelector(
                    '.pika-lendar .pika-select-month option[selected="selected"]'
                ).value
            ).toBe(month);

            expect(
                document
                    .querySelector(".pika-lendar td.is-today button")
                    .getAttribute("data-pika-day")
            ).toBe(day);

            expect(
                document.querySelector(".pika-lendar th:first-child abbr")
                    .textContent
            ).toBe("Sun");
        });

        it("Date picker starts at Monday.", function() {
            var $pika = $(
                '<input type="date" class="pat-date-picker" data-pat-date-picker="first-day: 1" />'
            ).appendTo(document.body);
            pattern.init($pika);
            $pika.click();

            expect(
                document.querySelector(".pika-lendar th:first-child abbr")
                    .textContent
            ).toBe("Mon");
        });

        it("Date picker with pre-set value.", function() {
            var $pika = $(
                '<input type="date" class="pat-date-picker" value="1900-01-01"/>'
            ).appendTo(document.body);
            pattern.init($pika);
            $pika.click();

            expect(
                document.querySelector(
                    '.pika-lendar .pika-select-year option[selected="selected"]'
                ).textContent
            ).toBe("1900");

            expect(
                document.querySelector(
                    '.pika-lendar .pika-select-month option[selected="selected"]'
                ).value
            ).toBe("0");

            expect(
                document
                    .querySelector(".pika-lendar td.is-selected button")
                    .getAttribute("data-pika-day")
            ).toBe("1");
        });

        it("Date picker with week numbers.", function() {
            var $pika = $(
                '<input type="date" class="pat-date-picker" data-pat-date-picker="week-numbers: show;" value="2017-09-18"/>'
            ).appendTo(document.body);
            pattern.init($pika);
            $pika.click();

            expect(
                document.querySelectorAll(".pika-lendar .pika-week")[0]
                    .textContent
            ).toBe("35");
        });

        describe("Date picker with i18n", function() {
            var i18n;
            var url;

            describe("with proper json URL", function() {
                var deferred;

                beforeEach(function(done) {
                    url = "/src/pat/date-picker/i18n.json";
                    i18n = undefined;

                    deferred = new $.Deferred();
                    $.getJSON(url)
                        .done(function(data) {
                            i18n = data;
                        })
                        .always(function() {
                            done();
                        });
                });

                it("properly localizes the months and weekdays", function() {
                    var $pika = $(
                        '<input type="date" class="pat-date-picker" value="2018-10-21" data-pat-date-picker="i18n: ' +
                            url +
                            '" />'
                    ).appendTo(document.body);
                    spyOn($, "ajax").and.returnValue(deferred);
                    pattern.init($pika);
                    deferred.resolve(i18n);
                    $pika.click();

                    var ajaxargs = $.ajax.calls.mostRecent().args[0];
                    expect(ajaxargs.url).toEqual(url);
                    expect(i18n).toBeDefined();
                    expect(
                        document.querySelector(
                            '.pika-lendar .pika-select-month option[selected="selected"]'
                        ).textContent
                    ).toBe("Oktober");
                });
            });

            describe("with bogus json URL", function() {
                var deferred;
                var errjqxhr;
                var errstatus;
                var errthrown;

                beforeEach(function(done) {
                    url = "this404isExpected";
                    i18n = undefined;
                    deferred = new $.Deferred();

                    $.getJSON(url)
                        .done(function(data) {
                            i18n = data;
                        })
                        .fail(function(jqxhr, status, errorThrown) {
                            errjqxhr = jqxhr;
                            errstatus = status;
                            errthrown = errorThrown;
                            done();
                        });
                });

                it("falls back to default (english) month and weekday labels ", function() {
                    var $pika = $(
                        '<input type="date" class="pat-date-picker" value="2018-10-21" data-pat-date-picker="i18n: ' +
                            url +
                            '" />'
                    ).appendTo(document.body);
                    spyOn($, "ajax")
                        .and.callThrough()
                        .and.returnValue(deferred);
                    pattern.init($pika);
                    deferred.reject();
                    $pika.click();

                    var ajaxargs = $.ajax.calls.mostRecent().args[0];
                    expect(ajaxargs.url).toEqual(url);
                    expect(i18n).toBeUndefined();
                    expect(errstatus).toEqual("error");
                    expect(errthrown).toEqual("Not Found");
                    expect(
                        document.querySelector(
                            '.pika-lendar .pika-select-month option[selected="selected"]'
                        ).textContent
                    ).toBe("October");
                });
            });
        });
    });
});
