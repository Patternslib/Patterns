// Author: Manfred Steyer <manfred.steyer@gmx.net>
// Author: Johannes Raggam <thetetet@gmail.com>

// From:
//   https://github.com/manfredsteyer/plugin-demo.git
//   https://github.com/thet/module-federation-minimaltest.git

/**
 * Load remote module / bundle.
 *
 * Wrapper around webpack runtime API
 *
 * Usage: get_container("bundle-name-xyz")
 *
 * @param {string} remote - the remote global name
 * @returns {Promise<object>} - Federated Module Container
 */
const container_map = {};
let is_default_scope_initialized = false;

export default async function get_container(remote) {
    const container = window[remote];

    // Do we still need to initialize the remote?
    if (container_map[remote]) {
        return container;
    }

    // Do we still need to initialize the shared scope?
    if (!is_default_scope_initialized) {
        await __webpack_init_sharing__("default"); // eslint-disable-line no-undef
        is_default_scope_initialized = true;
    }

    await container.init(__webpack_share_scopes__.default); // eslint-disable-line no-undef

    // Remember that the container has been initialized.
    container_map[remote] = true;
    return container;
}
