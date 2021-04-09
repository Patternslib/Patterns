// NOTE: Import this file before any other files
// Overwrite path to load resources or use default one.
__webpack_public_path__ = window.__patternslib_public_path__; // eslint-disable-line no-undef
// eslint-disable-next-line no-undef
if (!__webpack_public_path__) {
    // Get chunks path from current script.
    let src = document.currentScript?.src;
    if (src) {
        src = src.split("/");
        src.pop();
        __webpack_public_path__ = src.join("/") + "/"; // eslint-disable-line no-undef
    }
}
