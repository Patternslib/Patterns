// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

// need this for async/await in tests
import "core-js/stable";
import "regenerator-runtime/runtime";

import jquery from "jquery";
global["$"] = global["jQuery"] = jquery;

jquery.expr.pseudos.visible = function () {
    // Fix jQuery ":visible" selector always returns false in JSDOM.
    // https://github.com/jsdom/jsdom/issues/1048#issuecomment-401599392
    return true;
};

// pat-fullscreen
document.requestFullscreen = jest.fn();
document.exitFullscreen = jest.fn();
document.fullscreenElement = jest.fn();
document.fullscreenEnabled = jest.fn();
document.fullscreenchange = jest.fn();
document.fullscreenerror = jest.fn();

// resize-observer
global["ResizeObserver"] = function () {
    // Just do nothing for now...
    return { observe: () => {} };
};

global.IntersectionObserver = class IntersectionObserver {
    constructor(callback) {
        this.callback = callback;
        if (! global.__patternslib_test_intersection_observers) {
           global.__patternslib_test_intersection_observers = [];
        }
        this._el = null;
        this._do_observe = false;
        this._cnt = 0;
        global.__patternslib_test_intersection_observers.push(this);
    }
    observe(el) {
        this._el = el;
        this._do_observe = true;
        this._set_entry(false);
    }
    unobserve() {
        this._do_observe = false;
    }
    disconnect() {
        this._do_observe = false;
    }
    takeRecords() {}
    _set_entry(is_intersecting=true) {
        if (! this._do_observe) {
            return;
        }
        this.callback([{
            isIntersecting: is_intersecting,
            target: this._el,
            // entry.boundingClientRect
            // entry.intersectionRatio
            // entry.intersectionRect
            // entry.rootBounds
            // entry.time
        }])
        this._cnt++;
    }
};

// Do not output error messages
import logging from "./core/logging";
logging.setLevel(50); // level: FATAL

// patch dom.is_visible to not rely on jest-unavailable offsetWidth/Height but
// simply on el.hidden.
import dom from "./core/dom";
dom.is_visible = (el) => {
    return !el.hidden;
};
