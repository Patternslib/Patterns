/* Patterns bundle configuration.
 *
 * This file is used to tell r.js which Patterns to load when it generates a
 * bundle. This is only used when generating a full Patterns bundle, or when
 * you want a simple way to include all patterns in your own project. If you
 * only want to use selected patterns you will need to pull in the patterns
 * directly in your RequireJS configuration.
 */

// // Imports for copy/paste
// import pat_base from './core/base.js';
// import pat_parser from './core/parser.js';

// Import base
import registry from "./core/registry.js";
import jquery from "jquery";

// Import all used patterns for the bundle to be generated
import "./core/push_kit.js";
import "./core/url.js";
import "./lib/input-change-events.js";
import "./pat/ajax/ajax.js";
import "./pat/auto-scale/auto-scale.js";
import "./pat/auto-submit/auto-submit.js";
import "./pat/auto-suggest/auto-suggest.js";
import "./pat/autofocus/autofocus.js";
import "./pat/breadcrumbs/breadcrumbs.js";
import "./pat/bumper/bumper.js";
import "./pat/calendar/calendar.js";
import "./pat/carousel/carousel.js";
import "./pat/checklist/checklist.js";
import "./pat/clone/clone.js";
import "./pat/collapsible/collapsible.js";
import "./pat/colour-picker/colour-picker.js";
import "./pat/date-picker/date-picker.js";
import "./pat/datetime-picker/datetime-picker.js";
import "./pat/depends/depends.js";
import "./pat/display-time/display-time.js";
import "./pat/equaliser/equaliser.js";
import "./pat/expandable-tree/expandable-tree.js";
import "./pat/focus/focus.js";
import "./pat/form-state/form-state.js";
import "./pat/forward/forward.js";
import "./pat/fullscreen/fullscreen-close.js";
import "./pat/fullscreen/fullscreen.js";
import "./pat/gallery/gallery.js";
import "./pat/image-crop/image-crop.js";
import "./pat/inject/inject.js";
import "./pat/legend/legend.js";
import "./pat/markdown/markdown.js";
import "./pat/masonry/masonry.js";
import "./pat/menu/menu.js";
import "./pat/modal/modal.js";
import "./pat/navigation/navigation.js";
import "./pat/notification/notification.js";
import "./pat/push/push.js";
import "./pat/scroll-box/scroll-box.js";
import "./pat/scroll/scroll.js";
import "./pat/selectbox/selectbox.js";
import "./pat/slides/slides.js";
import "./pat/sortable/sortable.js";
import "./pat/stacks/stacks.js";
import "./pat/sticky/sticky.js";
import "./pat/subform/subform.js";
import "./pat/switch/switch.js";
import "./pat/syntax-highlight/syntax-highlight.js";
import "./pat/tabs/tabs.js";
import "./pat/toggle/toggle.js";
import "./pat/tooltip/tooltip.js";
import "./pat/validation/validation.js";
import "./pat/zoom/zoom.js";

// example pattern
import "./pat/minimalpattern/minimalpattern";

window.jQuery = jquery;
registry.init();
