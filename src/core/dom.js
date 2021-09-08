/* Utilities for DOM traversal or navigation */

const DATA_STYLE_DISPLAY = "__patternslib__style__display";

const toNodeArray = (nodes) => {
    // Return an array of DOM nodes
    if (nodes.jquery || nodes instanceof NodeList) {
        // jQuery or document.querySelectorAll
        nodes = [...nodes];
    } else if (nodes instanceof Array === false) {
        nodes = [nodes];
    }
    return nodes;
};

const querySelectorAllAndMe = (el, selector) => {
    // Like querySelectorAll but including the element where it starts from.
    // Returns an Array, not a NodeList

    if (!el) {
        return [];
    }

    const all = [...el.querySelectorAll(selector)];
    if (el.matches(selector)) {
        all.unshift(el); // start element should be first.
    }
    return all;
};

const wrap = (el, wrapper) => {
    // Wrap a element with a wrapper element.
    // See: https://stackoverflow.com/a/13169465/1337474

    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
};

const hide = (el) => {
    // Hides the element with ``display: none``
    if (el.style.display === "none") {
        // Nothing to do.
        return;
    }
    if (el.style.display) {
        el[DATA_STYLE_DISPLAY] = el.style.display;
    }
    el.style.display = "none";
};

const show = (el) => {
    // Shows element by removing ``display: none`` and restoring the display
    // value to whatever it was before.
    const val = el[DATA_STYLE_DISPLAY] || null;
    el.style.display = val;
    delete el[DATA_STYLE_DISPLAY];
};

const find_parents = (el, selector) => {
    // Return all direct parents of ``el`` matching ``selector``.
    // This matches against all parents but not the element itself.
    // The order of elements is from the search starting point up to higher
    // DOM levels.
    const ret = [];
    let parent = el?.parentNode?.closest?.(selector);
    while (parent) {
        ret.push(parent);
        parent = parent.parentNode?.closest?.(selector);
    }
    return ret;
};

const find_scoped = (el, selector) => {
    // If the selector starts with an object id do a global search,
    // otherwise do a local search.
    return (selector.indexOf("#") === 0 ? document : el).querySelectorAll(selector);
};

const get_parents = (el) => {
    // Return all HTMLElement parents of el, starting from the direct parent of el.
    // The document itself is excluded because it's not a real DOM node.
    const parents = [];
    let parent = el?.parentNode;
    while (parent) {
        parents.push(parent);
        parent = parent?.parentNode;
        parent = parent instanceof HTMLElement ? parent : null;
    }
    return parents;
};

const is_visible = (el) => {
    // Check, if element is visible in DOM.
    // https://stackoverflow.com/a/19808107/1337474
    return el.offsetWidth > 0 && el.offsetHeight > 0;
};

const create_from_string = (string) => {
    // Create a DOM element from a string.
    const div = document.createElement("div");
    div.innerHTML = string.trim();
    return div.firstChild;
};

// Event listener registration for easy-to-remove event listeners.
// once Safari supports the ``signal`` option for addEventListener we can abort
// event handlers by calling AbortController.abort().
const event_listener_map = {};

/**
 * Add an event listener to a DOM element under a unique id.
 * If a event is registered under the same id for the same element, the old hander is removed first.
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

const dom = {
    toNodeArray: toNodeArray,
    querySelectorAllAndMe: querySelectorAllAndMe,
    wrap: wrap,
    hide: hide,
    show: show,
    find_parents: find_parents,
    find_scoped: find_scoped,
    get_parents: get_parents,
    is_visible: is_visible,
    create_from_string: create_from_string,
    add_event_listener: add_event_listener,
    remove_event_listener: remove_event_listener,
};

export default dom;
