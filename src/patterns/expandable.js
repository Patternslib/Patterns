define([
    'require'
], function(require) {

    var init = function($el, opts) {
        // make sure inject folders have a ul
        $el.find('.folder[data-inject]:not(:has(ul))').append('<ul />');

        // find all folders that contain a ul
        var $folders = $el.find('li.folder:has(ul)');

        // inject span.toggle as first child of each folder
        $folders.prepend('<span class="toggle"></span>');

        // all folders are implicitly closed
        $folders.filter(':not(.open,.closed)').addClass('closed');

        // trigger open event for open folders
        $folders.filter('.open').trigger('patterns-folder-open');

        // wire spans as control elements
        var $ctrls = $el.find('span.toggle');
        $ctrls.each(function() {
            var $ctrl = $(this),
                $folder = $ctrl.parent();
            $ctrl.on('click', function(ev) {
                $folder.toggleClass('open closed');
                $folder.filter('.open').trigger('patterns-folder-open');
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
