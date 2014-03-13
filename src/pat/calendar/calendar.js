/**
 * Patterns calendar - Calendar with different views for patterns.
 *
 * Copyright 2013-2014 Marko Durkovic
 * Copyright 2014 Florian Friesdorf
 */
define([
    "jquery",
    "pat-logger",
    "pat-parser",
    "pat-store",
    "pat-utils",
    "pat-registry",
    "pat-calendar-dnd",
    "pat-calendar-moment-timezone-data",
    "jquery.fullcalendar"
], function($, logger, Parser, store, utils, registry, dnd) {
    "use strict";

    var log = logger.getLogger("calendar"),
        parser = new Parser("calendar");

    parser.add_argument("height", "auto");
    parser.add_argument("start-date");
    parser.add_argument("time-format", "h(:mm)t");
    parser.add_argument("title-month", "MMMM YYYY");
    parser.add_argument("title-week", "MMM D YYYY");
    parser.add_argument("title-day", "dddd, MMM d, YYYY");
    parser.add_argument("column-month", "ddd");
    parser.add_argument("column-week", "ddd M/d");
    parser.add_argument("column-day", "dddd M/d");
    parser.add_argument("first-day", "0");
    parser.add_argument("first-hour", "6");
    parser.add_argument("calendar-controls", "");
    parser.add_argument("category-controls", "");
    parser.add_argument("default-view", "month",
                        ["month", "basicWeek", "basicDay",
                         "agendaWeek", "agendaDay"]);
    parser.add_argument("store", "none", ["none", "session", "local"]);
    parser.add_argument("ignore-url", false);

    var _ = {
        name: "calendar",
        trigger: ".pat-calendar",

        _parseSearchString: function() {
            var context = {};
            window.location.search.substr(1).split("&").forEach(function(str) {
                if (str) {
                    var keyValue = str.split("="),
                        key = keyValue[0],
                        value = decodeURIComponent(keyValue[1]);
                    if (value && (value.match(/^\[.*\]$/) ||
                                  value.match(/^\{.*\}$/))) {
                        context[key] = JSON.parse(value);
                    } else {
                        context[key] = value;
                    }
                }
            });
            return context;
        },

        init: function($el, opts) {
            opts = opts || {};
            var cfg = store.updateOptions($el[0], parser.parse($el)),
                storage = cfg.store === "none"
                    ? null
                    : store[cfg.store](_.name + $el[0].id);

            cfg.defaultDate = storage.get("date") || cfg.defaultDate,
            cfg.defaultView = storage.get("view") || cfg.defaultView;

            if (!opts.ignoreUrl) {
                var search = _._parseSearchString();
                if (search["default-date"]) {
                    cfg.defaultDate = search["default-date"];
                }
                if (search["default-view"]) {
                    cfg.defaultView = search["default-view"];
                }
            }

            var calOpts = {
                    header: false,
                    droppable: true,
                    drop: function(date, event, undef, view) {
                        var $this = $(this),
                            $ev = $this.hasClass("cal-event") ?
                                $this : $this.parents(".cal-event"),
                            $cal = $(view.element).parents(".pat-calendar");

                        $ev.appendTo($cal.find(".cal-events"));
                        var $start = $ev.find(".start");
                        if (!$start.length) {
                            $("<time class='start'/>").attr("datetime", date.format())
                                .appendTo($ev);
                        }
                        var $end = $ev.find(".end");
                        if (!$end.length) {
                            $("<time class='end'/>").appendTo($ev);
                        }

                        if (date.hasTime()) {
                            $ev.addClass("all-day");
                        } else {
                            $ev.removeClass("all-day");
                        }
                        $cal.fullCalendar("refetchEvents");
                        $cal.find("a").each(function(a) { $(a).draggable = 1; });
                    },
                    events: function(start, end, timezone, callback) {
                        var events = _.parseEvents($el, timezone);
                        callback(events);
                    },
                    firstHour: cfg.first.hour,
                    axisFormat: cfg.timeFormat,
                    timeFormat: cfg.timeFormat,
                    titleFormat: cfg.title,
                    columnFormat: cfg.column,
                    viewRender: _.highlightButtons,
                    defaultDate: cfg.defaultDate,
                    defaultView: cfg.defaultView
                };

            $el.__cfg = cfg;
            $el.__storage = storage;

            if (cfg.height !== "auto") {
                calOpts.height = cfg.height;
            }

            var dayNames = [ "su", "mo", "tu", "we", "th", "fr", "sa" ];
            if (dayNames.indexOf(cfg.first.day) >= 0) {
                calOpts.firstDay = dayNames.indexOf(cfg.first.day);
            }

            var refetch = function() {
                $el.fullCalendar("refetchEvents");
            };
            var refetch_deb = utils.debounce(refetch, 400);

            $el.on("keyup.pat-calendar", ".filter .search-text",
                   refetch_deb);
            $el.on("click.pat-calendar", ".filter .search-text[type=search]",
                   refetch_deb);
            $el.on("change.pat-calendar", ".filter select[name=state]",
                   refetch);
            $el.on("change.pat-calendar", ".filter .check-list",
                   refetch);

            $el.categories = $el.find(".cal-events .cal-event")
                .map(function() {
                    return this.className.split(" ").filter(function(cls) {
                        return (/^cal-cat/).test(cls);
                    });
                });

            var $categoryRoot = cfg.categoryControls ?
                    $(cfg.categoryControls) : $el;

            $el.$catControls = $categoryRoot.find("input[type=checkbox]");
            $el.$catControls.on("change.pat-calendar", refetch);

            var $controlRoot = cfg.calendarControls ?
                    $(cfg.calendarControls) : $el;
            $el.$controlRoot = $controlRoot;
            calOpts.timezone = $controlRoot.find("select.timezone").val();

            $el.fullCalendar(calOpts);

            // move to end of $el
            $el.find(".fc-content").appendTo($el);

            if (cfg.height === "auto") {
                $el.fullCalendar("option", "height",
                    $el.find(".fc-content").height());

                $(window).on("resize.pat-calendar", function() {
                    $el.fullCalendar("option", "height",
                        $el.find(".fc-content").height());
                });
                $(document).on("pat-update.pat-calendar", function() {
                    $el.fullCalendar("option", "height",
                        $el.find(".fc-content").height());
                });
            }

            // update title
            var $title = $el.find(".cal-title");
            $title.text($el.fullCalendar("getView").title);

            var classMap = {
                month: ".view-month",
                agendaWeek: ".view-week",
                agendaDay: ".view-day"
            };

            $controlRoot.find(classMap[calOpts.defaultView]).addClass("active");

            $controlRoot.on("click.pat-calendar", ".jump-next", function() {
                $el.fullCalendar("next");
                _._viewChanged($el);
            });
            $controlRoot.on("click.pat-calendar", ".jump-prev", function() {
                $el.fullCalendar("prev");
                _._viewChanged($el);
            });
            $controlRoot.on("click.pat-calendar", ".jump-today", function() {
                $el.fullCalendar("today");
                _._viewChanged($el);
            });
            $controlRoot.on("click.pat-calendar", ".view-month", function() {
                $el.fullCalendar("changeView", "month");
                _._viewChanged($el);
            });
            $controlRoot.on("click.pat-calendar", ".view-week", function() {
                $el.fullCalendar("changeView", "agendaWeek");
                _._viewChanged($el);
            });
            $controlRoot.on("click.pat-calendar", ".view-day", function() {
                $el.fullCalendar("changeView", "agendaDay");
                _._viewChanged($el);
            });
            $controlRoot.on("change.pat-calendar", "select.timezone", function(ev) {
                _.destroy($el);
                _.init($el, {ignoreUrl: true});
            });

            $el.find(".cal-events").css("display", "none");

            // make .cal-event elems draggable
            dnd.draggable($(".cal-events .cal-event"));

            // emulate jQueryUI dragstop and mousemove during drag.
            $(".cal-events .cal-event").on("dragend.pat-calendar", function() {
                $(this).trigger("dragstop");
            });
            $el.on("dragover.pat-calendar", function(event) {
                event.preventDefault();
                event.type = "mousemove";
                $(document).trigger(event);
            });

            if (!$.fn.draggable) {
                $.fn.draggable = function(opts) {
                    var start = opts.start,
                        stop = opts.stop;
                    this.on("dragstart", function(event) {
                        start(event, null);
                    });
                    this.on("dragend", function(event) {
                        stop(event, null);
                    });
                };
            }
        },

        destroy: function($el) {
            $el.off(".pat-calendar");
            $el.$catControls.off(".pat-calendar");
            $el.$controlRoot.off(".pat-calendar");
            $(window).off(".pat-calendar");
            $(document).off(".pat-calendar");
            $(".cal-events .cal-event").off(".pat-calendar");
            $el.fullCalendar("destroy");
        },

        _viewChanged: function($el) {
            // update title
            var $title = $el.find(".cal-title");
            $title.html($el.fullCalendar("getView").title);

            // adjust height
            if ($el.__cfg.height === "auto") {
                $el.fullCalendar("option", "height",
                                 $el.find(".fc-content").height());
            }

            // store current date and view
            var date = $el.fullCalendar("getDate").format(),
                view = $el.fullCalendar("getView").name;

            $el.__storage.set("date", date);
            $el.__storage.set("view", view);
        },

        highlightButtons: function(view, element) {
            var $el = element.parents(".pat-calendar").first(),
                $body = element.parents("body").first(),
                $today = $el.find(".jump-today");
            $today.removeClass("active");
            if (view.name === "agendaDay") {
                var calDate = $el.fullCalendar("getDate"),
                    today = $.fullCalendar.moment();
                if (calDate.date() === today.date() &&
                    calDate.month() === today.month() &&
                    calDate.year() === today.year()) {
                    $today.addClass("active");
                }
            }

            var classMap = {
                month: ".view-month",
                agendaWeek: ".view-week",
                agendaDay: ".view-day"
            };
            $body.find(".view-month").removeClass("active");
            $body.find(".view-week").removeClass("active");
            $body.find(".view-day").removeClass("active");
            $body.find(classMap[view.name]).addClass("active");
        },

        parseEvents: function($el, timezone) {
            var $events = $el.find(".cal-events"),
                $filter = $el.find(".filter"),
                searchText,
                regex;

            // parse filters
            if ($filter && $filter.length > 0) {
                searchText = $(".search-text", $filter).val();
                regex = new RegExp(searchText, "i");
            }

            var hiddenCats = $el.categories.filter(function() {
                var cat = this;
                return $el.$catControls.filter(function() {
                    return !this.checked &&
                        $(this)
                            .parents()
                            .andSelf()
                            .hasClass(cat);
                }).length;
            });

            var events = $events.find(".cal-event").filter(function() {
                var $event = $(this);

                if (searchText && !regex.test($event.find(".title").text())) {
                    log.debug("remove due to search-text="+searchText, $event);
                    return false;
                }

                return !hiddenCats.filter(function() {
                    return $event.hasClass(this);
                }).length;
            }).map(function(idx, event) {
                var attr, i;

                // classNames: all event classes without "event" + anchor classes
                var classNames = $(event).attr("class").split(/\s+/)
                    .filter(function(cls) { return (cls !== "cal-event"); })
                    .concat($("a", event).attr("class").split(/\s+/));

                // attrs: all "data-" attrs from anchor
                var allattrs = $("a", event)[0].attributes,
                    attrs = {};
                for (attr, i=0; i<allattrs.length; i++){
                    attr = allattrs.item(i);
                    if (attr.nodeName.slice(0,5) === "data-") {
                        attrs[attr.nodeName] = attr.nodeValue;
                    }
                }

                var location = ($(".location", event).html() || "").trim();

                var startstr = $(".start", event).attr("datetime"),
                    endstr = $(".end", event).attr("datetime"),
                    start = $.fullCalendar.moment.parseZone(startstr),
                    end = $.fullCalendar.moment.parseZone(endstr);

                if (timezone) {
                    start = start.tz(timezone);
                    end = end.tz(timezone);
                }
                var ev = {
                    title: $(".title", event).text().trim() +
                        (location ? (" (" + location + ")") : ""),
                    start: start.format(),
                    end: end.format(),
                    allDay: $(event).hasClass("all-day"),
                    url: $("a", event).attr("href"),
                    className: classNames,
                    attrs: attrs,
                    editable: $(event).hasClass("editable")
                };
                if (!ev.title) {
                    log.error("No event title for:", event);
                }
                if (!ev.start) {
                    log.error("No event start for:", event);
                }
                if (!ev.url) {
                    log.error("No event url for:", event);
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
