// Event related methods and event factories

// Event listener registration for easy-to-remove event listeners.
// once Safari supports the ``signal`` option for addEventListener we can abort
// event handlers by calling AbortController.abort().
const event_listener_map = {};

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

    if (!event_listener_map[el]) {
        event_listener_map[el] = {};
    }
    event_listener_map[el][id] = [event_type, cb, opts.capture ? opts : undefined]; // prettier-ignore
    el.addEventListener(event_type, cb, opts);
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
 * Event factories
 */

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

const input_event = () => {
    return new Event("input", {
        bubbles: true,
        cancelable: false,
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

export default {
    add_event_listener: add_event_listener,
    remove_event_listener: remove_event_listener,
    await_event: await_event,
    click_event: click_event,
    change_event: change_event,
    input_event: input_event,
    scroll_event: scroll_event,
    submit_event: submit_event,
};
