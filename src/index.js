// Webpack entry point for module federation.
import "../webpack/module_federation";
// The next import needs to be kept with parentheses, otherwise we get this error:
// "Shared module is not available for eager consumption."
import("./patterns");
