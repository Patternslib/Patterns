import utils from "./utils";

// Event related methods and event factories

// Event listener registration for easy-to-remove event listeners.
// once Safari supports the ``signal`` option for addEventListener we can abort
// event handlers by calling AbortController.abort().
export const event_listener_map = new Map();

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
    if (!event_listener_map.has(el)) {
        event_listener_map.set(el, new Map());
    }
    let _cb = cb;
    if (opts?.once === true) {
        // For `once` events, also remove the entry from the event_listener_map.
        _cb = (e) => {
            event_listener_map.get(el)?.delete(id);
            cb(e);
        };
    }
    // Only `capture` option is necessary for `removeEventListener`.
    event_listener_map
        .get(el)
        .set(id, [event_type, _cb, opts.capture ? opts : undefined]);
    el.addEventListener(event_type, _cb, opts);
};

/**
 * Remove an event listener from a DOM element under a unique id.
 *
 * If an element and id are given, the event listeners for the given element matching the id are removed.
 * If an element but no id is given, all event listeners for that element are removed.
 * If an id but no element is given, all event listeners for any element matching the id are removed.
 * If no element and no id are given, all event listeners are removed.
 *
 * The id can be a wildcard string, e.g. `test-*-event`, which would match any
 * event which starts with "test-" and ends with "-event". The wildcard "*" can
 * be anywhere in the string and also be used multiple times. If no wildcard is
 * present the search string is used for an exact match.
 *
 * @param {DOM Node} [el] - The element to register the event for.
 * @param {string} [id] - A unique id under which the event is registered.
 *                        Can be a wildcard string.
 *
 */
const remove_event_listener = (el, id) => {
    const els = el ? [el] : event_listener_map.keys();
    for (const el of els) {
        if (!el?.removeEventListener) {
            return; // nothing to do.
        }
        const el_events = event_listener_map.get(el);
        if (!el_events) {
            return;
        }
        let entries;
        if (id) {
            // remove event listener with matching id
            entries = [...el_events.entries()].filter((entry) =>
                utils.regexp_from_wildcard(id).test(entry[0])
            );
        } else {
            // remove all event listeners of element
            entries = el_events.entries();
        }
        for (const entry of entries || []) {
            // Remove event listener
            el.removeEventListener(entry[1][0], entry[1][1], entry[1][2]);
            // Delete entry from event_listener_map
            event_listener_map.get(el).delete(entry[0]);
            // Delete element from event_listener_map if no more events are registered.
            if (!event_listener_map.get(el).size) {
                event_listener_map.delete(el);
            }
        }
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
        pattern.one("init", (e) => {
            if (e.target !== pattern.el) {
                // Don't handle bubbling init events from child elements. We
                // want to check on init events coming directly from this
                // Pattern's element.
                return;
            }
            // Resolve promise and unregister the not-init event handler.
            remove_event_listener(
                pattern.el,
                `basepattern-one--not-init.${pattern.name}.patterns`
            );
            resolve();
        });

        // Case not initialized
        pattern.one("not-init", (e) => {
            if (e.target !== pattern.el) {
                // Don't handle bubbling not-init events from child elements.
                // We want to check on not-init events coming directly from
                // this Pattern's element.
                return;
            }
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

/** Generic event factory.
 *
 * A event factory for a bubbling and cancelable generic event.
 *
 * @param {string} name - The event name.
 * @returns {Event} - Returns a blur event.
 */
const generic_event = (name) => {
    return new CustomEvent(name, {
        bubbles: true,
        cancelable: true,
    });
};

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

const submit_event = ({ submitter } = { submitter: undefined }) => {
    const event = new Event("submit", {
        bubbles: true,
        cancelable: true,
    });
    event.submitter = submitter; // undefined or the submitting element
    return event;
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
    event: generic_event,
    generic_event: generic_event,
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
