// Load modernizr and the `html.js` feature class.
import "./core/feature-detection";

// Webpack entry point for module federation.
import "@patternslib/dev/webpack/module_federation";

// The next import needs to be kept with parentheses, otherwise we get this error:
// "Shared module is not available for eager consumption."
import("./patterns");

// Register jQuery gloablly as soon as this script is executed.
async function register_global_libraries() {
    const jquery = (await import("jquery")).default;
    window.jQuery = jquery;
    window.$ = jquery;
}
register_global_libraries();
