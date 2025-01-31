(function () {
    // Add JavaScript feature as class to the <html> element, just like
    // Modernizr does. This is needed for accessibility reasons, to support
    // browsers and situations where JavaScript is not available or disabled.
    // The HTML root tag needs to have the `no-js` class set which is then
    // replaced by `js`.
    const html = document.getElementsByTagName("html")[0];
    if (html.classList.contains("no-js")) {
        html.classList.remove("no-js");
        html.classList.add("js");
    }

    // NOTE: Modernizr will be removed in an upcoming minor release.

    // Do not load modernizr if disabled. It's enabled by default.
    // You might want to disable it for your project by setting:
    // window.__patternslib_disable_modernizr = true;
    if (window.__patternslib_disable_modernizr) {
        return;
    }

    // Get the current script tag's URL.
    const script_url = document.currentScript.src;
    // Get the base URL of the current script tag's URL.
    let base_url = script_url.substring(0, script_url.lastIndexOf("/")) + "/";
    // The modernizr script is located outside the chunks directory.
    base_url = base_url.replace("chunks/", "");

    // Inject a new one with the modernizr bundle.
    const script_tag = document.createElement("script");
    script_tag.src = base_url + "modernizr.min.js";
    document.getElementsByTagName("head")[0].appendChild(script_tag);
})();
