/* Utilities for DOM traversal or navigation */

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

const dom = {
    jqToNode: jqToNode,
    querySelectorAllAndMe: querySelectorAllAndMe,
};

export default dom;
