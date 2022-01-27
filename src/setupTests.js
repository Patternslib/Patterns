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

// pat-subform
// See https://github.com/jsdom/jsdom/issues/1937#issuecomment-461810980
global["HTMLFormElement"].prototype.submit = () => {};

// resize-observer
global["ResizeObserver"] = function () {
    // Just do nothing for now...
    return { observe: () => {} };
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
