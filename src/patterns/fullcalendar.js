define([
    'require',
    '../lib/jquery',
    '../lib/fullcalendar'
], function(require) {
    var fullcalendar = {
        initContent: function(root) {
            var $calroot = $(root).find('.full-calendar');
            if (!$calroot || $calroot.length === 0) return;

            // XXX: should be within the calendar
            var $filter = $('.calendar-filters');
            var initMonths = function($root) {
                if ($root.hasClass('month')) {
                    fullcalendar.initMonth($root, $filter);
                } else {
                    $root.find('.month').each(function() {
                        fullcalendar.initMonth($(this), $filter);
                    });
                }
            };

            // hide all checkboxes, will be shown if mentioned
            $filter.find('.check-list label').hide();

            // initialize existing months
            initMonths($calroot);

            // wait for additional months
            $calroot.bind('inject', function(ev, opts) {
                initMonths($(ev.target));
            });
            $calroot.bind('injection', function(event, month) {
                initMonths($(month));
            });
        },
        initMonth: function($month, $filter) {
            var $events = $('.events', $month);
            if ($events.length === 0) { return; }
            var ym = $('time', $month).attr('datetime').split('-'),
                year = ym[0],
                month = Number(ym[1]) - 1,
                $calendar = $('<div class="calendar">\n</div>')
                    .insertAfter($events),
                mapal = require('../core/init');
            var refetch = function() {
                $calendar.fullCalendar('refetchEvents');
                // XXX: replace with mutator event listener
                mapal.initContent($calendar);
            };
            var refetch_deb = _.debounce(refetch, 400);
            if ($filter && $filter.length > 0) {
                $('.searchText', $filter).on("keyup", refetch_deb);
                $('.searchText[type=search]', $filter).on("click", refetch_deb);
                $('select[name=state]', $filter).on("change", refetch);
            }
            $events.css('display', 'None');
            $calendar.fullCalendar({
                dayDblClick: function(date, allDay, jsEvent, view) {
                    // XXX: add event
                },
                events: function(start, end, callback) {
                    var events = fullcalendar.parseEvents($events, $filter);
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
                header: { left: '', right: '' },
                month: month,
                year: year
            });
            mapal.initContent($calendar);
        },
        parseEvents: function($events, $filter) {
            // show groups that are mentioned
            $events.each(function(idx, event) {
                $('.attendees .group', event).each(function(idx, group) {
                    var name = $(group).attr('id').replace(/_._/g, ' ').slice(6);
                    $filter.find('.check-list label:has([name="' + name + '"])').show();
                });
            });

            // OPTINAL: go through other filters and gray out groups that would
            // result in zero matches

            // apply filters to source
            if ($filter && $filter.length > 0) {
                var searchText = $('.searchText', $filter).val();
                var state = $('select[name=state]').val();
            }
            var events = $(
                '.event'
                    + ((state && state !== "all") ? ('.state-' + state) : '')
                    + (searchText ? (':Contains(' + searchText + ')') : ''),
                $events
            ).map(function(idx, event) {
                var classNames = $(event).attr('class').split(/\s+/).filter(function(cls) {
                    return (cls !== 'event');
                }).concat($('a', event).attr('class').split(/\s+/));
                var allattrs = $('a', event)[0].attributes,
                    attrs = {};
                for (var attr, i=0; i<allattrs.length; i++){
                    attr = allattrs.item(i);
                    if (attr.nodeName.slice(0,5) === "data-") {
                        attrs[attr.nodeName] = attr.nodeValue;
                    }
                }
                var location = ($('.location', event).html() || '').trim();
                var ev = {
                    title: $('.title', event).html().trim()
                        + (location ? (' (' + location + ')') : ''),
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
    };
    return fullcalendar;
});
