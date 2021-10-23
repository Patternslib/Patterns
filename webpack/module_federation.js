/**
 * Initialize dynamic module federation.
 */
import get_container from "./module_federation--dynamic-federation";

// Patternslib Module Federation bundle prefix.
// This is used to filter for module federation enabled bundles.
// NOTE: This is also defined in ``webpack.mf.js``.
export const MF_NAME_PREFIX = "__patternslib_mf__";

export async function initialize_remote({ remote_name, exposed_module = "./main" }) {
    const container = await get_container(remote_name);
    const factory = await container.get(exposed_module);
    const module = factory();
    return module;
}

function document_ready(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

document_ready(function () {
    // Automatically initialize all Module Federation enabled Patternslib based
    // bundles by filtering for the prefix ``__patternslib_mf__``.
    // Do this on document ready, as this is the time where all MF bundles have
    // been registered in the global namespace.
    const bundles = Object.keys(window).filter((it) => it.indexOf(MF_NAME_PREFIX) === 0);
    for (const bundle_name of bundles) {
        // Now load + initialize each bundle.
        initialize_remote({ remote_name: bundle_name });
        console.debug(
            `Patternslib Module Federation: Loaded and initialized bundle "${bundle_name}".`
        );
    }
});
