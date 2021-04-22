// Polyfills for older browsers, most notably IE11.
// Usage: Import this module
//      import "@patternslib/patternslib/src/polyfills";

// Core JS features
// You can also import individual core-js features:
//import "core-js/stable/object/assign";
// But we're importing them all:
import "core-js/stable";

// Web APIs
import "intersection-observer";
import "promise-polyfill/src/polyfill";
import "url-polyfill";
import "whatwg-fetch";
import { ResizeObserver as ResizeObserverPolyfill } from "@juggle/resize-observer";

if ("ResizeObserver" in window === false) {
    window.ResizeObserver = ResizeObserverPolyfill;
}

// Node.closest polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#polyfill
if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
        var el = this;
        do {
            if (Element.prototype.matches.call(el, s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}
// END Node.closest polyfill

if (!document.currentScript) {
    var scripts = document.getElementsByTagName("script");
    document.currentScript = scripts.length && scripts[scripts.length - 1];
}

// Node.remove polyfill
// From: https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove#polyfill
// From: https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
(function (arr) {
    arr.forEach(function (item) {
        // eslint-disable-next-line no-prototype-builtins
        if (item.hasOwnProperty("remove")) {
            return;
        }
        Object.defineProperty(item, "remove", {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function remove() {
                this.parentNode.removeChild(this);
            },
        });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
// END Node.remove polyfill

// input.labels polyfill
