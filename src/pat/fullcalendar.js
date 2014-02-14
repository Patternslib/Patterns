define([
    "jquery",
    "pat-logger",
    "pat-utils",
    "pat-registry",
    "jquery.fullcalendar"
], function($, logger, utils, registry) {
    "use strict";

    var log = logger.getLogger("pat.fullcalendar");

    var fullcalendar = {
        name: "fullcalendar",
        trigger: ".pat-fullcalendar",

        init: function($calroot) {
            // XXX: should be within the calendar
            var $filter = $(".calendar-filters");
            var initMonths = function($root) {
                if ($root.hasClass("month")) {
                    fullcalendar.initMonth($root, $filter);
                } else {
                    $root.find(".month").each(function() {
                        fullcalendar.initMonth($(this), $filter);
                    });
                }
            };

            // hide all group checkboxes, will be shown if mentioned
            $filter.find(".check-list .groups label").hide();

            // initialize existing months
            initMonths($calroot);

            // wait for additional months
            $calroot.on("patterns-injected.pat-fullcalendar", function(ev) {
                initMonths($(ev.target));
            });
        },

        initMonth: function($month, $filter) {
            var $events = $(".events", $month);
            if ($events.length === 0) { return; }
            var ym = $("time", $month).attr("datetime").split("-"),
                year = ym[0],
                month = Number(ym[1]) - 1,
                $calendar = $("<div class='calendar'>\n</div>")
                    .insertAfter($events);
            var refetch = function() {
                $calendar.fullCalendar("refetchEvents");
                // XXX: replace with mutator event listener
                registry.scan($calendar);
            };
            var refetch_deb = utils.debounce(refetch, 400);
            if ($filter && $filter.length > 0) {
                $(".searchText", $filter).on("keyup", refetch_deb);
                $(".searchText[type=search]", $filter).on("click", refetch_deb);
                $("select[name=state]", $filter).on("change", refetch);
                $(".check-list", $filter).on("change", refetch);
            }
            $events.css("display", "None");
            $calendar.fullCalendar({
                disableDragging: "true",
                dayDblClick: function(/* date, allDay, jsEvent, view */) {
                    // XXX: add event
                },
                events: function(start, end, callback) {
                    var events = fullcalendar.parseEvents($events, $filter);
                    callback(events);
                },
                eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc /*, jsEvent, ui, view */) {
                    // XXX: change event
                    revertFunc();
                },
                eventResize: function(event, dayDelta, minuteDelta, revertFunc /*, jsEvent, ui, view */) {
                    // XXX: change event
                    revertFunc();
                },
                header: { left: "", right: "" },
                month: month,
                year: year
            });
            registry.scan($calendar);
        },

        parseEvents: function($events, $filter) {
            // show groups that are mentioned
            $filter.find(
                ".check-list .groups label:hidden"
            ).each(function() {
                var $label = $(this),
                    id = $label.find("input").attr("name"),
                    groupsel = ".group-" + id;
                if ($events.find(groupsel).length > 0) $label.show();
            });

            // OPTINAL: go through other filters and gray out groups that would
            // result in zero matches

            var groupsel,
                noattendees = true,
                onlyusers,
                searchText,
                state,
                $attendees;

            // parse filters
            if ($filter && $filter.length > 0) {
                searchText = $(".searchText", $filter).val();
                state = $("select[name=state]").val();
                $attendees = $(".attendees", $filter);
                onlyusers = $attendees.is(":has([name=\"only-users\"])");
                // XXX: only take visible groups into account
                groupsel = $(".groups input:checked", $attendees).map(function() {
                    var id = $(this).attr("name");
                    return ".attendees .group-" + id;
                }).toArray().join(",");

                noattendees = $attendees.is(":has([name=\"no-attendees\"]:checked)");
            }

            var events = $events.find(".event").filter(function() {
                var $event = $(this);
                // workflow state
                if (state && state !== "all") {
                    if (!$event.hasClass(".state-" + state)) {
                        log.debug("filter denied state", $event);
                        return false;
                    }
                }


                if ($event.find(".attendees *").length > 0) {
                    if ($event.find(".attendees .group").length > 0) {
                        if ($event.find(groupsel).length === 0) {
                            log.debug("filter denied groups", $event);
                            return false;
                        }
                    } else if (!onlyusers) {
                        log.debug("filter denied onlyusers", $event);
                        return false;
                    }
                } else if (!noattendees) {
                    log.debug("filter denied noattendees", $event);
                    return false;
                }

                // full text search
                if (searchText && !$event.is(":Contains(" + searchText + ")")) {
                    log.debug("filter denied fulltext", $event);
                    return false;
                }

                return true;
            }).map(function(idx, event) {
                var classNames = $(event).attr("class").split(/\s+/).filter(function(cls) {
                    return (cls !== "event");
                }).concat($("a", event).attr("class").split(/\s+/));
                var allattrs = $("a", event)[0].attributes,
                    attrs = {};
                for (var attr, i=0; i<allattrs.length; i++){
                    attr = allattrs.item(i);
                    if (attr.nodeName.slice(0,5) === "data-") {
                        attrs[attr.nodeName] = attr.nodeValue;
                    }
                }
                var location = ($(".location", event).html() || "").trim();
                var ev = {
                    title: $(".title", event).html().trim() +
                        (location ? (" (" + location + ")") : ""),
                    start: $(".start", event).attr("datetime"),
                    end: $(".end", event).attr("datetime"),
                    allDay: $(event).hasClass("all-day"),
                    url: $("a", event).attr("href"),
                    className: classNames,
                    attrs: attrs,
                    editable: $(event).hasClass("editable")
                };
                if (!ev.title) log.error("No event title for:", event);
                if (!ev.start) log.error("No event start for:", event);
                if (!ev.url) log.error("No event url for:", event);
                return ev;
            }).toArray();
            return events;
        }
    };

    registry.register(fullcalendar);
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
