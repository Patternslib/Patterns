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
                        .insertAfter(this);
                $this.css('display', 'None');
                $calendar.fullCalendar({});
            });
        }
    };
    return fullcalendar;
});
