// Extra test setup.

import jquery from "jquery";
global.$ = global.jQuery = jquery;

jquery.expr.pseudos.visible = function () {
    // Fix jQuery ":visible" selector always returns false in JSDOM.
    // https://github.com/jsdom/jsdom/issues/1048#issuecomment-401599392
    return true;
};

// Do not output error messages
import logging from "./core/logging";
logging.setLevel(50);
// level: FATAL

// patch dom.is_visible to not rely on jest-unavailable offsetWidth/Height
import dom from "./core/dom";
dom.is_visible = (el) => {
    return !el.hidden && el.style.display !== "none";
};

// polyfill css.escape for jsdom
import("css.escape");

// NodeJS polyfill for window.crypto.randomUUID
import crypto from "crypto";
window.crypto.randomUUID = () => crypto.randomUUID();
