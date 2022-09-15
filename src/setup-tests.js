// Extra test setup.

import jquery from "jquery";
global.$ = global.jQuery = jquery;

// Do not output error messages
import logging from "./core/logging";
logging.setLevel(50);
// level: FATAL

// patch dom.is_visible to not rely on jest-unavailable offsetWidth/Height but
// simply on el.hidden.
import dom from "./core/dom";
dom.is_visible = (el) => {
    return !el.hidden;
};

HTMLDialogElement.prototype.close = jest.fn().mockImplementation(function () {
    this.open = false;
});
