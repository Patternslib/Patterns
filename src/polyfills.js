// Polyfills for older browsers, most notably IE11.
// Usage:
//   require(["pat-polyfills"]);

define([
    "promise-polyfill",
    "intersection-observer",
    "url-polyfill",
], function (PromisePolyfill, IntersectionObserverPolyfill, URLPolyfill) {
    // Dummy return to not break jshint rules and to include the polyfills in the compiled bundle.
    return {
        PromisePolyfill: PromisePolyfill,
        IntersectionObserverPolyfill: IntersectionObserverPolyfill,
        URLPolyfill: URLPolyfill
    };
});
