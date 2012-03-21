define([
    'require',
    '../lib/aloha/src/lib/aloha',
    '../lib/jquery.form/jquery.form'
], function(require) {
    var init = function($el, opts) {
        // find editor controls
        var $form = $el.parents('form'),
            $ctrls = $('.editor-ctrls'),
            $strong = $ctrls.find('.strong');

        // activate aloha on element
        Aloha.jQuery($el).aloha();

        // bind editor controls to aloha commands
        $strong.on('click', function(ev) {
            ev.preventDefault();
            Aloha.execCommand('bold', false, '');
        });

        // ajaxify form
        $form.ajaxForm({
            // in plone we use this to figure out whether a form is
            // requested or submitted
            // XXX: consider setting this via $.ajaxSetup in a
            // specific application
            data: {submit: "submit"}
        });

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


        // XXX: not specific to edit

        $form.ajaxError(function(ev, xhr, opts, error) {
            // ajaxHandlers are global, we are only interested in our form
            if (!(ev.target === $form[0])) return;

            // XXX: this needs to be solved differently
            var msg = [xhr.status, xhr.statusText, error, opts.url].join(' '),
                // XXX: error notification pattern!
                $error = $('<div class="modal">'
                           + '<h3>Error</h3>'
                           + '<div class="error message">'+msg+'</div>'
                           + '</div>');
            inject.append($error, $('body'));
            console.error(msg, xhr, opts);
        });

        $form.ajaxSuccess(function(ev, xhr, opts, data) {
            // ajaxHandlers are global, we are only interested in our form
            if (!(ev.target === $form[0])) return;

            // XXX: this needs to be solved differently
            if (!data) return;
            var $forms = $(data).find('form[id]');
            $forms.each(function() {
                var $form = $(this),
                    id = $(this).attr('id'),
                    $ourform = $('#' + id);
                if ($ourform.length > 0) {
                    $ourform.attr({action: $form.attr('action')});
                } else {
                    console.warn(
                        'Ignored form in respone data: not matching id', $form);
                }
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
