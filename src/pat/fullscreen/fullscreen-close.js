import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "../../core/base";

export default Base.extend({
    name: "fullscreen-close",
    trigger: ".close-fullscreen",
    async init() {
        const Screenfull = (await import("screenfull")).default;

        this.$el[0].addEventListener("click", function () {
            // no prevent-default nor stop propagation to let
            // the button also do other stuff.
            Screenfull.exit();
        });
    },
});
