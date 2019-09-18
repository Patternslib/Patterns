define([
    "pat-base",
    "pat-parser",
    "pat-logger",
    "screenful"
], function(Base, Parser, logging, screenful) {
    var log = logging.getLogger("fullscreen");
    var parser = new Parser('fullscreen');
    parser.addArgument('target', null);
    parser.addArgument('exitbutton', true);

    return Base.extend({
        name: "fullscreen",
        trigger: ".pat-fullscreen",


        init: function($el, opts) {
            this.options = parser.parse(this.$el, opts);

            // setting up the exit button
            var exit_el = null;
            if (this.options.exitbutton) {
                var exit_el = document.createElement('a');
                exit_el.className = 'fullscreen-exit';
                exit_el.appendChild(document.createTextNode('Exit fullscreen'));
                exit_el.addEventListener('click', function (e) {
                    e.preventDefault();
                    screenful.exit();
                });
            }

            var el = this.$el[0];
            el.addEventListener('click', async function (e) {
                e.preventDefault();
                // querying the fullscreen element fs_el and inside the event
                // handler instead of outside allows for dynamic injecting
                // fullscreen elements even after pattern initialization.
                var fs_el_sel = this.options.target ? this.options.target : el.getAttribute('href');
                fs_el_sel = fs_el_sel ? fs_el_sel : 'body';
                var fs_el = document.querySelector(fs_el_sel);
                if (fs_el) {
                    // setting page to fullscreen
                    await screenful.request(fs_el);
                    if (this.options.exitbutton) {
                        fs_el.appendChild(exit_el);
                        screenful.on('change', function (event) {
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
            }.bind(this));
        }
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
