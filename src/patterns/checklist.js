define([
    'require',
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
            if (($el.find('input[type=checkbox]:visible:checked').length === 0) &&
                (!deselectallctrl.prop('disabled'))) {
                deselectallctrl.attr({disabled: 'disabled'});
            } else if (deselectallctrl.prop('disabled')) {
                deselectallctrl.prop('disabled', false);
            }

            if (($el.find('input[type=checkbox]:visible:not(:checked)').length === 0) &&
                (!selectallctrl.prop('disabled'))) {
                selectallctrl.attr({disabled: 'disabled'});
            } else if (selectallctrl.prop('disabled')) {
                selectallctrl.prop('disabled', false);
            }
        });
    };

    var selectall = function($el) {
        var $unchecked = $el.find('input[type=checkbox]:not(:checked)'),
            deselectallctrl = $el.find('.functions .deselect-all'),
            selectallctrl = $el.find('.functions .select-all');
        $unchecked.prop("checked", true);
        deselectallctrl.prop('disabled', false);
        selectallctrl.attr({disabled: 'disabled'});
        $el.change();
    };

    var deselectall = function($el) {
        var $checked = $el.find('input[type=checkbox]:checked'),
            deselectallctrl = $el.find('.functions .deselect-all'),
            selectallctrl = $el.find('.functions .select-all');
        $checked.prop("checked", false);
        deselectallctrl.attr({disabled: 'disabled'});
        selectallctrl.prop('disabled', false);
        $el.change();
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
