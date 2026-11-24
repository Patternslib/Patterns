// Translate native control events for patterns that observe inputs.
import $ from "jquery";
import logging from "../core/logging";

const namespace = "input-change-events";
const log = logging.getLogger(namespace);
const registrations = new WeakMap();
const control_references = new WeakMap();

function translate(event) {
    const type = event.type === "blur" ? "input-defocus" : "input-change";
    const form = this.form;
    const external = form && !form.contains(this);

    $(this).trigger(type);
    if (external) {
        // The control event cannot bubble to its form. Keep the source for form listeners.
        $(form).trigger(type, [this]);
    }
}

function registerControl(control) {
    const references = control_references.get(control) ?? 0;
    control_references.set(control, references + 1);
    if (references) {
        return;
    }

    const $control = $(control);
    const is_number = $control.is("input[type=number]");
    const is_text = $control.is("input:text, input[type=search], textarea");
    const change_event = is_text || is_number ? "input" : "change";

    $control.on(`${change_event}.${namespace} blur.${namespace}`, translate);
    if (is_number && "onkeyup" in window) {
        $control.on(`keyup.${namespace}`, translate);
    }
}

function unregisterControl(control) {
    const references = control_references.get(control);
    if (references > 1) {
        control_references.set(control, references - 1);
    } else {
        control_references.delete(control);
        $(control).off(`.${namespace}`, translate);
    }
}

function refreshControls(root, registration) {
    const $root = $(root);
    let $controls = $root.is(":input") ? $root : $root.find(":input");
    if ($root.is("form")) {
        $controls = $controls.add($(root.elements).filter(":input"));
    }

    const controls = new Set($controls.get());
    for (const control of registration.controls) {
        if (!controls.has(control)) {
            unregisterControl(control);
        }
    }
    for (const control of controls) {
        if (!registration.controls.has(control)) {
            registerControl(control);
        }
    }
    registration.controls = controls;
}

export default {
    setup($el, pat) {
        if (!pat) {
            log.error("The name of the calling pattern has to be set.");
            return;
        }

        for (const root of $el) {
            let registration = registrations.get(root);
            if (!registration) {
                registration = { patterns: new Set(), controls: new Set() };
                registrations.set(root, registration);
                $(root).on(`patterns-injected.${namespace}`, () => {
                    refreshControls(root, registration);
                });
            }
            registration.patterns.add(pat);
            refreshControls(root, registration);
        }
    },

    remove($el, pat) {
        for (const root of $el) {
            const registration = registrations.get(root);
            if (!registration?.patterns.delete(pat)) {
                log.warn("input-change-events were never installed for " + pat);
                continue;
            }
            if (!registration.patterns.size) {
                $(root).off(`patterns-injected.${namespace}`);
                for (const control of registration.controls) {
                    unregisterControl(control);
                }
                registrations.delete(root);
            }
        }
    },
};
