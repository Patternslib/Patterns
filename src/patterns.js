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
// import pat_logger from './core/logger.js';

// Import base
import pat_registry from "./core/registry.js";
import jquery from import $ from "jquery";;
import "prefixfree";

// Import all used patterns for the bundle to be generated
/*
import pat_ajax from './pat/ajax/ajax.js';
import pat_autofocus from './pat/autofocus/autofocus.js';
import pat_autoscale from './pat/auto-scale/auto-scale.js';
import pat_autosubmit from './pat/auto-submit/auto-submit.js';
import pat_autosuggest from './pat/auto-suggest/auto-suggest.js';
import pat_breadcrumbs from './pat/breadcrumbs/breadcrumbs.js';
import pat_bumper from './pat/bumper/bumper.js';
import pat_calendar from './pat/calendar/calendar.js';
import pat_carousel from './pat/carousel/carousel.js';
import pat_carousel_legacy from './pat/carousel-legacy/carousel-legacy.js';
import pat_checklist from './pat/checklist/checklist.js';
import pat_clone from './pat/clone/clone.js';
import pat_collapsible from './pat/collapsible/collapsible.js';
import pat_colour_picker from './pat/colour-picker/colour-picker.js';
import pat_date_picker from './pat/date-picker/date-picker.js';
import pat_datetime_picker from './pat/datetime-picker/datetime-picker.js';
import pat_depends from './pat/depends/depends.js';
import pat_display_time from './pat/display-time/display-time.js';
import pat_equaliser from './pat/equaliser/equaliser.js';
import pat_expandable from './pat/expandable-tree/expandable-tree.js';
import pat_focus from './pat/focus/focus.js';
import pat_form_state from './pat/form-state/form-state.js';
import pat_forward from './pat/forward/forward.js';
import pat_fullscreen from './pat/fullscreen/fullscreen.js';
import pat_fullscreen_close from './pat/fullscreen/fullscreen-close.js';
import pat_gallery from './pat/gallery/gallery.js';
import pat_image_crop from './pat/image-crop/image-crop.js';
import pat_inject from './pat/inject/inject.js';
import pat_input_change_events from './lib/input-change-events.js';
import pat_legend from './pat/legend/legend.js';
import pat_markdown from './pat/markdown/markdown.js';
import pat_menu from './pat/menu/menu.js';
import pat_modal from './pat/modal/modal.js';
import pat_navigation from './pat/navigation/navigation.js';
import pat_notification from './pat/notification/notification.js';
import pat_masonry from './pat/masonry/masonry.js';
import pat_placeholder from './pat/placeholder/placeholder.js';
import pat_scroll from './pat/scroll/scroll.js';
import pat_selectbox from './pat/selectbox/selectbox.js';
import pat_slides from './pat/slides/slides.js';
import pat_slideshow_builder from './pat/slideshow-builder/slideshow-builder.js';
import pat_sortable from './pat/sortable/sortable.js';
import pat_stacks from './pat/stacks/stacks.js';
import pat_sticky from './pat/sticky/sticky.js';
import pat_subform from './pat/subform/subform.js';
import pat_switch from './pat/switch/switch.js';
import pat_syntax_highlight from './pat/syntax-highlight/syntax-highlight.js';
import pat_tabs from './pat/tabs/tabs.js';
import pat_toggle from './pat/toggle/toggle.js';
import pat_tooltip from './pat/tooltip/tooltip.js';
import pat_tooltip_ng from './pat/tooltip-ng/tooltip-ng.js';
import pat_url from './core/url.js';
import pat_validation from './pat/validation/validation.js';
import pat_zoom from './pat/zoom/zoom.js';
import scroll_detection from './core/scroll_detection.js';
// import pat_push_kit from './core/push_kit.js';
// import pat_chosen from './pat/chosen/chosen.js';
*/

import pat_fullscreen from "./pat/fullscreen/fullscreen.js";

// Import locales for moment
import "moment/locale/de";
// import 'moment/locale/bg';
// import 'moment/locale/hr';
// import 'moment/locale/cs';
// import 'moment/locale/da';
// import 'moment/locale/nl';
// import 'moment/locale/es';
// import 'moment/locale/fi';
// import 'moment/locale/fr';
// import 'moment/locale/el';
// import 'moment/locale/hu';
// import 'moment/locale/it';
// import 'moment/locale/lt';
// import 'moment/locale/lv';
// import 'moment/locale/mt';
// import 'moment/locale/pl';
// import 'moment/locale/pt';
// import 'moment/locale/ro';
// import 'moment/locale/sl';
// import 'moment/locale/sk';
// import 'moment/locale/es';
// import 'moment/locale/sv';

window.jQuery = jquery;
jquery(() => pat_registry.init());

//     // Since we are in a non-AMD env, register a few useful utilites
//     var window = require("window");

export default { pat_fullscreen };
