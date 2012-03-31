define([
    'require',
    '../lib/aloha-loader',
    '../logging',
    '../patterns'
], function(require) {
    var Aloha = window.Aloha,
        log = require('../logging').getLogger('edit');

    // var buttons = {
    //     emphasise: "i",
    //     strong: "b",
    //     "list-ordered": ["<ol />", "<li />"],
    //     "list-unordered": ["<ul />", "<li />"],
    //     paragraph: "p",
    //     h1: "h1",
    //     h2: "h2",
    //     h3: "h3"
    // };

    var init = function($el, opts) {
        // find editor controls
        var $form = $el.parents('form'),
            $ctrls = $('.editor-controls'),
            buttons = {};

        buttons.b = $ctrls.find('.strong');
        buttons.bold = $ctrls.find('.strong');
        buttons.i = $ctrls.find('.emphasised');
        buttons.italic = $ctrls.find('.emphasised');
        buttons.ol = $ctrls.find('.list-ordered');
        buttons.insertorderedlist = $ctrls.find('.list-ordered');
        buttons.ul = $ctrls.find('.list-unordered');
        buttons.insertunorderedlist = $ctrls.find('.list-unordered');
        buttons.p = $ctrls.find('.paragraph');
        buttons.insertparagraph = $ctrls.find('.paragraph');

        // ensure form is ajaxified
        var ajaxify = require('../patterns').ajaxify.init;
        ajaxify($form);

        // activate aloha on element
        $el.aloha();
        log.debug(Aloha.querySupportedCommands());

        // log editor control clicks
        $ctrls.find('button').on('click', function(ev) {
            log.debug('clicked', $(ev.target), ev);
        });

        // bind editor controls to aloha commands
        buttons.b.on('click', function(ev) {
            Aloha.execCommand('bold', false, '');
        });
        buttons.i.on('click', function(ev) {
            Aloha.execCommand('italic', false, '');
        });
        buttons.ol.on('click', function(ev) {
            Aloha.execCommand('insertorderedlist');
        });
        buttons.ul.on('click', function(ev) {
            Aloha.execCommand('insertunorderedlist');
        });


        var setstate = function(selection) {
            var markup = selection.markupEffectiveAtStart;
            if (!markup) return;
            $ctrls.find('*').removeClass('selected');
            $.each(markup, function(idx, el) {
                var tag = el.nodeName.toLowerCase(),
                    $button = buttons[tag];
                if ($button) $button.addClass('selected');
                log.debug('selected', tag);
            });
        };

        // toggle button according to selection
        // Aloha.bind('aloha-selection-changed', function(ev, selection) {
        //     setstate(selection);
        // });

        // Aloha.bind('aloha-command-executed', function(ev, cmd) {
        //     log.debug('executed', cmd);
        //     var $button = buttons[cmd];
        //     if ($button) $button.toggleClass('selected');
        // });

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
        markup_trigger: 'form textarea.edit-aloha',
        initialised_class: 'edit-aloha',
        init: init
    };
    return pattern;
});

//         Aloha.settings = {
//             locale: 'en',
//             plugins: {
//                 format: {
//                     config: [  'b', 'i', 'p', 'sub', 'sup', 'del', 'title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'removeFormat' ]
//                 }
//             },
//             sidebar: {
//                 disabled: true
//             }
//         };

// Aloha.settings.toolbar = {
//     tabs: {
//         format : {
//             inline: [ 'bold', 'italic', 'striketrough',
//                 'abbreviation', 'spacer', 'metaview' ],
//             paragraph: [ 'formatparagraph' ]
//         },
//         insert: {
//             general: [ 'insertable', 'charakterpicker', 'insertlink' ],
//             media: [ 'image', 'video' ]
//         },
//         link: {
//             link: [ 'editlink' ]
//         }
//     }
// };


