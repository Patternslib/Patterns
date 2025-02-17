// Polyfills for modern browsers

// SubmitEvent.submitter polyfill for Safari < 15.4 and jsDOM
// Original code: https://stackoverflow.com/a/61110260/1337474
// Also see: https://caniuse.com/?search=submitter
//
!(function () {
    let last_btn = null;
    const submitable_buttons = `button, input[type="button"], input[type="submit"], input[type="image"]`;
    document.addEventListener(
        "click",
        function (e) {
            if (!e.target.closest) return;
            last_btn = e.target.closest(submitable_buttons);
        },
        true
    );
    document.addEventListener(
        "submit",
        function (e) {
            if ("submitter" in e) return;
            const canditates = [document.activeElement, last_btn];
            last_btn = null;
            for (const candidate of canditates) {
                if (!candidate) continue;
                if (!candidate.form) continue;
                if (!candidate.matches(submitable_buttons)) continue;
                e.submitter = candidate;
                return;
            }
            e.submitter = e.target.querySelector(submitable_buttons);
        },
        true
    );
})();

// Navigation polyfill for Firefox and Safari, as of 2024-01-04
// NOTE: this is a very basic polyfill, it only supports firing a `navigate`
// event on location change and even that without interception support, etc.
!(function () {
    if (window.navigation == undefined) {

        class NavigationEvent extends CustomEvent {
            constructor() {
                super("navigate");
                this.destination = { url: undefined };
            }
        }

        // Create a navigation object on the window
        // We create a DOM element for the navigation object so that we can
        // attach events on it.
        window.navigation = document.createElement("div");

        const create_event = (args) => {
            const event = new NavigationEvent();
            event.destination.url = args[2];
            return event;
        };

        // Patch pushState to trigger an `navigate` event on the navigation
        // object when the URL changes.
        const pushState = window.history.pushState;
        window.history.pushState = function () {
            pushState.apply(window.history, arguments);
            window.navigation.dispatchEvent(create_event(arguments));
        };

        // Same with replaceState
        const replaceState = window.history.replaceState;
        window.history.replaceState = function () {
            replaceState.apply(window.history, arguments);
            window.navigation.dispatchEvent(create_event(arguments));
        };
    }
})();
