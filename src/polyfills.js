// Polyfills for older browsers, most notably IE11.
// Usage: Import this module
//      import "patternslib/src/polyfills";

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
