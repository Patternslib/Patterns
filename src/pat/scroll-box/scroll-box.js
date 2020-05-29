import $ from "jquery";
import Base from "../../core/base";


export default Base.extend({
  name: "scroll-box",
  trigger: ".pat-scroll-box",
  timeout: 200,

  init: function ($el) {
    const el = $el[0];
    let scroll_listener = el;
    if (scroll_listener === document.body) {
      scroll_listener = window;
    }

    // If scolling is not possible, exit.
    if (
      ! scroll_listener == window && (
          ['auto', 'scroll'].indexOf(getComputedStyle(el).overflow) === -1 ||
          ['auto', 'scroll'].indexOf(getComputedStyle(el).overflowY) === -1
        )
      ) {
        return;
    }

    let last_known_scroll_position = 0;
    let scroll_y = 0;
    let timeout_id = null;


    let set_scroll_classes = (scroll_pos) => {
      el.classList.remove("scroll-up");
      el.classList.remove("scroll-down");
      el.classList.remove("scroll-position-top");
      el.classList.remove("scroll-position-bottom");

      if (scroll_pos < last_known_scroll_position) {
        el.classList.add("scroll-up");
      } else if (last_known_scroll_position < scroll_pos) {
        el.classList.add("scroll-down");
      }

      if (scroll_pos === 0) {
        el.classList.add("scroll-position-top");
      } else if (
        scroll_listener === window &&
        window.innerHeight + scroll_pos >=
        el.scrollHeight
      ) {
        el.classList.add("scroll-position-bottom");
      } else if (
        scroll_listener !== window &&
        el.clientHeight + scroll_pos >=
        el.scrollHeight
      ) {
        el.classList.add("scroll-position-bottom");
      }

    };

    scroll_listener.addEventListener("scroll", (e) => {
      if (!timeout_id) {
        scroll_y = this.get_scroll_y(scroll_listener);
        set_scroll_classes(scroll_y);
        last_known_scroll_position = scroll_y;
      }
      timeout_id = window.setTimeout(() => { timeout_id = null; }, this.timeout);
    });

    // Set initial state
    $().ready(() => set_scroll_classes(this.get_scroll_y(scroll_listener)));
  },

  get_scroll_y: (el) => {
    if (el === window) {
      // scrolling the window
      return window.scrollY !== undefined ? window.scrollY : window.pageYOffset; // pageYOffset for IE
    }
    // scrolling a DOM element
    return el.scrollTop;
  },
});
