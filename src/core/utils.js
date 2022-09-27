import $ from "jquery";
import dom from "./dom";

const _MS_PER_DAY = 1000 * 60 * 60 * 24; // Milliseconds per day.

$.fn.safeClone = function () {
    var $clone = this.clone();
    // IE 9-11 BUG : Placeholder text becomes actual value after deep clone on textarea
    // https://connect.microsoft.com/IE/feedback/details/781612/placeholder-text-becomes-actual-value-after-deep-clone-on-textarea
    // Ref:
    //     https://github.com/Patternslib/Patterns/issues/412
    //     https://github.com/Patternslib/Patterns/pull/410
    if (window.document.documentMode) {
        $clone.findInclusive(":input[placeholder]").each(function (i, item) {
            var $item = $(item);
            if ($item.attr("placeholder") === $item.val()) {
                $item.val("");
            }
        });
    }
    return $clone;
};

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback, thisArg) {
        var T, k;
        if (this === null) {
            throw new TypeError(" this is null or not defined");
        }
        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);
        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;
        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 1) {
            T = thisArg;
        }
        // 6. Let k be 0
        k = 0;
        // 7. Repeat, while k < len
        while (k < len) {
            var kValue;
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {
                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[k];
                // ii. Call the Call internal method of callback with T as the this value and
                // argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined
    };
}

var singleBoundJQueryPlugin = function (pattern, method, options) {
    /* This is a jQuery plugin for patterns which are invoked ONCE FOR EACH
     * matched element in the DOM.
     *
     * This is how the Mockup-type patterns behave. They are constructor
     * functions which need to be invoked once per jQuery-wrapped DOM node
     * for all DOM nodes on which the pattern applies.
     */
    var $this = this;
    $this.each(function () {
        var pat,
            $el = $(this);
        pat = pattern.init($el, options);
        if (method) {
            if (pat[method] === undefined) {
                $.error(
                    "Method " + method + " does not exist on jQuery." + pattern.name
                );
                return false;
            }
            if (method.charAt(0) === "_") {
                $.error("Method " + method + " is private on jQuery." + pattern.name);
                return false;
            }
            pat[method].apply(pat, [options]);
        }
    });
    return $this;
};

var pluralBoundJQueryPlugin = function (pattern, method, options) {
    /* This is a jQuery plugin for patterns which are invoked ONCE FOR ALL
     * matched elements in the DOM.
     *
     * This is how the vanilla Patternslib-type patterns behave. They are
     * simple objects with an init method and this method gets called once
     * with a list of jQuery-wrapped DOM nodes on which the pattern
     * applies.
     */
    var $this = this;
    if (method) {
        if (pattern[method]) {
            return pattern[method].apply($this, [$this].concat([options]));
        } else {
            $.error("Method " + method + " does not exist on jQuery." + pattern.name);
        }
    } else {
        pattern.init.apply($this, [$this].concat([options]));
    }
    return $this;
};

var jqueryPlugin = function (pattern) {
    return function (method, options) {
        var $this = this;
        if ($this.length === 0) {
            return $this;
        }
        if (typeof method === "object") {
            options = method;
            method = undefined;
        }
        if (typeof pattern === "function") {
            return singleBoundJQueryPlugin.call(this, pattern, method, options);
        } else {
            return pluralBoundJQueryPlugin.call(this, pattern, method, options);
        }
    };
};

// Is a given variable an object?
function isObject(obj) {
    var type = typeof obj;
    return type === "function" || (type === "object" && !!obj);
}

// Extend a given object with all the properties in passed-in object(s).
function extend(obj) {
    if (!isObject(obj)) return obj;
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
        source = arguments[i];
        for (prop in source) {
            if (hasOwnProperty.call(source, prop)) {
                obj[prop] = source[prop];
            }
        }
    }
    return obj;
}
// END: Taken from Underscore.js until here.

function findLabel(input) {
    var $label;
    for (
        var label = input.parentNode;
        label && label.nodeType !== 11;
        label = label.parentNode
    ) {
        if (label.tagName === "LABEL") {
            return label;
        }
    }
    if (input.id) {
        $label = $('label[for="' + input.id + '"]');
    }
    if ($label && $label.length === 0 && input.form) {
        $label = $('label[for="' + input.name + '"]', input.form);
    }
    if ($label && $label.length) {
        return $label[0];
    } else {
        return null;
    }
}

