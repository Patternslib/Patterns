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
    'jquery.fullcalendar'
], function($, logger, Parser, utils, registry) {
    'use strict';

    var log = logger.getLogger('calendar'),
        parser = new Parser('calendar');

    parser.add_argument('height');
    parser.add_argument('time');

    var _ = {
        name: 'calendar',
        trigger: '.pat-calendar',

        init: function($el) {
            var cfg = parser.parse($el),
                calOpts = {
                    header: false,
                    events: function(start, end, callback) {
                        var $events, $filter;
                        var events = _.parseEvents($el);
                        callback(events);
                    }
                };

            var ym = cfg.time || $el.find('time').first().attr('datetime');
            if (ym) {
                ym = ym.split('-');
                calOpts.year = ym[0];
                calOpts.month = Number(ym[1]) - 1;
            }
            console.log(calOpts.month);

            if (cfg.height) {
                calOpts.height = cfg.height;
            }
            $el.fullCalendar(calOpts);

            var cal = $el.data('fullCalendar');

            // move to end of $el
            $el.find('.fc-content').appendTo($el);

            // update title
            $el.find('.cal-title').text($el.fullCalendar('getView').title);

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
            });
            $el.find('.view-week').on('click', function() {
                $el.fullCalendar('changeView', 'basicWeek');
                $el.find('.cal-title').html($el.fullCalendar('getView').title);
            });
            $el.find('.view-day').on('click', function() {
                $el.fullCalendar('changeView', 'basicDay');
                $el.find('.cal-title').html($el.fullCalendar('getView').title);
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

            $el.find('.events').css('display', 'none');
        },

        parseEvents: function($el) {
            var $events = $el.find('.events'),
                $filter = $el.find('.filter'),
                searchText,
                regex;

            // parse filters
            if ($filter && $filter.length > 0) {
                searchText = $('.search-text', $filter).val();
                regex = new RegExp(searchText, 'i');
            }

            var events = $events.find('.event').filter(function() {
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
                    .filter(function(cls) { return (cls !== 'event'); })
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
                    title: $('.title', event).html().trim() +
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
