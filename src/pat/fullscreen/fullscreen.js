define([
    "pat-base",
    "pat-parser",
    "pat-logger",
    "screenful"
], (Base, Parser, logging, screenful) => {
    const log = logging.getLogger("fullscreen");
    const parser = new Parser('fullscreen');

    parser.addArgument('selector', null); // Selector for the fullscreen element.
    parser.addArgument('close-button', 'none', ['none', 'show']); // Inject a fullscreen button.

    return Base.extend({
        name: "fullscreen",
        trigger: ".pat-fullscreen",

        init($el, opts) {
            this.options = parser.parse(this.$el, opts);

            // setting up the exit button
            let exit_el = null;
            if (this.options.closeButton === 'show') {
                exit_el = document.createElement('button');
                exit_el.className = 'pat-fullscreen-close-fullscreen';
                exit_el.title = 'Exit fullscreen';
                exit_el.appendChild(document.createTextNode('Exit fullscreen'));
                exit_el.addEventListener('click', e => {
                    e.preventDefault();
                    screenful.exit();
                });
            }

            const el = this.$el[0];
            this.$el.on('click', e => {
            //el.addEventListener('click', function (e) {  // TODO: doesn't work in karma for href links
                e.preventDefault();
                // querying the fullscreen element fs_el and inside the event
                // handler instead of outside allows for dynamic injecting
                // fullscreen elements even after pattern initialization.
                let fs_el_sel = this.options.selector ? this.options.selector : el.getAttribute('href');
                fs_el_sel = fs_el_sel ? fs_el_sel : 'body';
                const fs_el = document.querySelector(fs_el_sel);
                if (fs_el) {
                    // setting page to fullscreen
                    screenful.request(fs_el);
                    if (this.options.closeButton === 'show') {
                        fs_el.appendChild(exit_el);
                        screenful.on('change', () => {
                            // Removing exit button.
                            // The button is also removed when pressing the <ESC> button.
                            if (!screenful.isFullscreen) {
                                fs_el.removeChild(exit_el);
                            }
                        });
                    }
                } else {
                    log.error('No fullscreen element found.');
                }
            });
        }
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
