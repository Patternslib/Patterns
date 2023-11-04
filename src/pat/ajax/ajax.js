/**
 * Patterns ajax - AJAX injection for forms and anchors
 *
 * Copyright 2012-2013 Florian Friesdorf
 * Copyright 2012-2013 Marko Durkovic
 */
import "../../core/polyfills"; // SubmitEvent.submitter for Safari < 15.4 and jsDOM
import $ from "jquery";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import registry from "../../core/registry";

const log = logging.getLogger("pat.ajax");

export const parser = new Parser("ajax");
parser.addArgument("accept", "text/html");
parser.addArgument("url", function ($el) {
    const el = $el[0];
    const value =
        el.tagName === "A"
            ? el.getAttribute("href")
            : el.tagName === "FORM"
            ? el.getAttribute("action")
            : "";
    return (value || "").split("#")[0];
});
parser.addArgument("browser-cache", "no-cache", ["cache", "no-cache"]); // Cache ajax requests

const xhrCount = {};
xhrCount.get = function (a) {
    return this[a] !== undefined ? this[a] : 0;
};
xhrCount.inc = function (a) {
    this[a] = this.get(a) + 1;
    return this.get(a);
};

const _ = {
    name: "ajax",
    trigger: ".pat-ajax",
    parser: parser,
    init($el) {
        $el.off(".pat-ajax");
        $el.filter("a").on("click.pat-ajax", _.onTriggerEvents);
        $el.filter("form")
            .on("submit.pat-ajax", _.onTriggerEvents)
            .on("click.pat-ajax", "[type=submit]", _.onClickSubmit);
        $el.filter(":not(form,a)").each(function () {
            log.warn("Unsupported element:", this);
        });
        return $el;
    },
    destroy($el) {
        $el.off(".pat-ajax");
    },
    onClickSubmit(event) {
        const el = event.submitter || event.target;
        const form = el.form;
        const data = {};
        if (el.name) {
            data[el.name] = el.value;
        }
        $(form).data("pat-ajax.clicked-data", data);
    },
    onTriggerEvents(event) {
        if (event) {
            event.preventDefault();
        }
        _.request($(this));
    },
    request($el, opts) {
        return $el.each(function () {
            _._request($(this), opts);
        });
    },
    _request($el, opts) {
        const cfg = _.parser.parse($el, opts);
        const onError = function (jqxhr, status, error) {
            // error can also stem from a javascript
            // exception, not only errors described in the
            // jqxhr.
            log.error("load error for " + cfg.url + ":", error, jqxhr);
            $el.trigger({
                type: "pat-ajax-error",
                jqxhr: jqxhr,
            });
        };
        const seqNumber = xhrCount.inc(cfg.url);
        const onSuccess = function (data, status, jqxhr) {
            log.debug("success: jqxhr:", jqxhr);
            if (seqNumber === xhrCount.get(cfg.url)) {
                // if this url is requested multiple time, only return the last result
                $el.trigger({
                    type: "pat-ajax-success",
                    jqxhr: jqxhr,
                });
            } else {
                // ignore
            }
        };
        const temp = $el.data("pat-ajax.clicked-data");
        const clickedData = temp ? $.param(temp) : "";
        const args = {
            context: $el,
            data: [$el.serialize(), clickedData].filter(Boolean).join("&"),
            headers: {},
            url: cfg.url,
            method: $el.attr("method") ? $el.attr("method") : "GET",
            cache: cfg.browserCache === "cache" ? true : false,
        };

        if (cfg.accept) {
            args.headers.Accept = cfg.accept;
        }

        if (
            $el.is("form") &&
            $el.attr("method") &&
            $el.attr("method").toUpperCase() == "POST"
        ) {
            const formdata = new FormData($el[0]);
            for (const key in temp) {
                formdata.append(key, temp[key]);
            }
            args["method"] = "POST";
            args["data"] = formdata;
            args["cache"] = false;
            args["contentType"] = false;
            args["processData"] = false;
            args["type"] = "POST";
        }

        $el.removeData("pat-ajax.clicked-data");
        log.debug("request:", args, $el[0]);

        // Make it happen
        const ajax_deferred = $.ajax(args);

        if (ajax_deferred) ajax_deferred.done(onSuccess).fail(onError);
    },
};

registry.register(_);

export default _;
