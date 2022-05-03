// Original from: https://github.com/manfredsteyer/plugin-demo.git
// Ref: https://github.com/thet/module-federation-minimaltest.git

// Helper functions for dynamic federation
// Wrapper around webpack runtime api

const containerMap = {};
let isDefaultScopeInitialized = false;

async function getContainer(key) {
    const container = window[key];

    // Do we still need to initialize the remote?
    if (containerMap[key]) {
        return container;
    }

    // Do we still need to initialize the share scope?
    if (!isDefaultScopeInitialized) {
        await __webpack_init_sharing__("default");
        isDefaultScopeInitialized = true;
    }

    await container.init(__webpack_share_scopes__.default);

    // remember that container has been initialized
    containerMap[key] = true;
    return container;
}

export async function loadRemoteModule({ remoteName, exposedModule }) {
    const container = await getContainer(remoteName);
    const factory = await container.get(exposedModule);
    const module = factory();
    return module;
}
