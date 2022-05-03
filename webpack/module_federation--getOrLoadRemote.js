// From:
//   https://twitter.com/ScriptedAlchemy/status/1505135006158532612
//   https://gist.github.com/ScriptedAlchemy/3a24008ef60adc47fad1af7d3299a063
//   https://github.com/module-federation/module-federation-examples/blob/master/dynamic-system-host/app1/src/utils/getOrLoadRemote.js

/**
 * Load remote module / bundle.
 *
 * Usage: load_remote("checkout", {default: {//shimShareScope}} || "default", "http://theRemote.com")
 *
 * @param {string} remote - the remote global name
 * @param {object | string} share_scope - the share_scope Object OR scope key
 * @param {string} remote_fallback_url - fallback url for remote module
 * @returns {Promise<object>} - Federated Module Container
 */
export const load_remote = (remote, share_scope, remote_fallback_url = undefined) =>
    new Promise((resolve, reject) => {
        // Check if remote exists globally.
        if (!window[remote]) {
            // Search dom to see if the remote exists as script tag.
            // It might still be loading (async).
            const existing_remote = document.querySelector(`[data-webpack="${remote}"]`);

            // When remote is loaded..
            const onload = async () => {
                // Check if it was initialized.
                if (!window[remote].__initialized) {
                    // If share scope doesn't exist (like in webpack 4) then
                    // expect share_scope to be a manual object.
                    if (typeof __webpack_share_scopes__ === "undefined") {
                        // Use default share scope object passed in manually.
                        await window[remote].init(share_scope.default);
                    } else {
                        // Otherwise, init share scope as usual.
                        await window[remote].init(__webpack_share_scopes__[share_scope]); // eslint-disable-line no-undef
                    }
                    // Mark remote as initialized
                    window[remote].__initialized = true;
                }
                // Resolve promise so marking remote as loaded.
                resolve();
            };

            if (existing_remote) {
                // If remote exists but was not loaded, hook into its onload
                // and wait for it to be ready.
                existing_remote.onload = onload;
                existing_remote.onerror = reject;
                // Check if remote fallback exists as param passed to function.
                // TODO: Should scan public config for a matching key if no
                // override exists.
            } else if (remote_fallback_url) {
                // Inject remote if a fallback exists and call the same onload
                // function
                const script = document.createElement("script");
                script.type = "text/javascript";
                // Mark as data-webpack so runtime can track it internally.
                script.setAttribute("data-webpack", `${remote}`);
                script.async = true;
                script.onerror = reject;
                script.onload = onload;
                script.src = remote_fallback_url;
                document.getElementsByTagName("head")[0].appendChild(script);
            } else {
                // No remote and no fallback exist, reject.
                reject(`Cannot Find Remote ${remote} to inject`);
            }
        } else {
            // Remote already instantiated, resolve
            resolve();
        }
    });
