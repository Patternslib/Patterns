/* Utilities for DOM traversal or navigation */
import events from "./events";

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
    el.setAttribute("hidden", "");
};

const show = (el) => {
    // Shows element by removing ``display: none`` and restoring the display
    // value to whatever it was before.
    const val = el[DATA_STYLE_DISPLAY] || null;
    el.style.display = val;
    delete el[DATA_STYLE_DISPLAY];
    el.removeAttribute("hidden", "");
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

/**
 * Return the value of the first attribute found in the list of parents.
 *
 * @param {DOM element} el - The DOM element to start the acquisition search for the given attribute.
 * @param {string} attribute - Name of the attribute to search for.
 * @param {Boolean} include_empty - Also return empty values.
 * @param {Boolean} include_all - Return a list of attribute values found in all parents.
 *
 * @returns {*} - Returns the value of the searched attribute or a list of all attributes.
 */
const acquire_attribute = (
    el,
    attribute,
    include_empty = false,
    include_all = false
) => {
    let _el = el;
    const ret = []; // array for ``include_all`` mode.
    while (_el) {
        const val = _el.getAttribute(attribute);
        if (val || (include_empty && val === "")) {
            if (!include_all) {
                return val;
            }
            ret.push(val);
        }
        _el = _el.parentElement;
    }
    if (include_all) {
        return ret;
    }
};

const is_visible = (el) => {
    // Check, if element is visible in DOM.
    // https://stackoverflow.com/a/19808107/1337474
    return el.offsetWidth > 0 && el.offsetHeight > 0;
};

/**
 * Return a DocumentFragment from a given string.
 *
 * @param {String} string - The HTML structure as a string.
 *
 * @returns {DocumentFragment} - The DOM nodes as a DocumentFragment.
 */
const create_from_string = (string) => {
    // See: https://davidwalsh.name/convert-html-stings-dom-nodes
    return document.createRange().createContextualFragment(string.trim());
};

/**
 * Return a CSS property value for a given DOM node.
 * For length-values, relative values are converted to pixels.
 * Optionally parse as pixels, if applicable.
 *
 * Note: The element must be attached to the body to make CSS caluclations work.
 *
 * @param {Node} el - DOM node.
 * @param {String} property - CSS property to query on DOM node.
 * @param {Boolean} [as_pixels=false] - Convert value to pixels, if applicable.
 * @param {Boolean} [as_float=false] - Convert value to float, if applicable.
 *
 * @returns {(String|Number)} - The CSS value to return.
 */
function get_css_value(el, property, as_pixels = false, as_float = false) {
    let value = window.getComputedStyle(el).getPropertyValue(property);
    if (as_pixels || as_float) {
        value = parseFloat(value) || 0.0;
    }
    if (as_pixels && !as_float) {
        value = parseInt(Math.round(value), 10);
    }
    return value;
}

/**
 * Find a scrollable element up in the DOM tree.
 *
 * Note: Setting the ``overflow`` shorthand property also sets the individual overflow-y and overflow-y properties.
 *
 * @param {Node} el - The DOM element to start the search on.
 * @param {String} [direction=] - Not given: Search for any scrollable element up in the DOM tree.
 *                                ``x``: Search for a horizontally scrollable element.
 *                                ``y``: Search for a vertically scrollable element.
 * @param {(DOM Node|null)} [fallback=document.body] - Fallback, if no scroll container can be found.
 *                                                     The default is to use document.body.
 *
 * @returns {Node} - Return the first scrollable element.
 *                   If no other element could be found, document.body would be returned.
 */
const find_scroll_container = (el, direction, fallback = document.body) => {
    while (el && el !== document.body) {
        if (!direction || direction === "y") {
            let overflow_y = get_css_value(el, "overflow-y");
            if (["auto", "scroll"].includes(overflow_y)) {
                return el;
            }
        }
        if (!direction || direction === "x") {
            let overflow_x = get_css_value(el, "overflow-x");
            if (["auto", "scroll"].includes(overflow_x)) {
                return el;
            }
        }
        el = el.parentElement;
    }
    return fallback;
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
    acquire_attribute: acquire_attribute,
    is_visible: is_visible,
    create_from_string: create_from_string,
    get_css_value: get_css_value,
    find_scroll_container: find_scroll_container,
    add_event_listener: events.add_event_listener, // BBB export. TODO: Remove in an upcoming version.
    remove_event_listener: events.remove_event_listener, // BBB export. TODO: Remove in an upcoming version.
};

export default dom;
