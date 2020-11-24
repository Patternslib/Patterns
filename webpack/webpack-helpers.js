function top_head_insert(el) {
    // Insert element at the top of <head>
    // Used for injecting CSS via webpack before any other CSS
    // Note:
    // Keep code compatible with IE11 as long as we support it.
    var first_child = document.head.querySelectorAll("*")[0];
    if (first_child) {
        document.head.insertBefore(el, first_child);
    } else {
        document.head.append(el);
    }
}

module.exports = {
    top_head_insert: top_head_insert,
};
