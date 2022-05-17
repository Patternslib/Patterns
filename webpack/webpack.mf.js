const { ModuleFederationPlugin } = require("webpack").container;
const local_package_json = require("../package.json");

// Patternslib Module Federation bundle prefix.
// This is used to filter for module federation enabled bundles.
// NOTE: This is also defined in ``module_federation.js``.
const MF_NAME_PREFIX = "__patternslib_mf__";

function shared_from_dependencies(...dependencies) {
    const shared = {};
    for (const deps of dependencies) {
        if (!deps) {
            continue;
        }
        for (const [name, version] of Object.entries(deps)) {
            shared[name] = {
                singleton: true,
                requiredVersion: version,
            };
            if (name === "underscore") {
                // Underscore, for some reason, needs to have the version set explicitly
                shared[name].requiredVersion = "1.13.2";
            }
        }
    }
    return shared;
}

function config({ name, filename = "remote.min.js", package_json, remote_entry }) {
    // If no name is given, use the package name.
    name = name || package_json?.name || local_package_json.name;

    // Create a JS-variable compatible name and add a prefix.
    const normalized_bundle_name =
        MF_NAME_PREFIX + name.match(/([_$A-Za-z0-9])/g).join("");

    return new ModuleFederationPlugin({
        name: normalized_bundle_name,
        ...(remote_entry && {
            filename: filename,
            exposes: {
                "./main": remote_entry,
            },
        }),
        shared: {
            ...shared_from_dependencies(
                local_package_json.dependencies,
                package_json?.dependencies
            ),
        },
    });
}

// Default export
const module_exports = (module.exports = config);

// Named exports
module_exports.config = config;
module_exports.MF_NAME_PREFIX = MF_NAME_PREFIX;
module_exports.shared_from_dependencies = shared_from_dependencies;
