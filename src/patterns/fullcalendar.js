define([
    'require',
    '../lib/jquery',
    '../jqueryPlugin!../lib/jquery.mutations/src/mutations.html',
    '../lib/fullcalendar'
], function(require) {
    var fullcalendar = {
        initContent: function(root) {
            $(root).find('.full-calendar .events').each(function() {
                var $this = $(this),
                    $calendar = $('<div class="calendar">\n</div>')
                        .insertAfter(this),
                    mapal = require('../core/init');
                $this.bind('html', function() {
                    $calendar.fullCalendar('refetchEvents');
                    // XXX: replace with mutator event listener
                    mapal.initContent($calendar);
                });
                $this.css('display', 'None');
                $calendar.fullCalendar({
                    dayDblClick: function(date, allDay, jsEvent, view) {
                        // XXX: add event
                    },
                    events: function(start, end, callback) {
                        var events = fullcalendar.parseEvents($this);
                        callback(events);
                    },
                    eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
                        // XXX: change event
                        revertFunc();
                    },
                    eventResize: function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view) {
                        // XXX: change event
                        revertFunc();
                    },
                    header: { left: '', right: '' }
                    // XXX: consume calendar-control and pass to fullCalendar
                });
            });
        },
        parseEvents: function(root) {
            var events = $('.event', root).map(function(idx, event) {
                var classNames = $(event).attr('class').split(/\s+/).filter(function(cls) {
                    return (cls !== 'event');
                });
                var allattrs = $('a', event)[0].attributes,
                    attrs = {};
                for (var attr, i=0; i<allattrs.length; i++){
                    attr = allattrs.item(i);
                    if (attr.nodeName.slice(0,5) === "data-") {
                        attrs[attr.nodeName] = attr.nodeValue;
                    }
                }
                var ev = {
                    title: $('.title', event).html().trim(),
                    start: $('.start', event).attr('datetime'),
                    end: $('.end', event).attr('datetime'),
                    allDay: $(event).hasClass('all-day'),
                    url: $('a', event).attr('href'),
                    className: classNames,
                    attrs: attrs,
                    editable: $(event).hasClass('editable')
                };
                if (!ev.title) console.error('No event title for:', event);
                if (!ev.start) console.error('No event start for:', event);
                if (!ev.url) console.error('No event url for:', event);
                return ev;
            }).toArray();
            return events;
        }
        // XXX: pimp fullcalendar to set further attributes
        // XXX: initContent on whatever fullcalendar creates
        // XXX: support update if original container changes
        // XXX: make hiding of original optional
        // XXX: provide solgemafullcalendar as alternative, use fullcalendar as fallback or sth like that
    };
    return fullcalendar;
});
