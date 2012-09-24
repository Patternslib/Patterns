define([
    'require',
    '../logging',
    '../patterns'

], function(require) {
    var log = require('../logging').getLogger('switch'),
        Parser = require('../core/parser');
        parser = new Parser();

    parser.add_argument("selector");
    parser.add_argument("remove");
    parser.add_argument("add");

    var switcher = {
        initContent: function(root) {
            $("[data-switch]", root).on("click", switcher.onClick);
        },

        onClick: function(e) {
            var $trigger = $(this);
            if ($trigger.hasClass('cant-touch-this'))
                return;

            var options = parser.parse($trigger.data("switch")), i, option;
            if (!Array.isArray(options)) 
                options = [options];
            for (i=0; i<options.length; i++) {
                option=options[i];
                if (option.selector && (option.remove || option.add))
                    switcher._update(option.selector, option.remove, option.add);
                else
                    log.error('Switch pattern requires selector and one of add or remove.');
            }
        },

        _update: function(selector, remove, add) {
            var $targets = $(selector);

            if (!$targets.length)
                return;

            if (remove) {
                if (remove.indexOf('*')===-1) 
                    $targets.removeClass(remove);
                else {
                    remove = remove.replace(/[-[\]{}()+?.,\\^$|#\s]/g, "\\$&");
                    remove = remove.replace(/[*]/g, ".*");
                    $targets.removeClass(function(idx, cls) {
                        return (cls.match(remove) || []).join(' ');
                    });
                }
            }
            if (add)
                $targets.addClass(add);
        }

    };
    return switcher;
});
// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 sts=4 expandtab
