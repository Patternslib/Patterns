/* Utilities for DOM traversal or navigation */
import events from "./events";

const DATA_PREFIX = "__patternslib__data_prefix__";
const DATA_STYLE_DISPLAY = "__patternslib__style__display";

/**
 * Return an array of DOM nodes.
 *
 * @param {Node|NodeList|jQuery} nodes - The DOM node to start the search from.
 *
 * @returns {Array} - An array of DOM nodes.
 */
const toNodeArray = (nodes) => {
    if (nodes.jquery || nodes instanceof NodeList) {
        // jQuery or document.querySelectorAll
        nodes = [...nodes];
    } else if (nodes instanceof Array === false) {
        nodes = [nodes];
    }
    return nodes;
};

/**
 * Like querySelectorAll but including the element where it starts from.
 * Returns an Array, not a NodeList
 *
 * @param {Node} el - The DOM node to start the search from.
 *
 * @returns {Array} - The DOM nodes found.
 */
const querySelectorAllAndMe = (el, selector) => {
    if (!el) {
        return [];
    }

    const all = [...el.querySelectorAll(selector)];
    if (el.matches(selector)) {
        all.unshift(el); // start element should be first.
    }
    return all;
};

/**
 * Wrap a element with a wrapper element.
 *
 * @param {Node} el - The DOM node to wrap.
 */
const wrap = (el, wrapper) => {
    // See: https://stackoverflow.com/a/13169465/1337474
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
};

/**
 * Hides the element with ``display: none`` and stores the current display value.
 *
 * @param {Node} el - The DOM node to hide.
 */
const hide = (el) => {
    if (el.style.display === "none") {
        // Nothing to do.
        return;
    }
    if (el.style.display) {
        el[DATA_STYLE_DISPLAY] = el.style.display;
    }
    el.style.display = "none";
};

/**
 * Shows element by removing ``display: none`` and restoring the display value
 * to whatever it was before.
 *
 * @param {Node} el - The DOM node to show.
 */
const show = (el) => {
    const val = el[DATA_STYLE_DISPLAY] || null;
    el.style.display = val;
    delete el[DATA_STYLE_DISPLAY];
};

/**
 * Test, if a element is visible or not.
 *
 * @param {Node} el - The DOM node to test.
 * @returns {Boolean} - True if the element is visible.
 */
const is_visible = (el) => {
    // Check, if element is visible in DOM.
    // https://stackoverflow.com/a/19808107/1337474
    return el.offsetWidth > 0 && el.offsetHeight > 0;
};

/**
 * Test, if a element is a input-type element.
 *
 * This is taken from Sizzle/jQuery at:
 * https://github.com/jquery/sizzle/blob/f2a2412e5e8a5d9edf168ae3b6633ac8e6bd9f2e/src/sizzle.js#L139
 * https://github.com/jquery/sizzle/blob/f2a2412e5e8a5d9edf168ae3b6633ac8e6bd9f2e/src/sizzle.js#L1773
 *
 * @param {Node} el - The DOM node to test.
 * @returns {Boolean} - True if the element is a input-type element.
 */
const is_input = (el) => {
    const re_input = /^(?:input|select|textarea|button)$/i;
    return re_input.test(el.nodeName);
};

/**
 * Return all direct parents of ``el`` matching ``selector``.
 * This matches against all parents but not the element itself.
 * The order of elements is from the search starting point up to higher
 * DOM levels.
 *
 * @param {Node} el - The DOM node to start the search from.
 * @param {String} selector - CSS selector to match against.
 * @returns {Array} - List of matching DOM nodes.
 */
const find_parents = (el, selector) => {
    const ret = [];
    let parent = el;
    while (parent) {
        parent = parent.parentNode?.closest?.(selector);
        if (parent) ret.push(parent);
    }
    return ret;
};

/**
 * Find an element in the whole DOM tree if the selector is an ID selector,
 * otherwise use the given element as the starting point.
 *
 * @param {Node} el - The DOM node to start the search from.
 * @param {String} selector - The CSS selector to search for.
 *
 * @returns {NodeList} - The DOM nodes found.
 *
 */
const find_scoped = (el, selector) => {
    // If the selector starts with an object id do a global search,
    // otherwise do a local search.
    return (selector.indexOf("#") === 0 ? document : el).querySelectorAll(selector);
};

/**
 * Return all HTMLElement parents of el, starting from the direct parent of el.
 * The document itself is excluded because it's not a real DOM node.
 *
 * @param {Node} el - The DOM node to start the search from.
 *
 * @returns {Array} - The DOM nodes found.
 */
const get_parents = (el) => {
    // Return all HTMLElement parents of el, starting from the direct parent of el.
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

/**
 * Get data stored directly on the node instance.
 * We are using a prefix to make sure the data doesn't collide with other attributes.
 *
 * @param el {Node} - The DOM node from which we want to retrieve the data.
 * @param name {String} - The name of the variable. Note - this is stored on
 *                        the DOM node prefixed with the DATA_PREFIX.
 * @param default_value {Any} - Optional default value.
 * @returns {Any} - The value which is stored on the DOM node.
 */
const get_data = (el, name, default_value) => {
    return el[`${DATA_PREFIX}${name}`] || default_value;
};

/**
 * Set and store data directly on the node instance.
 * We are using a prefix to make sure the data doesn't collide with other attributes.
 *
 * @param el {Node} - The DOM node which we want to store the data on.
 * @param name {String} - The name of the variable. Note - this is stored on
 *                        the DOM node prefixed with the DATA_PREFIX.
 * @param value {Any} - The value we want to store on the DOM node.
 */
const set_data = (el, name, value) => {
    el[`${DATA_PREFIX}${name}`] = value;
};

/**
 * Delete a variable from the node instance.
 * We are using a prefix to make sure the data doesn't collide with other attributes.
 *
 * @param el {Node} - The DOM node which we want to delete the variable from.
 * @param name {String} - The name of the variable. Note - this is stored on
 *                        the DOM node prefixed with the DATA_PREFIX.
 */
const delete_data = (el, name) => {
    delete el[`${DATA_PREFIX}${name}`];
};

/**
 * Simple template engine, based on JS template literal
 *
 * Please note: You cannot pass a template literal as template_string.
 * JavaScript itself would try to expand it and would fail.
 *
 * See: https://stackoverflow.com/a/37217166/1337474
 *
 * @param {String} template_string - The template string as a JavaScript template literal.
 *                                   For each variable in the template you have to use ``this``.
 *                                   E.g. if you pass ``{message: "ok"}`` as template_variables, you can use it like so:
 *                                   `<h1>${this.message}</h1>`
 * @param {Object} template_variables - Object literal with all the variables which should be used in the template.
 *
 * @returns {String} - Returns the a string as template expanded with the template_variables.
 */
const template = (template_string, template_variables = {}) => {
    return new Function("return `" + template_string + "`;").call(template_variables);
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
    is_input: is_input,
    create_from_string: create_from_string,
    get_css_value: get_css_value,
    find_scroll_container: find_scroll_container,
    get_data: get_data,
    set_data: set_data,
    delete_data: delete_data,
    template: template,
    add_event_listener: events.add_event_listener, // BBB export. TODO: Remove in an upcoming version.
    remove_event_listener: events.remove_event_listener, // BBB export. TODO: Remove in an upcoming version.
};

export default dom;