// Taken from http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
function elementInViewport(el) {
    var rect = el.getBoundingClientRect(),
        docEl = document.documentElement,
        vWidth = window.innerWidth || docEl.clientWidth,
        vHeight = window.innerHeight || docEl.clientHeight;

    if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight)
        return false;
    return true;
}

// Taken from http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

/**
 * Remove classes from a list of targets if they match a specific pattern.
 *
 * @param {Node, NodeList} targets: Dom Node or NodeList where the classes should be removed.
 * @param {string} classes: String matching classes to be removed.
 *                          You can add a "*" as wildcard to search for classes to be removed.
 *                          E.g. "icon-*-alert" to remove any of "icon-1-alert icon-2-alert".
 *
 * @returns {undefined}: This method directly operates on the targets.
 */
function removeWildcardClass(targets, classes) {
    targets = utils.ensureArray(targets);

    if (classes.indexOf("*") === -1) {
        for (const target of targets) {
            target.classList.remove(classes);
        }
    } else {
        let matcher = classes.replace(/[\-\[\]{}()+?.,\\\^$|#\s]/g, "\\$&");
        matcher = matcher.replace(/[*]/g, ".*");
        matcher = new RegExp("^" + matcher + "$");

        for (const target of targets) {
            const class_list = (target.getAttribute("class") || "").split(/\s+/);
            if (!class_list.length) {
                continue;
            }
            const ok = class_list.filter((it) => !matcher.test(it));
            if (ok.length) {
                target.setAttribute("class", ok.join(" "));
            } else {
                target.removeAttribute("class");
            }
        }
    }
}

function hasValue(el) {
    if (el.tagName === "INPUT") {
        if (el.type === "checkbox" || el.type === "radio") {
            return el.checked;
        }
        return el.value !== "";
    }
    if (el.tagName === "SELECT") {
        return el.selectedIndex !== -1;
    }
    if (el.tagName === "TEXTAREA") {
        return el.value !== "";
    }
    return false;
}

const hideOrShow = (nodes, visible, options, pattern_name) => {
    nodes = dom.toNodeArray(nodes);

    const transitions = {
        none: { hide: "hide", show: "show" },
        fade: { hide: "fadeOut", show: "fadeIn" },
        slide: { hide: "slideUp", show: "slideDown" },
    };

    const duration =
        options.transition === "css" || options.transition === "none"
            ? null
            : options.effect.duration;

    const on_complete = (el) => {
        el.classList.remove("in-progress");
        el.classList.add(visible ? "visible" : "hidden");
        $(el).trigger("pat-update", {
            pattern: pattern_name,
            transition: "complete",
        });
    };

    for (const el of nodes) {
        el.classList.remove("visible");
        el.classList.remove("hidden");
        el.classList.remove("in-progress");

        if (duration) {
            const t = transitions[options.transition];
            el.classList.add("in-progress");
            $(el).trigger("pat-update", {
                pattern: pattern_name,
                transition: "start",
            });
            $(el)[visible ? t.show : t.hide]({
                duration: duration,
                easing: options.effect.easing,
                complete: () => on_complete(el),
            });
        } else {
            if (options.transition !== "css") {
                dom[visible ? "show" : "hide"](el);
            }
            on_complete(el);
        }
    }
};

function addURLQueryParameter(fullURL, param, value) {
    /* Using a positive lookahead (?=\=) to find the given parameter,
     * preceded by a ? or &, and followed by a = with a value after
     * than (using a non-greedy selector) and then followed by
     * a & or the end of the string.
     *
     * Taken from http://stackoverflow.com/questions/7640270/adding-modify-query-string-get-variables-in-a-url-with-javascript
     */
    var val = new RegExp("(\\?|\\&)" + param + "=.*?(?=(&|$))"),
        parts = fullURL.toString().split("#"),
        url = parts[0],
        hash = parts[1],
        qstring = /\?.+$/,
        newURL = url;
    // Check if the parameter exists
    if (val.test(url)) {
        // if it does, replace it, using the captured group
        // to determine & or ? at the beginning
        newURL = url.replace(val, "$1" + param + "=" + value);
    } else if (qstring.test(url)) {
        // otherwise, if there is a query string at all
        // add the param to the end of it
        newURL = url + "&" + param + "=" + value;
    } else {
        // if there's no query string, add one
        newURL = url + "?" + param + "=" + value;
    }
    if (hash) {
        newURL += "#" + hash;
    }
    return newURL;
}

function removeDuplicateObjects(objs) {
    /* Given an array of objects, remove any duplicate objects which might
     * be present.
     */
    const comparator = function (k, v) {
        return this[k] === v;
    };

    return objs.reduce(function (list, next_obj) {
        let is_duplicate = false;
        for (const obj of list) {
            is_duplicate =
                Object.keys(obj).length === Object.keys(next_obj).length &&
                Object.entries(obj).filter(
                    (it) => !comparator.bind(next_obj)(it[0], it[1])
                ).length === 0;
        }
        if (!is_duplicate) {
            list.push(next_obj);
        }
        return list;
    }, []);
}

function mergeStack(stack, length) {
    /* Given a list of lists of objects (which for brevity we call a stack),
     * return a list of objects where each object is the merge of all the
     * corresponding original objects at that particular index.
     *
     * If a certain sub-list doesn't have an object at that particular
     * index, the last object in that list is merged.
     */
    const results = [];
    for (let i = 0; i < length; i++) {
        results.push({});
    }
    for (const frame of stack) {
        const frame_length = frame.length - 1;
        for (let x = 0; x < length; x++) {
            results[x] = $.extend(
                results[x] || {},
                frame[x > frame_length ? frame_length : x]
            );
        }
    }
    return results;
}

function isElementInViewport(el, partial = false, offset = 0) {
    /* returns true if element is visible to the user ie. is in the viewport.
     * Setting partial parameter to true, will only check if a part of the element is visible
     * in the viewport, specifically that some part of that element is touching the top part
     * of the viewport. This only applies to the vertical direction, ie. doesnt check partial
     * visibility for horizontal scrolling
     * some code taken from:
     * http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
     */
    if (el instanceof $) {
        el = el[0];
    }

    const rec = el.getBoundingClientRect();
    const rec_values = [rec.top, rec.bottom, rec.left, rec.right];

    if (rec_values.every((val) => val === 0)) {
        // if every property of rec is 0, the element is invisible;
        return false;
    } else if (partial) {
        // when using getBoundingClientRect() (in the vertical case)
        // negative means above top of viewport, positive means below top of viewport
        // therefore for part of the element to be touching or crossing the top of the viewport
        // rec.top must <= 0 and rec.bottom must >= 0
        // an optional tolerance offset can be added for when the desired element is not exactly
        // toucing the top of the viewport but needs to be considered as touching.
        return (
            rec.top <= 0 + offset && rec.bottom >= 0 + offset
            //(rec.top >= 0+offset && rec.top <= window.innerHeight) // this checks if the element
            // touches bottom part of viewport
            // XXX do we want to include a check for the padding of an element?
            // using window.getComputedStyle(target).paddingTop
        );
    } else {
        // this will return true if the entire element is completely in the viewport
        return (
            rec.top >= 0 &&
            rec.left >= 0 &&
            rec.bottom <=
                (window.innerHeight || document.documentElement.clientHeight) &&
            rec.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

/* parseTime - Parse a duration from a string and return the parsed time in milliseconds.
 *
 * @param {String} time - A duration/time string like ``1ms``, ``1s`` or ``1m``.
 *
 * @returns {Number} - A integer which represents the parsed time in milliseconds.
 */
function parseTime(time) {
    var m = /^(\d+(?:\.\d+)?)\s*(\w*)/.exec(time);
    if (!m) {
        throw new Error("Invalid time");
    }
    var amount = parseFloat(m[1]);
    switch (m[2]) {
        case "s":
            return Math.round(amount * 1000);
        case "m":
            return Math.round(amount * 1000 * 60);
        case "ms":
        default:
            return Math.round(amount);
    }
}

// Return a jQuery object with elements related to an input element.
function findRelatives(el) {
    var $el = $(el),
        $relatives = $(el),
        $label = $();

    $relatives = $relatives.add($el.closest("label"));
    $relatives = $relatives.add($el.closest("fieldset"));

    if (el.id) $label = $("label[for='" + el.id + "']");
    if (!$label.length) {
        var $form = $el.closest("form");
        if (!$form.length) $form = $(document.body);
        $label = $form.find("label[for='" + el.name + "']");
    }
    $relatives = $relatives.add($label);
    return $relatives;
}

function get_bounds(el) {
    // Return bounds of an element with it's values rounded and converted to ints.
    const bounds = el.getBoundingClientRect();
    return {
        x: parseInt(Math.round(bounds.x), 10) || 0,
        y: parseInt(Math.round(bounds.y), 10) || 0,
        top: parseInt(Math.round(bounds.top), 10) || 0,
        bottom: parseInt(Math.round(bounds.bottom), 10) || 0,
        left: parseInt(Math.round(bounds.left), 10) || 0,
        right: parseInt(Math.round(bounds.right), 10) || 0,
        width: parseInt(Math.round(bounds.width), 10) || 0,
        height: parseInt(Math.round(bounds.height), 10) || 0,
    };
}

function checkInputSupport(type, invalid_value) {
    /* Check input type support.
     *  See: https://stackoverflow.com/a/10199306/1337474
     */
    let support = false;
    const input = document.createElement("input");
    input.setAttribute("type", type);
    support = input.type == type;

    if (invalid_value !== undefined) {
        // Check for input type UI support
        input.setAttribute("value", invalid_value);
        support = input.value !== invalid_value;
    }
    return support;
}

const checkCSSFeature = (attribute, value, tag = "div") => {
    /* Check for browser support of specific CSS feature.
     */
    tag = document.createElement(tag);
    let supported = tag.style[attribute] !== undefined;
    if (supported && value !== undefined) {
        tag.style[attribute] = value;
        supported = tag.style[attribute] === value;
    }
    return supported;
};

const animation_frame = () => {
    // Return promise to await next repaint cycle
    // Use it in your async function like so: ``await utils.animation_frame()``
    // From: http://www.albertlobo.com/fractals/async-await-requestanimationframe-buddhabrot
    return new Promise(window.requestAnimationFrame);
};

const timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const debounce = (func, ms, timer = { timer: null }) => {
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds.
    // From: https://underscorejs.org/#debounce
    //
    // Make sure to initialize ``debounce`` only once per to-be-debounced
    // function to not reinitialize the timer each time and debounce not being
    // able to cancel previouse runs.
    //
    // Pass a module-global timer as an object ``{ timer: null }`` if you want
    // to also cancel debounced functions from other pattern-invocations.
    //
    return function () {
        clearTimeout(timer.timer);
        const args = arguments;
        timer.timer = setTimeout(() => func.apply(this, args), ms);
    };
};

const isIE = () => {
    // See: https://stackoverflow.com/a/9851769/1337474
    // Internet Explorer 6-11
    return /*@cc_on!@*/ false || !!document.documentMode;
};

const jqToNode = (el) => {
    // Return a DOM node if a jQuery node was passed.
    if (el.jquery) {
        el = el[0];
    }
    return el;
};

/**
 * Always return an iterable object.
 *
 * @param {any} it: The object which needs to be wrapped in an array or returned as is if it is iterable.
 * @param {boolean} force_array: If the object is iterable but not an Array, convert it to an array (e.g. For jQuery items or NodeList objects).
 *
 * @returns {Array}: Returns the object wrapped in an Array, expanded to an Array or as-is if it is already iterable.
 */
const ensureArray = (it, force_array) => {
    // Ensure to return always an array
    const array_like = !!(
        NodeList.prototype.isPrototypeOf(it) || // eslint-disable-line no-prototype-builtins
        Array.isArray(it) ||
        it.jquery
    );
    return array_like ? (force_array ? [...it] : it) : [it];
};

const localized_isodate = (date) => {
    // Return a iso date (date only) in the current timezone instead of a
    // UTC ISO 8601 date+time component which toISOString returns.

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    return `${year}-${month}-${day}`;
};

/**
 * Replace HTML reserved characters with html entities to add HTML for user
 * editing to e.g. a textarea or a contenteditable.
 *
 * See:
 *  https://stackoverflow.com/a/22706073/1337474
 *  https://developer.mozilla.org/en-US/docs/Glossary/Entity#reserved_characters
 *
 * @param {string} html - The HTML string to encode.
 *
 * @returns {string} - Returns the escaped html string:
 *                     ``&`` will be replaced with ``&amp;``.
 *                     ``<`` will be repalced with ``&lt;``,
 *                     ``>`` will be replaced with ``&gt;``,
 *                     ``"`` will be replaced with ``&quot;``.
 */
const escape_html = (html) => {
    if (!html) {
        return "";
    }
    const el = document.createElement("div");
    el.appendChild(document.createTextNode(html));
    // Return escaped html and also replace quotes.
    return el.innerHTML.replace(/"/g, "&quot;");
};

/**
 * Return unescaped, raw HTML from an escaped HTML  string.
 *
 * See:
 *  https://stackoverflow.com/a/34064434/1337474
 *  https://developer.mozilla.org/en-US/docs/Glossary/Entity#reserved_characters
 *
 * @param {string} escaped_html - The HTML string to decode.
 *
 * @returns {string} - Returns the escaped html string:
 *                     ``&amp;`` will be replaced with ``&``,
 *                     ``&lt;`` will be repalced with ``<``,
 *                     ``&gt;`` will be replaced with ``>``,
 *                     ``&quot;`` will be replaced with ``"``.
 */
const unescape_html = (escaped_html) => {
    if (!escaped_html) {
        return "";
    }
    const doc = new DOMParser().parseFromString(escaped_html, "text/html");
    // Return unescaped html and also unescape quote named entities.
    return doc.documentElement.textContent.replace(/&quot;/g, '"');
};

/**
 * Return true, if the given value is a valid ISO 8601 date/time string with or without an optional time component.
 *
 * @param {String} value - The date/time value to be checked.
 * @param {Boolean} [optional_time=false] - True, if time component is optional.
 * @return {Boolean} - True, if the given value is a valid Date string. False if not.
 */
const is_iso_date_time = (value, optional_time = false) => {
    const re_date_time = optional_time
        ? /^\d{4}-[01]\d-[0-3]\d(T[0-2]\d:[0-5]\d)?$/
        : /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d$/;
    return re_date_time.test(value);
};

/**
 * Return true, if the given value is a valid ISO 8601 date string and without a time component.
 *
 * @param {String} value - The date value to be checked.
 * @return {Boolean} - True, if the given value is a valid ISO 8601 date string without a time component. False if not.
 */
const is_iso_date = (value) => {
    const re_date_time = /^\d{4}-[01]\d-[0-3]\d$/;
    return re_date_time.test(value);
};

/**
 * Return the number of days between two dates.
 * Based on: https://stackoverflow.com/a/15289883/1337474
 *
 * @param {Date} date_1 - First date to compare. We will substract date_2 from date_1.
 * @param {Date} date_2 - Second date to compare.
 * @return {Number} - The number of days between the two dates.
 */
const date_diff = (date_1, date_2) => {
    // Discard the time and time-zone information.
    const utc_1 = Date.UTC(date_1.getFullYear(), date_1.getMonth(), date_1.getDate());
    const utc_2 = Date.UTC(date_2.getFullYear(), date_2.getMonth(), date_2.getDate());

    return Math.floor((utc_1 - utc_2) / _MS_PER_DAY);
};

var utils = {
    // pattern pimping - own module?
    jqueryPlugin: jqueryPlugin,
    escapeRegExp: escapeRegExp,
    isObject: isObject,
    extend: extend,
    findLabel: findLabel,
    elementInViewport: elementInViewport,
    removeWildcardClass: removeWildcardClass,
    hideOrShow: hideOrShow,
    addURLQueryParameter: addURLQueryParameter,
    removeDuplicateObjects: removeDuplicateObjects,
    mergeStack: mergeStack,
    isElementInViewport: isElementInViewport,
    hasValue: hasValue,
    parseTime: parseTime,
    findRelatives: findRelatives,
    get_bounds: get_bounds,
    checkInputSupport: checkInputSupport,
    checkCSSFeature: checkCSSFeature,
    animation_frame: animation_frame,
    timeout: timeout,
    debounce: debounce,
    isIE: isIE,
    jqToNode: jqToNode,
    ensureArray: ensureArray,
    localized_isodate: localized_isodate,
    escape_html: escape_html,
    unescape_html: unescape_html,
    is_iso_date_time: is_iso_date_time,
    is_iso_date: is_iso_date,
    date_diff: date_diff,
    getCSSValue: dom.get_css_value, // BBB: moved to dom. TODO: Remove in upcoming version.
};

export default utils;
export { utils };
