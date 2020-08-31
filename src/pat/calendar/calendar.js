/**
 * Patterns calendar - Calendar with different views for patterns.
 *
 * Copyright 2013-2014 Marko Durkovic
 * Copyright 2014 Florian Friesdorf
 * Copyright 2014 Syslab.com GmbH
 */
import "regenerator-runtime/runtime"; // needed for ``await`` support
import $ from "jquery";
import _ from "underscore";
import Base from "../../core/base";
import logging from "../../core/logging";
import Modal from "../modal/modal";
import Parser from "../../core/parser";
import registry from "../../core/registry";
import store from "../../core/store";
import utils from "../../core/utils";

const log = logging.getLogger("calendar");
const parser = new Parser("calendar");

parser.addArgument("calendar-controls", ""); // Calendar controls must have "id" attr set
parser.addArgument("category-controls", "");
parser.addArgument("column-day", "dddd M/d");
parser.addArgument("column-month", "ddd");
parser.addArgument("column-week", "ddd M/d");
parser.addArgument("initial-date", null);
parser.addArgument("initial-view", "month", [
    // Simple names
    "month",
    "week",
    "day",
    "list",
    // FC 5 names
    "dayGridMonth",
    "dayGridWeek",
    "dayGridDay",
    "timeGridWeek",
    "timeGridDay",
    "listDay",
    "listWeek",
    "listMonth",
    "listYear",
    "listWeek",
    // FC 3 names
    "basicWeek",
    "basicDay",
    "agendaWeek",
    "agendaDay",
]);
parser.addArgument("drag-and-drop", true, [true, false]);
parser.addArgument("drop-external-events", true, [true, false]);
parser.addArgument("external-event-selector", "");
parser.addArgument("first-day", null);
parser.addArgument("first-hour", "6");
parser.addArgument("height", "auto");
parser.addArgument("ignore-url", false);
parser.addArgument("lang", "en");
parser.addArgument("store", "none", ["none", "session", "local"]);
parser.addArgument("time-format", "h(:mm)t");
parser.addArgument("timezone", null);
parser.addArgument("title-day", "dddd, MMM d, YYYY");
parser.addArgument("title-month", "MMMM YYYY");
parser.addArgument("title-week", "MMM D YYYY");
parser.addArgument("event-color", "blue");

parser.addArgument("url", null);
parser.addArgument("add-url", null);

parser.addAlias("default-date", "initial-date");
parser.addAlias("default-view", "initial-view");

