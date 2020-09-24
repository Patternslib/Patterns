import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "../../core/base";

// Lazy loading modules.
let Screenfull;

export default Base.extend({
    name: "fullscreen-close",
    trigger: ".close-fullscreen",
    async init() {
        Screenfull = await import("screenfull");
        Screenfull = Screenfull.default;

        this.$el[0].addEventListener("click", function () {
            // no prevent-default nor stop propagation to let
            // the button also do other stuff.
            Screenfull.exit();
        });
    },
});
