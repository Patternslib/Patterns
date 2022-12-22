// Event related methods and event factories

// Event listener registration for easy-to-remove event listeners.
// once Safari supports the ``signal`` option for addEventListener we can abort
// event handlers by calling AbortController.abort().
export const event_listener_map = {};

/**
 * Add an event listener to a DOM element under a unique id.
 * If a event is registered under the same id for the same element, the old handler is removed first.
 *
 * @param {DOM Node} el - The element to register the event for.
 * @param {string} event_type - The event type to listen for.
 * @param {string} id - A unique id under which the event is registered.
 * @param {function} cb - The event handler / callback function.
 * @param {Object} opts - Options for the addEventListener API.
 *
 */
const add_event_listener = (el, event_type, id, cb, opts = {}) => {
    if (!el?.addEventListener) {
        return; // nothing to do.
    }
    remove_event_listener(el, id); // do not register one listener twice.

    // Create event_listener_map entry if not existent.
    if (!event_listener_map[el]) {
        event_listener_map[el] = {};
    }
    let _cb = cb;
    if (opts?.once === true) {
        // For `once` events, also remove the entry from the event_listener_map.
        _cb = (e) => {
            delete event_listener_map[el][id];
            cb(e);
        };
    }
    // Only `capture` option is necessary for `removeEventListener`.
    event_listener_map[el][id] = [event_type, _cb, opts.capture ? opts : undefined];
    el.addEventListener(event_type, _cb, opts);
};

/**
 * Remove an event listener from a DOM element under a unique id.
 *
 * @param {DOM Node} el - The element to register the event for.
 * @param {string} id - A unique id under which the event is registered.
 *
 */
const remove_event_listener = (el, id) => {
    if (!el?.removeEventListener) {
        return; // nothing to do.
    }
    const el_events = event_listener_map[el];
    if (!el_events) {
        return;
    }
    let entries;
    if (id) {
        // remove event listener with specific id
        const entry = el_events[id];
        entries = entry ? [entry] : [];
    } else {
        // remove all event listeners of element
        entries = Object.entries(el_events);
    }
    for (const entry of entries || []) {
        el.removeEventListener(entry[0], entry[1], entry[2]);
    }
};

/**
 * Await an event to be thrown.
 *
 * Usage:
 *     await events.await_event(button, "click");
 *
 * @param {DOM Node} el - The element to listen on.
 * @param {String} event_name - The event name to listen for.
 *
 * @returns {Promise} - Returns a Promise which can be used for ``await`` and which will be resolved when the event is throwm.
 *
 */
const await_event = (el, event_name) => {
    // See: https://stackoverflow.com/a/44746691/1337474
    return new Promise((resolve) =>
        el.addEventListener(event_name, resolve, { once: true })
    );
};

/**
 * Await pattern init.
 *
 * Usage:
 *     await events.await_pattern_init(PATTERN);
 *
 * @param {Pattern instance} pattern - The pattern instance.
 *
 * @returns {Promise} - Returns a Promise which can be used for ``await`` and which will be resolved when the event is throwm.
 *
 */
const await_pattern_init = (pattern) => {
    // See: https://stackoverflow.com/a/44746691/1337474
    return new Promise((resolve, reject) => {
        // Case initialized
        pattern.one("init", () => {
            // Resolve promise and unregister the not-init event handler.
            remove_event_listener(
                pattern.el,
                `basepattern-one--not-init.${pattern.name}.patterns`
            );
            resolve();
        });

        // Case not initialized
        pattern.one("not-init", () => {
            // Reject promise and unregister the init event handler.
            remove_event_listener(
                pattern.el,
                `basepattern-one--init.${pattern.name}.patterns`
            );
            reject();
        });
    }).catch(() => {
        throw new Error(`Pattern "${pattern.name}" not initialized.`);
    });
};

/**
 * Event factories
 */

const blur_event = () => {
    return new Event("blur", {
        bubbles: false,
        cancelable: false,
    });
};

const click_event = () => {
    return new Event("click", {
        bubbles: true,
        cancelable: true,
    });
};

const change_event = () => {
    return new Event("change", {
        bubbles: true,
        cancelable: false,
    });
};

const focus_event = () => {
    return new Event("focus", {
        bubbles: false,
        cancelable: false,
    });
};

const input_event = () => {
    return new Event("input", {
        bubbles: true,
        cancelable: false,
    });
};

const mousedown_event = () => {
    return new Event("mousedown", {
        bubbles: true,
        cancelable: true,
    });
};

const mouseup_event = () => {
    return new Event("mouseup", {
        bubbles: true,
        cancelable: true,
    });
};

const scroll_event = () => {
    return new Event("scroll", {
        bubbles: true,
        cancelable: false,
    });
};

const submit_event = () => {
    return new Event("submit", {
        bubbles: true,
        cancelable: true,
    });
};

const dragstart_event = () => {
    return new Event("dragstart", {
        bubbles: true,
        cancelable: true,
    });
};

const dragend_event = () => {
    return new Event("dragend", {
        bubbles: true,
        cancelable: true,
    });
};

export default {
    add_event_listener: add_event_listener,
    remove_event_listener: remove_event_listener,
    await_event: await_event,
    await_pattern_init: await_pattern_init,
    blur_event: blur_event,
    click_event: click_event,
    change_event: change_event,
    focus_event: focus_event,
    input_event: input_event,
    mousedown_event: mousedown_event,
    mouseup_event: mouseup_event,
    scroll_event: scroll_event,
    submit_event: submit_event,
    dragstart_event: dragstart_event,
    dragend_event: dragend_event,
};