export default Base.extend({
    name: "calendar",
    trigger: ".pat-calendar",
    classMap: {
        month: ".view-month",
        agendaWeek: ".view-week",
        agendaDay: ".view-day",
    },
    viewMap: {
        month: "dayGridMonth",
        week: "timeGridWeek",
        day: "timeGridDay",
        list: "listMonth",
        basicWeek: "dayGridWeek",
        basicDay: "dayGridDay",
        agendaWeek: "timeGridWeek",
        agendaDay: "timeGridDay",
    },
    dayNames: ["su", "mo", "tu", "we", "th", "fr", "sa"],

    async init(el, opts) {
        let Calendar = await import("@fullcalendar/core");
        Calendar = Calendar.Calendar;
        let fcDayGrid = await import("@fullcalendar/daygrid");
        let fcInteraction = await import("@fullcalendar/interaction");
        let fcList = await import("@fullcalendar/list");
        let fcLuxon = await import("@fullcalendar/luxon");
        let fcTimeGrid = await import("@fullcalendar/timegrid");
        fcDayGrid = fcDayGrid.default;
        fcInteraction = fcInteraction.default;
        fcList = fcList.default;
        fcLuxon = fcLuxon.default;
        fcTimeGrid = fcTimeGrid.default;

        if (el.jquery) {
            el = el[0];
        }
        this.el = el;

        // Save some UI elements for reuse.
        this.el_jump_next = el.querySelector(".jump-next");
        this.el_jump_prev = el.querySelector(".jump-prev");
        this.el_jump_today = el.querySelector(".jump-today");
        this.el_view_month = el.querySelector(".view-month");
        this.el_view_week = el.querySelector(".view-week");
        this.el_view_day = el.querySelector(".view-day");
        this.el_view_list_year = el.querySelector(".view-listYear");
        this.el_view_list_month = el.querySelector(".view-listMonth");
        this.el_view_list_week = el.querySelector(".view-listWeek");
        this.el_view_list_day = el.querySelector(".view-listDay");
        this.el_timezone = el.querySelector("select[name='timezone']");
        this.el_title = el.querySelector(".cal-title");

        const config = {};
        opts = this.options = store.updateOptions(el, parser.parse(el, opts));
        const storage = (this.storage =
            opts.store === "none"
                ? null
                : store[opts.store](this.name + el.id));

        const query_string = new URLSearchParams(window.location.search);

        config.headerToolbar = false;
        config.initialDate =
            query_string.get("date") ||
            (storage && storage.get("date")) ||
            opts.initial.date;
        config.initialView =
            query_string.get("view") ||
            (storage && storage.get("view")) ||
            opts.initial.view;
        config.initialView =
            this.viewMap[config.initialView] || config.initialView;
        config.editable = opts.editable || false;
        config.plugins = [
            fcDayGrid,
            fcInteraction,
            fcList,
            fcLuxon,
            fcTimeGrid,
        ];
        config.eventColor = opts.eventColor;

        config.dateClick = this.addNewEvent.bind(this);

        let lang =
            opts.lang ||
            document.querySelector("html").getAttribute("lang") ||
            "en";
        // we don't support any country-specific language variants, always use first 2 letters
        lang = lang.substr(0, 2).toLowerCase();
        if (lang !== "en") {
            const locale = await import(`@fullcalendar/core/locales/${lang}`);
            config.locale = locale.default;
            console.log("loaded cal locale for " + lang);
        }
        if (opts.first.day !== null) {
            config.firstDay = opts.first.day;
            if (this.dayNames.indexOf(opts.first.day) >= 0) {
                // Set firstDay as string
                config.firstDay = this.dayNames.indexOf(opts.first.day);
            }
        }

        let timezone = this.el_timezone?.value || opts.timezone || null;
        if (timezone) {
            config.timeZone = timezone;
        }

        if (opts.url) {
            config.events = this._fetch_events.bind(this);
        }

        // Need to create a sub-element of ``pat-calendar`` to allow custom
        // controls within pat-calendar to not be overwritten.
        const cal_el = document.createElement("div");
        cal_el.setAttribute("class", "pat-calendar__fc");
        el.appendChild(cal_el);

        // Create a element for modals/injections
        this.mod_el = document.createElement("section");
        this.mod_el.setAttribute("class", "pat-calendar__modal");
        el.appendChild(this.mod_el);

        let calendar = (this.calendar = new Calendar(cal_el, config));
        calendar.render();

        calendar.on("datesSet", this._viewChanged.bind(this));
        calendar.on("dateClick", this._viewChanged.bind(this));

        if (this.el_title) {
            this.el_title.innerHTML = calendar.view.title;
        }

        this._registerCalendarControls();
        this.setActiveClasses();
    },

    event_mapper(event) {
        // Maps backend results to the fullcalendar event schema.
        // Default implementation confirms to plone.restapi conventions.
        const ret = {
            id: event.UID,
            title: event.title,
            start: new Date(event.start),
            end: new Date(event.end),
            allDay: event.whole_day,
            url: event["@id"],

            backgroundColor: event.color,
            borderColor: event.color,

            // non fullcalendar standard fields
            description: event.description,
            text: event.text,
            location: event.location,
            open_end: event.open_end,
            recurrence: event.recurrence,
            attendees: event.attendees,
            contact_name: event.contact_name,
            contact_phone: event.contact_phone,
            contact_email: event.contact_email,
            event_url: event.event_url,
        };
        return ret;
    },

    update_event(event, data) {
        // Updated an existing event with new event properties.
        event.setDates(data.start, data.end);
        event.setAllDay(data.allDay);
        event.setProp("id", data.id);
        event.setProp("title", data.title);
        event.setProp("url", data.url);

        event.setProp("backgroundColor", data.color);
        event.setProp("borderColor", data.color);

        event.setExtendedProp("description", data.description);
        event.setExtendedProp("text", data.text);
        event.setExtendedProp("location", data.location);
        event.setExtendedProp("open_end", data.open_end);
        event.setExtendedProp("recurrence", data.recurrence);
        event.setExtendedProp("attendees", data.attendees);
        event.setExtendedProp("contact_name", data.contact_name);
        event.setExtendedProp("contact_phone", data.contact_phone);
        event.setExtendedProp("contact_email", data.contact_email);
        event.setExtendedProp("event_url", data.event_url);
    },

    async _fetch_events(info, success, failure) {
        let url = this.options.url;
        if (!url) {
            failure();
            return;
        }

        let results = [];
        while (url) {
            url = url
                .replace("${start_str}", info.startStr.split("T")[0])
                .replace("${end_str}", info.endStr.split("T")[0]);

            let response;
            try {
                response = await fetch(url, {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                });
            } catch (e) {
                failure(e);
                return;
            }
            let result = await response.json();
            let results_ = result.items?.map(this.event_mapper) || [];
            results = results.concat(results_);

            // resolve all ``next`` batching urls
            url = result.batching?.next || null;
        }
        success(results);
    },

    _registerCalendarControls() {
        this.el_jump_next?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.next();
        });

        this.el_jump_prev?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.prev();
        });

        this.el_jump_today?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.today();
        });

        this.el_view_month?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.changeView("dayGridMonth");
        });

        this.el_view_week?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.changeView("timeGridWeek");
        });

        this.el_view_day?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.changeView("timeGridDay");
        });

        this.el_view_list_year?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.changeView("listYear");
        });

        this.el_view_list_month?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.changeView("listMonth");
        });

        this.el_view_list_week?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.changeView("listWeek");
        });

        this.el_view_list_day?.addEventListener("click", (event) => {
            event.preventDefault();
            this.calendar.changeView("listDay");
        });

        this.el_timezone?.addEventListener("change", (event) => {
            event.preventDefault();
            this.calendar.setOption("timeZone", event.target.value);
        });
    },

    setActiveClasses() {
        // Set active classes of UI elements.

        this.el_jump_today?.classList.remove("active");
        this.el_view_month?.classList.remove("active");
        this.el_view_week?.classList.remove("active");
        this.el_view_day?.classList.remove("active");
        this.el_view_list_year?.classList.remove("active");
        this.el_view_list_month?.classList.remove("active");
        this.el_view_list_week?.classList.remove("active");
        this.el_view_list_day?.classList.remove("active");

        const cdate = this.calendar.currentData.currentDate;
        const today = new Date();
        if (
            cdate.getYear() === today.getYear() &&
            cdate.getMonth() === today.getMonth() &&
            cdate.getDate() === today.getDate()
        ) {
            this.el_jump_today?.classList.add("active");
        }

        switch (this.calendar.view.type) {
            case "dayGridMonth":
                this.el_view_month?.classList.add("active");
                break;
            case "timeGridWeek":
                this.el_view_week?.classList.add("active");
                break;
            case "timeGridDay":
                this.el_view_day?.classList.add("active");
                break;
            case "listYear":
                this.el_view_list_year?.classList.add("active");
                break;
            case "listMonth":
                this.el_view_list_month?.classList.add("active");
                break;
            case "listWeek":
                this.el_view_list_week?.classList.add("active");
                break;
            case "listDay":
                this.el_view_list_day?.classList.add("active");
                break;
        }
    },

    _viewChanged(data) {
        // Set title
        if (this.el_title) {
            this.el_title.innerHTML = data.view.title;
        }
        // store current date and view
        const date = data.view.currentStart.toISOString();
        const view = data.view.type;
        this.storage && this.storage.set("date", date);
        this.storage && this.storage.set("view", view);

        const query = new URLSearchParams(window.location.search);
        query.set("date", date);
        query.set("view", view);
        history.replaceState(null, null, "?" + query.toString());

        this.setActiveClasses();
    },

    async addNewEvent(info) {
        let addUrl = this.options.addUrl;
        if (!addUrl) {
            return;
        }

        let start, end, allDay;
        if (this.calendar.view.type === "timeGridMonth") {
            start = info.date;
            end = info.date;
            allDay = true;
        } else {
            start = info.date;
            end = new Date(start.getTime() + 1 * 60 * 60 * 1000); // same as start, 1h offset
            allDay = false;
        }
        addUrl = addUrl
            .replace("${start_str}", start)
            .replace("${end_str}", end)
            .replace("${all_day}", allDay ? "1" : "0");

        const event = this.calendar.addEvent(
            {
                title: "New Event",
                start: start,
                end: end,
            },
            true
        );

        await new Modal(this.mod_el, {
            url: addUrl,
            trigger: "autoload",
        });

        //const mod_el = document.querySelector("#pat-modal form");
        //mod_el.addEventListener("submit", (e) => {
        document.addEventListener("submit", async (e) => {
            const form = e.target;
            const form_data = new FormData(form);
            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: form_data,
                });
                let data = await response.json();
                data = this.event_mapper(data);
                this.update_event(event, data);
            } catch (error) {
                log.error(error);
                event.remove();
            }
        });
    },

    _addNewEvent: function ($el, $event, data) {
        /* Add a new event to the list of events parsed by fullcalendar.
         * Used when dropping a foreign element.
         */
        // FIXME: this code is makes too much assumptions of the structure
        // of the dropped element. Needs to be made more generic, together
        // with parseEvents.
        var $events = $el.find(".cal-events");
        var $details = $event.find("ul.details");
        $details.append(
            $("<li>").append(
                $("<time>")
                    .addClass("start")
                    .attr("datetime", data.start)
                    .text(data.start)
            )
        );
        $details.append(
            $("<li>").append(
                $("<time>")
                    .addClass("end")
                    .attr("datetime", data.end)
                    .text(data.end)
            )
        );
        if (data.allDay === true) {
            $event.addClass("all-day");
        }
        $events.append($event);
    },

    _externalEventDropped: function (moment, ev, obj, view) {
        var $event = $(this),
            url = $event.find("a").addBack("a").attr("href"),
            data = {
                "start": moment.format(),
                "pat-calendar-event-drop": true,
            };
        if (view.name === "month") {
            data.end = moment.clone().format();
            data.allDay = true;
        } else {
            data.end = moment.clone().add(30, "minutes").format();
            data.allDay = false;
        }
        calendar._addNewEvent(calendar.$el, $event, data);
        calendar._refetchEvents(calendar.$el);
        $.getJSON(url, data);
    },

    _changeEventDates: function (evt) {
        /* Called when an event's dates have changed due to a drag&drop or
         * drag&resize action.
         */
        var $event = calendar.findEventByURL(calendar.$el, evt.url),
            regex = /\+[0-9]{2}:[0-9]{2}$/,
            match = evt.start
                .clone()
                .tz(calendar.cfg.timezone)
                .format()
                .match(regex),
            data = {
                "allDay": evt.allDay,
                "pat-calendar-event-drop": true,
                "start": evt.start.format(),
            };
        if (evt.allDay === true) {
            // XXX: In fullcalendar 2 the end-date is no longer inclusive,
            // so we substract a day here.
            data.end = (evt.end === null
                ? evt.start.clone()
                : evt.end.clone().subtract("days", 1)
            ).format();
        } else {
            data.end = (evt.end === null
                ? evt.start.clone().add(30, "minutes")
                : evt.end
            ).format();
        }
        var tzstr = match && match.length > 0 ? match[0] : "";
        var startstr = data.start + tzstr;
        var endstr = data.end + tzstr;
        $event.find("time.start").attr("datetime", startstr).text(startstr);
        $event.find("time.end").attr("datetime", endstr).text(endstr);
        $.getJSON(evt.url, data);
    },

    _refetchEvents: function ($el) {
        $el.fullCalendar("refetchEvents");
    },

    _redrawCalendar: function () {
        this.$el.fullCalendar(
            "option",
            "height",
            this.$el.find(".fc-view-container").height()
        );
    },

    _registerRedrawHandlers: function () {
        if (calendar.cfg.height === "auto") {
            calendar._redrawCalendar();

            $(window).on("resize.pat-calendar", function (ev) {
                if ($(ev.target).hasClass("fc-event")) {
                    // Don't do anything if the element being resized is a
                    // calendar event.
                    // Otherwise drag2resize breaks.
                    return;
                }
                calendar.$el.fullCalendar(
                    "option",
                    "height",
                    calendar.$el.find(".fc-view-container").height()
                );
            });
            $(document).on("pat-update.pat-calendar", function (ev) {
                // Don't redraw if the change was in a tooltip, otherwise
                // it will close the tooltip prematurely (assuming here
                // it's a calendar event tooltip).
                if ($(ev.target).parents(".tooltip-container").length === 0) {
                    setTimeout(function () {
                        calendar.$el.fullCalendar(
                            "option",
                            "height",
                            calendar.$el.find(".fc-view-container").height()
                        );
                    }, 300);
                }
            });
        }
    },

    _registerEventRefetchers: function ($el) {
        /* Register handlers for those IO events that necessitate a refetching
         * of the calendar's event objects.
         */
        $el.on(
            "keyup.pat-calendar",
            ".filter .search-text",
            utils.debounce(calendar._refetchEvents.bind(calendar, $el), 400)
        );
        $el.on(
            "click.pat-calendar",
            ".filter .search-text[type=search]",
            utils.debounce(calendar._refetchEvents.bind(calendar, $el), 400)
        );
        $el.on(
            "change.pat-calendar",
            ".filter select[name=state]",
            calendar._refetchEvents.bind(calendar, $el)
        );
        $el.on(
            "change.pat-calendar",
            ".filter .check-list",
            calendar._refetchEvents.bind(calendar, $el)
        );
    },

    _registerCategoryControls: function ($el) {
        /* The "category controls" are checkboxes that cause different
         * types of events to be shown or hidden.
         *
         * Configured via the "category-controls" parser argument.
         *
         * Events will be refetched.
         */
        var $categoryRoot = calendar.cfg.categoryControls
            ? $(calendar.cfg.categoryControls)
            : $el;
        $el.$catControls = $categoryRoot.find("input[type=checkbox]");
        $el.$catControls.on("change.pat-calendar", function () {
            if (this.id) {
                calendar.storage.set(this.id, this.checked);
            }
            calendar._refetchEvents($el);
        });
    },

    destroy: function ($el) {
        $el.off(".pat-calendar");
        $el.$catControls.off(".pat-calendar");
        $el.$controlRoot.off(".pat-calendar");
        $(window).off(".pat-calendar");
        $(document).off(".pat-calendar");
        $(".cal-events .cal-event").off(".pat-calendar");
        $el.fullCalendar("destroy");
    },

    highlightButtons: function (view, element) {
        var $el = element.parents(".pat-calendar").first(),
            $body = element.parents("body").first(),
            $today = $el.find(".jump-today");
        $today.removeClass("active");
        if (view.name === "agendaDay") {
            var calDate = $el.fullCalendar("getDate"),
                today = $.fullCalendar.moment();
            if (
                calDate.date() === today.date() &&
                calDate.month() === today.month() &&
                calDate.year() === today.year()
            ) {
                $today.addClass("active");
            }
        }
        $body.find(".view-month").removeClass("active");
        $body.find(".view-week").removeClass("active");
        $body.find(".view-day").removeClass("active");
        $body.find(calendar.classMap[view.name]).addClass("active");
    },

    findEventByURL: function ($el, url) {
        var regex = new RegExp("^" + url + "$");
        return $el.find(".cal-events .cal-event").filter(function () {
            return regex.test($(this).find("a").attr("href"));
        });
    },

    _restoreCalendarControls: function () {
        /* Restore values of the calendar controls as stored in
         * localStorage.
         */
        var calKeys = calendar.storage._allKeys();
        calendar.$el.$catControls.each(function () {
            if (!this.id) {
                return;
            }
            if (
                calKeys.indexOf(calendar.storage.prefix + ":" + this.id) !== -1
            ) {
                if (calendar.storage.get(this.id) === false) {
                    $(this).prop("checked", false).trigger("change");
                    $(this).parent().removeClass("checked");
                    $(this).parent().addClass("unchecked");
                } else {
                    $(this).prop("checked", true).trigger("change");
                    $(this).parent().removeClass("unchecked");
                    $(this).parent().addClass("checked");
                }
            }
        });
    },

    oldInit() {
        cfg.tooltipConfig = $el.data("patCalendarTooltip");
        cfg.modalConfig = $el.data("patCalendarModal");
        if (cfg.tooltipConfig) {
            var match = cfg.tooltipConfig.match(/url:[ ](.*?)(;|$)/);
            cfg.tooltipConfig = cfg.tooltipConfig.replace(match[0], "");
            cfg.newEventURL = match[1];
        }

        var calOpts = {
            axisFormat: cfg.timeFormat,
            columnFormat: cfg.column,
            droppable: cfg.dropExternalEvents, // Enable dropping of external elements (i.e. not events)
            editable: cfg.dragAndDrop, // Enable drag&drop and drag2resize of events
            dropAccept: cfg.externalEventSelector,
            firstHour: cfg.first.hour,
            header: false,
            height: cfg.height !== "auto" ? cfg.height : undefined,
            timeFormat: cfg.timeFormat,
            titleFormat: cfg.title,
            viewRender: calendar.highlightButtons,

            // Callback functions
            // ------------------
            drop: this._externalEventDropped,
            eventDrop: this._changeEventDates,
            eventResize: this._changeEventDates,
            events: function (start, end, timezone, callback) {
                var events = calendar.parseEvents($el, timezone);
                callback(events);
            },
            eventAfterRender: function (ev, $event) {
                var url = "";
                if (ev.id === "pat-calendar-new-event") {
                    url = utils.addURLQueryParameter(
                        cfg.newEventURL,
                        "date",
                        ev.start.format()
                    );
                    registry.scan(
                        $event
                            .addClass("pat-tooltip")
                            .attr({ "data-pat-tooltip": cfg.tooltipConfig })
                            .attr({ href: url })
                    );
                    $event.trigger("click.tooltip");
                    $event.on("pat-update", function (event, data) {
                        if (
                            data.pattern === "tooltip" &&
                            data.hidden === true
                        ) {
                            event.stopPropagation();
                            if ($(this).is(":visible")) {
                                $el.fullCalendar("removeEvents", ev.id);
                            }
                        }
                    });
                } else {
                    url = ev.url;
                    registry.scan(
                        $event
                            .addClass("pat-tooltip")
                            .attr({ "data-pat-tooltip": cfg.tooltipConfig })
                            .attr({ href: url })
                    );
                    $event.on("pat-update", function (event, data) {
                        if (
                            data.pattern === "tooltip" &&
                            data.hidden === true
                        ) {
                            event.stopPropagation();
                        }
                    });
                }
            },
            dayClick: function (moment, ev, view) {
                /* If "data-pat-calendar-tooltip" was configured, we open
                 * a tooltip when the user clicks on an day in the
                 * calendar.
                 */
                if (!(cfg.tooltipConfig && cfg.newEventURL)) {
                    return;
                }
                var end;
                if (view.name !== "month") {
                    end = moment.clone().add(30, "minutes");
                } else {
                    end = undefined;
                }
                var id = "pat-calendar-new-event";
                $el.fullCalendar("removeEvents", id);
                $el.fullCalendar("renderEvent", {
                    title: "New Event",
                    start: moment,
                    end: end,
                    id: id,
                });
            },
        };

        this._registerEventRefetchers($el);
        this._registerCategoryControls($el);
        var $controlRoot = cfg.calendarControls ? $(cfg.calendarControls) : $el;
        $el.$controlRoot = $controlRoot;
        cfg.timezone = calOpts.timezone = $controlRoot
            .find("select.timezone")
            .val();
        $el.fullCalendar(calOpts);
        $el.find(".fc-content").appendTo($el); // move to end of $el
        this._registerRedrawHandlers();
        $el.find(".cal-title").text($el.fullCalendar("getView").title);
        $el.$controlRoot
            .find(this.classMap[calOpts.defaultView])
            .addClass("active");
        calendar._registerCalendarControls($el);
        $el.find(".cal-events").css("display", "none");
        this._restoreCalendarControls();
        setTimeout(function () {
            $el.fullCalendar(
                "option",
                "height",
                $el.find(".fc-view-container").height()
            );
            $el.fullCalendar("refetchEvents");
        }, 900);
        //            } )
    },
});
