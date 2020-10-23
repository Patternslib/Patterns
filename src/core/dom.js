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

const wrap = (el, wrapper) => {
    // Wrap a element with a wrapper element.
    // See: https://stackoverflow.com/a/13169465/1337474
    el = jqToNode(el); // Ensure real DOM node.
    wrapper = jqToNode(wrapper); // Ensure real DOM node.

    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
};

const dom = {
    jqToNode: jqToNode,
    querySelectorAllAndMe: querySelectorAllAndMe,
    wrap: wrap,
};

export default dom;
