# Using require.js to load your custom pattern

## Using the bundle

If you are using a precompiled bundle with require.js, then the following approach is appropriate:

You should have an entry point for `require.js` in this example `main.js`. So your html will contain:

```
<script data-main="main" src="require.js" type="text/javascript"></script>
```

In your `main.js`, you should define the `registry` module pointing to the bundle as well as any custom modules.
For the sake of simplicity we assume here that there is only one additional module defined that adds a custom pattern.

So our `main.js` looks like:

```
require.config({
    paths: {
        registry: 'bundle',
        custom: 'custom'
    },
});
define(['registry', 'custom'], function (registry, custom) {
    console.log(registry);
    console.log(custom);
    console.log(registry.patterns.custom);
});
```

## Without using the bundle

Not using the bundle, allows you to select patterns individually and gives you a bit more flexibility.
For this example we will assume that you want only the `ajax` pattern as well as the custom pattern defined in the previous section.

In this case, you will need to explicitly give the paths to all the modules you need.
In the case of the `ajax` pattern we depend on `jquery`, `jquery.form`, `logging`, `logger`, `parser`, `utils`, `compat`, `jquery-ext`, `registry`.

Your `main.js` will look similar to:

```
require.config({

    paths: {
        jquery: 'jquery',
        logging: 'logging',
        'jquery.form': 'jquery.form',

        logger: 'patterns_dir/core/logger',
        parser: 'patterns_dir/core/parser',
        utils: 'patterns_dir/core/utils',
        compat: 'patterns_dir/core/compat',
        'jquery-ext': 'patterns_dir/core/jquery-ext',

        registry: 'patterns_dir/core/registry',
        ajax: 'patterns_dir/pat/ajax',

        custom: 'custom'
    }
});

define(['registry', 'ajax', 'custom'], function (registry, ajax, custom) {
    console.log(registry);
    console.log(ajax);
    console.log(custom);
    console.log(registry.patterns.custom);
});
```
