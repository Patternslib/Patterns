define([
    'require',
    '../lib/jquery'
], function(require) {

    var init = function($el, opts) {
        // find all folders that contain a ul
        var $folders = $el.find('li.folder:contains(ul)');

        // inject span.toggle as first child of each folder
        $folders.prepend('<span class="toggle"></span>');

        // all folders are implicitly closed
        $folders.filter(':not(.open,.closed)').addClass('closed');

        // wire spans as control elements
        var $ctrls = $el.find('span.toggle');
        $ctrls.each(function() {
            var $ctrl = $(this),
                $folder = $ctrl.parent();
            $ctrl.on('click', function(ev) {
                $folder.toggleClass('open closed');
            });
        });
    };

    var pattern = {
        markup_trigger: "ul.expandable",
        initialised_class: "expandable",
        init: init
    };

    return pattern;
});
