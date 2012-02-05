define([
    'require',
    '../lib/jquery',
    '../lib/fullcalendar'
], function(require) {
    var fullcalendar = {
        initContent: function(root) {
            $(root).find('.full-calendar').each(function() {
                var $this = $(this),
                    $calendar = $('<div class="calendar">\n</div>')
                        .insertAfter(this),
                    events = fullcalendar.parseEvents(root);
                $this.css('display', 'None');
                $calendar.fullCalendar({
                    events: events
                });
            });
        },
        parseEvents: function(root) {
            var events = $('.event', root).map(function(idx, event) {
                return {
                    title: $('.title', event).html().trim(),
                    start: $('.start', event).attr('datetime'),
                    end: $('.end', event).attr('datetime'),
                    allDay: $(event).hasClass('all-day'),
                    url: $('a', event).attr('href')
                };
            }).toArray();
            return events;
        }
    };
    return fullcalendar;
});
