/* Patterns bundle configuration.
 * All imports here will go into the compiled bundle.
 */

// Import base
import registry from "./core/registry";

// Import all used patterns for the bundle to be generated
import "./core/push_kit";
import "./pat/ajax/ajax";
import "./pat/auto-scale/auto-scale";
import "./pat/auto-submit/auto-submit";
import "./pat/auto-suggest/auto-suggest";
import "./pat/autofocus/autofocus";
import "./pat/breadcrumbs/breadcrumbs";
import "./pat/bumper/bumper";
import "./pat/calendar/calendar";
import "./pat/carousel/carousel";
import "./pat/checklist/checklist";
import "./pat/clone/clone";
import "./pat/clone-code/clone-code";
import "./pat/collapsible/collapsible";
import "./pat/colour-picker/colour-picker";
import "./pat/date-picker/date-picker";
import "./pat/datetime-picker/datetime-picker";
import "./pat/depends/depends";
import "./pat/display-time/display-time";
import "./pat/equaliser/equaliser";
import "./pat/expandable-tree/expandable-tree";
import "./pat/focus/focus";
import "./pat/form-state/form-state";
import "./pat/forward/forward";
import "./pat/fullscreen/fullscreen-close";
import "./pat/fullscreen/fullscreen";
import "./pat/gallery/gallery";
import "./pat/image-crop/image-crop";
import "./pat/inject/inject";
import "./pat/legend/legend"; // NOTE: Transforms <legend> tags to <p class="legend"> for styling reasons.
import "./pat/markdown/markdown";
import "./pat/masonry/masonry";
import "./pat/menu/menu";
import "./pat/modal/modal";
import "./pat/navigation/navigation";
import "./pat/notification/notification";
import "./pat/push/push";
import "./pat/scroll-box/scroll-box";
import "./pat/scroll/scroll";
import "./pat/selectbox/selectbox";
import "./pat/slides/slides";
import "./pat/sortable/sortable";
import "./pat/stacks/stacks";
import "./pat/subform/subform";
import "./pat/switch/switch";
import "./pat/syntax-highlight/syntax-highlight";
import "./pat/tabs/tabs";
import "./pat/toggle/toggle";
import "./pat/tooltip/tooltip";
import "./pat/validation/validation";
import "./pat/zoom/zoom";

// example pattern
import "./pat/minimalpattern/minimalpattern";

// External patterns
import "@patternslib/pat-content-mirror";
import "@patternslib/pat-doclock";
import "@patternslib/pat-shopping-cart";
import "@patternslib/pat-sortable-table";
import "@patternslib/pat-tiptap";
import "@patternslib/pat-upload";

// Importing pattern styles in JavaScript
// Set to ``true`` to include core styles via JavaScript
//window.__patternslib_import_styles = false;

registry.init();
