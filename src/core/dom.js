/* Utilities for DOM traversal or navigation */

const DATA_STYLE_DISPLAY = "__patternslib__style__display";

const jqToNode = (el) => {
    // Return a DOM node if a jQuery node was passed.
    if (el.jquery) {
        el = el[0];
    }
    return el;
};

const querySelectorAllAndMe = (el, selector) => {
    // Like querySelectorAll but including the element where it starts from.
    // Returns an Array, not a NodeList

    el = jqToNode(el); // Ensure real DOM node.

    const all = [...el.querySelectorAll(selector)];
    if (el.matches(selector)) {
        all.unshift(el); // start element should be first.
    }
    return all;
};

const wrap = (el, wrapper) => {
    // Wrap a element with a wrapper element.
    // See: https://stackoverflow.com/a/13169465/1337474
    el = jqToNode(el); // Ensure real DOM node.
    wrapper = jqToNode(wrapper); // Ensure real DOM node.

    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
};

const hide = (el) => {
    // Hides the element with ``display: none``
    el = jqToNode(el); // Ensure real DOM node.
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
    el = jqToNode(el); // Ensure real DOM node.
    const val = el[DATA_STYLE_DISPLAY] || null;
    el.style.display = val;
    delete el[DATA_STYLE_DISPLAY];
};

const dom = {
    jqToNode: jqToNode,
    querySelectorAllAndMe: querySelectorAllAndMe,
    wrap: wrap,
    hide: hide,
    show: show,
};

export default dom;
