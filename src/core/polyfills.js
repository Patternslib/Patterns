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
