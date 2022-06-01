# Patternslib Module Federation

## Introduction

For a general introduction see: https://webpack.js.org/concepts/module-federation/

Module Federation allows to share dependencies between bundles.
Each bundle includes the whole set of dependencies.
However, if multiple bundles have the same dependencies they are only loaded once.

For example, if bundle A and B both depend on jQuery and bundle A has already loaded it, bundle B can just reuse the already loaded jQuery file.
But if only bundle B is loaded, it uses its own bundled version of the jQuery library.

There is a host bundle - in the fictional example above our bundle "A".
Other bundles are "remotes" which are initialized for module federation by the host bundle "A"


## How to use it

- Create a new entry point ``index.js`` which only imports the normal entry point.

```
import("./patterns");
```

If you are creating a host bundle - one which is always present and initializes add-on bundles - then also import the ``module_federation`` module.
Importing is enough.
Mockup is such a host bundle.
Your ``index.js`` will then look like:

```
import "@patternslib/patternslib/webpack/module_federation";
import("./patterns");
```

- Add the module federation plugin in webpack. There is a configuration factory which you can use for that like so:

```
const package_json = require("./package.json");
const path = require("path");
const patternslib_config = require("@patternslib/patternslib/webpack/webpack.config");
const mf_config = require("@patternslib/patternslib/webpack/webpack.mf");

module.exports = (env, argv) => {
    let config = {
        entry: {
            "bundle.min": path.resolve(__dirname, "src/index.js"),
        },
    };

    config = patternslib_config(env, argv, config, ["mockup"]);

    // ...

    config.plugins.push(
        mf_config({
            package_json: package_json,
            remote_entry: config.entry["bundle.min"],
        })
    );

    return config;
};
```

That's basically it.

For more information look at the source code at ``@patternslib/webpack/module_federation`` and ``@patternslib/webpack/webpack.mf.js``.

