define([
    'require',
    '../lib/aloha-loader',
    './ajaxify'
], function(require) {
    var Aloha = window.Aloha,
        ajaxify = require('./ajaxify').init;

    var init = function($el, opts) {
        // find editor controls
        var $form = $el.parents('form'),
            $ctrls = $('.editor-ctrls'),
            $strong = $ctrls.find('.strong');

        // activate aloha on element
        $el.aloha();

        // bind editor controls to aloha commands
        $strong.on('click', function(ev) {
            ev.preventDefault();
            Aloha.execCommand('bold', false, '');
        });

        ajaxify($form);

        // copy aloha textareas to originals before serialization
        // XXX: is there an aloha function for that?
        $form.on('form-pre-serialize', function(ev, $form, opts, veto) {
            $form.find('.aloha-textarea').each(function() {
                var $this = $(this),
                    id = $this.attr('id').slice(0, - '-aloha'.length),
                    $target = $('#' + id);
                $target.html($this.html());
            });
        });
    };

    var pattern = {
        markup_trigger: 'form textarea.edit',
        initialised_class: 'edit',
        init: init
    };
    return pattern;
});
