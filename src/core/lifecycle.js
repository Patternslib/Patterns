/**
 * Pattern lifecycle - automatically destroy patterns which were removed from
 * the DOM.
 *
 * A single MutationObserver watches the whole document for removed nodes.
 * For each batch of mutations with removals, all tracked pattern instances
 * are checked and those whose element is not connected to the document
 * anymore are destroyed.
 *
 * Checking ``isConnected`` instead of searching the removed subtrees keeps
 * the cost at one pass over the live instances per mutation batch and
 * correctly handles nodes which are moved within the same task (removed and
 * re-inserted before the observer callback runs).
 *
 * Nodes which are detached and re-inserted in a later task are destroyed.
 */
import logging from "./logging";

const log = logging.getLogger("lifecycle");

const live_instances = new Set();
let observer = null;

function destroy_instance(instance) {
    // Untrack first, so that the instance is not destroyed again even if
    // a subclass' ``destroy`` does not call ``super.destroy()``.
    live_instances.delete(instance);
    try {
        instance.destroy();
    } catch (e) {
        log.error(`Error destroying pattern ${instance.name}.`, e);
    }
}

function destroy_disconnected() {
    for (const instance of live_instances) {
        if (instance.el.isConnected) {
            continue;
        }
        destroy_instance(instance);
    }
}

function on_mutations(records) {
    if (!records.some((record) => record.removedNodes.length)) {
        return;
    }
    destroy_disconnected();
}

function start_observer() {
    if (observer) {
        return;
    }
    observer = new MutationObserver(on_mutations);
    // Observe the root element instead of ``document.body`` so that replacing
    // the body element is noticed too.
    observer.observe(document.documentElement, { childList: true, subtree: true });
}

/**
 * Track a pattern instance and destroy it when its element is removed from
 * the document.
 *
 * Instances on elements which are not connected to the document are not
 * tracked. They would be destroyed immediately.
 *
 * @param {BasePattern} instance - The pattern instance.
 */
export function track(instance) {
    if (!instance?.el?.isConnected) {
        return;
    }
    live_instances.add(instance);
    start_observer();
}

/**
 * Stop tracking a pattern instance.
 *
 * @param {BasePattern} instance - The pattern instance.
 */
export function untrack(instance) {
    live_instances.delete(instance);
}

/**
 * Check if a pattern instance is tracked.
 *
 * @param {BasePattern} instance - The pattern instance.
 * @returns {boolean}
 */
export function is_tracked(instance) {
    return live_instances.has(instance);
}

export default { track, untrack, is_tracked };
