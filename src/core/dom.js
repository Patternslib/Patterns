/* Utilities for DOM traversal or navigation */

const jqToNode = (el) => {
    // Return a DOM node if a jQuery node was passed.
    if (el.jquery) {
        el = el[0];
    }
    return el;
};

const dom = {
    jqToNode: jqToNode,
};

export default dom;
