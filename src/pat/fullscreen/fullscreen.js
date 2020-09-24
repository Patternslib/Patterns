import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "../../core/base";
import Parser from "../../core/parser";
import logging from "../../core/logging";

// Lazy loading modules.
let Screenfull;

const log = logging.getLogger("fullscreen");
const parser = new Parser("fullscreen");

parser.addArgument("selector", null); // Selector for the fullscreen element.
parser.addArgument("close-button", "none", ["none", "show"]); // Inject a fullscreen button.

/*
class Fullscreen extends Base {
    __constructor__()
}
*/

export default Base.extend({
    name: "fullscreen",
    trigger: ".pat-fullscreen",

    async init($el, opts) {
        Screenfull = await import("screenfull");
        Screenfull = Screenfull.default;

        this.options = parser.parse(this.$el, opts);
        //const el = this.$el[0];
        //el.addEventListener('click', function (e) {  // TODO: doesn't work in karma for href links
        this.$el.on("click", this.fullscreen_handler.bind(this));
    },

    fullscreen_handler(event) {
        event.preventDefault();
        const el = this.$el[0];
        // querying the fullscreen element fs_el and inside the event
        // handler instead of outside allows for dynamic injecting
        // fullscreen elements even after pattern initialization.
        let fs_el_sel = this.options.selector
            ? this.options.selector
            : el.getAttribute("href");
        fs_el_sel = fs_el_sel ? fs_el_sel : "body";
        const fs_el = document.querySelector(fs_el_sel);
        if (fs_el) {
            // setting page to fullscreen
            Screenfull.request(fs_el);
            if (this.options.closeButton === "show") {
                this.setup_exit_button(fs_el);
            }
        } else {
            log.error("No fullscreen element found.");
        }
    },

    setup_exit_button(fs_el) {
        // setting up the exit button
        let exit_el = null;
        if (this.options.closeButton === "show") {
            exit_el = document.createElement("button");
            exit_el.className = "pat-fullscreen-close-fullscreen";
            exit_el.title = "Exit fullscreen";
            exit_el.appendChild(document.createTextNode("Exit fullscreen"));
            exit_el.addEventListener("click", (e) => {
                e.preventDefault();
                Screenfull.exit();
            });
        }
        fs_el.appendChild(exit_el);
        Screenfull.on("change", () => {
            // Removing exit button.
            // The button is also removed when pressing the <ESC> button.
            if (!Screenfull.isFullscreen) {
                fs_el.removeChild(exit_el);
            }
        });
    },
});
