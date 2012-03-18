define([
    'require',
    '../lib/aloha-loader'
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


        // XXX: just copied from autosubmit - we need a generic form handling

        // prepare ajax request and submit function
        var params = {
            data: {submit: "submit"},
            error: function(jqXHR, textStatus, errorThrown) {
                var msg = [jqXHR.status, textStatus,
                           $form.attr('action')].join(' '),
                    // XXX: error notification pattern!
                    $error = $('<div class="modal"><h3>Error</h3><div class="error message">'+msg+'</div></div>');
                inject.append($error, $('body'));
                console.error(url, jqXHR, textStatus, errorThrown);
            },
            success: function(data, textStatus, jqXHR) {
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
            }
        };
        var submit = function(ev) {
            ev.preventDefault();
            // XXX: hackish - supports only one per page
            $el.html($('.aloha-textarea').html());
            $form.ajaxSubmit(params);
        };



        // take over form submit - XXX: should hook into normal submit
        $form.find('button[name=submit]').on('click', submit);
    };

    var pattern = {
        markup_trigger: 'form textarea.edit',
        initialised_class: 'edit',
        init: init
    };
    return pattern;
});
