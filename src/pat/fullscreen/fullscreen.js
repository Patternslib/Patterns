define([
    "pat-base",
    "pat-logger"
], function(Base, logging) {
    var log = logging.getLogger("fullscreen");

    return Base.extend({
        name: "fullscreen",
        trigger: ".pat-fullscreen",

        init: function() {
            var el = this.$el[0];
            el.addEventListener('click', function (e) {
                e.preventDefault();
                // querying the fullscreen element fs_el and inside the event
                // handler instead of outside allows for dynamic injecting
                // fullscreen elements even after pattern initialization.
                var fs_el = document.querySelector(el.getAttribute('href'));
                if (fs_el) {
                    // setting up the exit button
                    var exit_el = document.createElement('a');
                    exit_el.className = 'fullscreen-exit';
                    exit_el.appendChild(document.createTextNode('Exit fullscreen'));
                    exit_el.addEventListener('click', function (e) {
                        e.preventDefault();
                        document.exitFullscreen();
                        exit_el.remove();
                    });
                    // setting page to fullscreen
                    fs_el.requestFullscreen();
                    fs_el.appendChild(exit_el);

                } else {
                    log.error('No fullscreen element found.');
                }
            });
        }
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
