var script_source = function () {
    // See: https://stackoverflow.com/a/984656/1337474
    var scripts = document.getElementsByTagName("script");
    var script = scripts[scripts.length - 1];

    if (script.getAttribute.length !== undefined) {
        return script.src;
    }

    // Some IE quirks
    return script.getAttribute("src", -1);
};

(function () {
    // https://stackoverflow.com/a/8578840/1337474
    // if IE
    if (/*@cc_on!@*/ false || !!document.documentMode) {
        var script_url = script_source();
        script_url = script_url.substring(0, script_url.lastIndexOf("/")) + "/";

        var script_tag = document.createElement("script");
        script_tag.type = "text/javascript";
        script_tag.src = script_url + "bundle-polyfills.min.js";
        document.getElementsByTagName("head")[0].appendChild(script_tag);
    }
})();
