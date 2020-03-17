define([
    "pat-base",
    "pat-parser",
    "pat-logger"
], function(Base, Parser, logging) {
    var log = logging.getLogger("videochat");
    var parser = new Parser('videochat');

    parser.addArgument('domain', 'meet.jit.si');
    parser.addArgument('room', null);
    parser.addArgument('displayname', null);
    parser.addArgument('email', null);

    return Base.extend({
        name: "videochat",
        trigger: ".pat-videochat",

        init: function($el, opts) {
            this.options = parser.parse(this.$el, opts);

            var el = this.$el[0];
            this.$el.on('click', function (e) {
                e.preventDefault();
                this.initializeJitsi();
            }.bind(this));
        },

        initializeJitsi: function() {
            var userinfo = {};
            if (this.options.email) {
                userinfo.email = this.options.email;
            }
            if (this.options.displayname) {
                userinfo.displayName = this.options.displayname;
            }

            var options = {};
            if (this.options.room) {
                options.roomName = this.options.room;
            }
            options.userInfo = userinfo;

            var api = new JitsiMeetExternalAPI(this.options.domain, options);
            return api;
        }

    });
});
