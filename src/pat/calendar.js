/**
 * Patterns calendar - Calendar with different views for patterns.
 *
 * Copyright 2013 Marko Durkovic
 */
define([
    'jquery',
    '../core/logger',
    '../core/parser',
    '../utils',
    '../registry',
    '../lib/dnd',
    'jquery.fullcalendar'
], function($, logger, Parser, utils, registry, dnd) {
    'use strict';

    var log = logger.getLogger('calendar'),
        parser = new Parser('calendar');

    parser.add_argument('height', 'auto');
    parser.add_argument('time');
    parser.add_argument('time-format', 'h(:mm)t');
    parser.add_argument('title-month', 'MMMM yyyy');
    parser.add_argument('title-week', 'MMM d[ yyyy]{ &#8212; [ MMM] d yyyy}');
    parser.add_argument('title-day', 'dddd, MMM d, yyyy');
    parser.add_argument('column-month', 'ddd');
    parser.add_argument('column-week', 'ddd M/d');
    parser.add_argument('column-day', 'dddd M/d');
    parser.add_argument('first-day', '0');

    var _ = {
        name: 'calendar',
        trigger: '.pat-calendar',

        init: function($el) {
            var cfg = parser.parse($el),
                calOpts = {
                    header: false,
                    droppable: true,
                    drop: function(date, allDay, event, undef, view) {
                        var $this = $(this),
                            $ev = $this.hasClass('cal-event') ?
                                $this : $this.parents('.cal-event'),
                            $cal = $(view.element).parents('.pat-calendar');

                        $ev.appendTo($cal.find('.cal-events'));
                        var $start = $ev.find('.start');
                        if (!$start.length) {
                            $('<time class="start"/>').attr('datetime', date)
                                .appendTo($ev);
                        }
                        var $end = $ev.find('.end');
                        if (!$end.length) {
                            $('<time class="end"/>').appendTo($ev);
                        }

                        if (allDay) {
                            $ev.addClass('all-day');
                        } else {
                            $ev.removeClass('all-day');
                        }
                        $cal.fullCalendar('refetchEvents');
                    },
                    events: function(start, end, callback) {
                        var events = _.parseEvents($el);
                        callback(events);
                    },
                    axisFormat: cfg.timeFormat,
                    timeFormat: cfg.timeFormat,
                    titleFormat: cfg.title,
                    columnFormat: cfg.column,
                    ignoreTimezone: false,
                    viewRender: _.highlightButtons
                };

            var ym = cfg.time || $el.find('time').first().attr('datetime');
            if (ym) {
                ym = ym.split('-');
                calOpts.year = ym[0];
                calOpts.month = Number(ym[1]) - 1;
            }

            if (cfg.height !== 'auto') {
                calOpts.height = cfg.height;
            }

            var dayNames = [ 'su', 'mo', 'tu', 'we', 'th', 'fr', 'sa' ];
            if (dayNames.indexOf(cfg.firstDay) >= 0) {
                calOpts.firstDay = dayNames.indexOf(cfg.firstDay);
            }

            $el.fullCalendar(calOpts);

            // move to end of $el
            $el.find('.fc-content').appendTo($el);

            if (cfg.height === 'auto') {
                $el.fullCalendar('option', 'height',
                    $el.find('.fc-content').height());

                $(window).on('resize.pat-calendar', function() {
                    if ($el.fullCalendar('getView').name === 'month') {
                        $el.fullCalendar('option', 'height',
                            $el.find('.fc-content').height());
                    }
                });
            }

            // update title
            $el.find('.cal-title').text($el.fullCalendar('getView').title);

            $el.find('.view-month').addClass('active');


            $el.find('.jump-next').on('click', function() {
                $el.fullCalendar('next');
                $el.find('.cal-title').html($el.fullCalendar('getView').title);
            });
            $el.find('.jump-prev').on('click', function() {
                $el.fullCalendar('prev');
                $el.find('.cal-title').html($el.fullCalendar('getView').title);
            });
            $el.find('.jump-today').on('click', function() {
                $el.fullCalendar('today');
                $el.find('.cal-title').html($el.fullCalendar('getView').title);
            });
            $el.find('.view-month').on('click', function() {
                $el.fullCalendar('changeView', 'month');
                $el.find('.cal-title').html($el.fullCalendar('getView').title);
                if (cfg.height === 'auto') {
                    $el.fullCalendar('option', 'height',
                        $el.find('.fc-content').height());
                }
            });
            $el.find('.view-week').on('click', function() {
                $el.fullCalendar('changeView', 'agendaWeek');
                $el.find('.cal-title').html($el.fullCalendar('getView').title);
                if (cfg.height === 'auto') {
                    $el.fullCalendar('option', 'height', null);
                }
            });
            $el.find('.view-day').on('click', function() {
                $el.fullCalendar('changeView', 'agendaDay');
                $el.find('.cal-title').html($el.fullCalendar('getView').title);
                if (cfg.height === 'auto') {
                    $el.fullCalendar('option', 'height', null);
                }
            });

            var refetch = function() {
                $el.fullCalendar('refetchEvents');
            };
            var refetch_deb = utils.debounce(refetch, 400);

            var $filter = $el.find('.filter');
            if ($filter && $filter.length > 0) {
                $('.search-text', $filter).on('keyup', refetch_deb);
                $('.search-text[type=search]', $filter).on('click', refetch_deb);
                $('select[name=state]', $filter).on('change', refetch);
                $('.check-list', $filter).on('change', refetch);
            }

            $el.find('.cal-events').css('display', 'none');

            // make .cal-event elems draggable
            dnd.draggable($('.cal-events .cal-event'));

            // emulate jQueryUI dragstop and mousemove during drag.
            $('.cal-events .cal-event').on('dragend', function() {
                $(this).trigger('dragstop');
            });
            $el.on('dragover', function(event) {
                event.type = 'mousemove';
                $(document).trigger(event);
            });
        },

        highlightButtons: function(view, element) {
            var $el = element.parents('.pat-calendar').first(),
                $today = $el.find('.jump-today');
            $today.removeClass('active');
            if (view.name === 'agendaDay') {
                var calDate = $el.fullCalendar('getDate'),
                    today = new Date();
                if (calDate.getDate() === today.getDate() &&
                    calDate.getMonth() === today.getMonth() &&
                    calDate.getYear() === today.getYear()) {
                    $today.addClass('active');
                }
            }

            var classMap = {
                month: '.view-month',
                agendaWeek: '.view-week',
                agendaDay: '.view-day'
            };
            $el.find('.view-month').removeClass('active');
            $el.find('.view-week').removeClass('active');
            $el.find('.view-day').removeClass('active');
            $el.find(classMap[view.name]).addClass('active');
        },

        parseEvents: function($el) {
            var $events = $el.find('.cal-events'),
                $filter = $el.find('.filter'),
                searchText,
                regex;

            // parse filters
            if ($filter && $filter.length > 0) {
                searchText = $('.search-text', $filter).val();
                regex = new RegExp(searchText, 'i');
            }

            var events = $events.find('.cal-event').filter(function() {
                var $event = $(this);

                if (searchText && !regex.test($event.find('.title').text())) {
                    log.debug('remove due to search-text='+searchText, $event);
                    return false;
                }
                return true;
            }).map(function(idx, event) {
                var attr, i;

                // classNames: all event classes without 'event' + anchor classes
                var classNames = $(event).attr('class').split(/\s+/)
                    .filter(function(cls) { return (cls !== 'cal-event'); })
                    .concat($('a', event).attr('class').split(/\s+/));

                // attrs: all 'data-' attrs from anchor
                var allattrs = $('a', event)[0].attributes,
                    attrs = {};
                for (attr, i=0; i<allattrs.length; i++){
                    attr = allattrs.item(i);
                    if (attr.nodeName.slice(0,5) === 'data-') {
                        attrs[attr.nodeName] = attr.nodeValue;
                    }
                }

                var location = ($('.location', event).html() || '').trim();

                var ev = {
                    title: $('.title', event).text().trim() +
                        (location ? (' (' + location + ')') : ''),
                    start: $('.start', event).attr('datetime'),
                    end: $('.end', event).attr('datetime'),
                    allDay: $(event).hasClass('all-day'),
                    url: $('a', event).attr('href'),
                    className: classNames,
                    attrs: attrs,
                    editable: $(event).hasClass('editable')
                };
                if (!ev.title) {
                    log.error('No event title for:', event);
                }
                if (!ev.start) {
                    log.error('No event start for:', event);
                }
                if (!ev.url) {
                    log.error('No event url for:', event);
                }
                return ev;
            }).toArray();
            return events;
        }
    };

    registry.register(_);
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
