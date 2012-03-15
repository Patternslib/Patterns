define([
    'require',
    '../lib/aloha/src/lib/aloha'
], function(require) {
    var init = function($el, opts) {
        // find editor controls
        var $ctrls = $('.editor-ctrls'),
            $strong = $ctrls.find('.strong');

        // activate aloha on element
        Aloha.jQuery($el).aloha();

        // bind editor controls to aloha commands
        $strong.on('click', function(ev) {
            ev.preventDefault();
            Aloha.execCommand('bold', false, '');
        });
    };

    var pattern = {
        markup_trigger: '.edit',
        initialised_class: 'edit',
        init: init
    };
    return pattern;
});
