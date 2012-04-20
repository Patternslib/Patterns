define([
    'require',
    '../lib/jquery',
    '../logging'
], function(require) {
    var log = require('../logging').getLogger('checklist');

    // a check-list made of checkboxes with optional
    // select-all/deselect-all functionality
    var init = function($el, opts) {
        var selectallctrl = $el.find('.functions .select-all'),
            deselectallctrl = $el.find('.functions .deselect-all');

        selectallctrl.click(function(ev) {
            ev.preventDefault();
            selectall($el);
        });
        deselectallctrl.click(function(ev) {
            ev.preventDefault();
            deselectall($el);
        });

        $el.on('change', 'input[type=checkbox]', function(ev) {
            if ($el.find('input[type=checkbox]:checked').length === 0) {
                log.debug('disabling deselect-all');
                deselectallctrl.attr({disabled: 'disabled'});
            } else {
                log.debug('enabling deselect-all');
                deselectallctrl.prop('disabled', false);
            }

            if ($el.find('input[type=checkbox]:not(:checked)').length === 0) {
                log.debug('disabling select-all');
                selectallctrl.attr({disabled: 'disabled'});
            } else {
                log.debug('enabling select-all');
                selectallctrl.prop('disabled', false);
            }
        });
    };

    var selectall = function($el) {
        var $unchecked = $el.find('input[type=checkbox]:not(:checked)');
        $unchecked.prop("checked", true);
        $unchecked.change();
    };

    var deselectall = function($el) {
        var $checked = $el.find('input[type=checkbox]:checked');
        $checked.prop("checked", false);
        $checked.change();
    };

    var pattern = {
        markup_trigger: ".check-list",
        initialised_class: "check-list",
        init: init,
        selectall: selectall,
        deselectall: deselectall
    };

    return pattern;
});
