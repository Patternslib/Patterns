(function () {
    // JavaScript feature detection.
    // If JavaScript is available, `js` will be added to the HTML class list.
    // This is needed for accessibility reasons, to support browsers and
    // situations where JavaScript is not available or disabled.
    // NOTE: The HTML root tag needs to have the `no-js` class set which is
    // then replaced by `js`.
    const html = document.getElementsByTagName("html")[0];
    if (html.classList.contains("no-js")) {
        html.classList.remove("no-js");
        html.classList.add("js");
    }
})();
