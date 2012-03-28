define([
    'require',
    '../lib/aloha-loader',
    '../logging',
    '../patterns'
], function(require) {
    log = require('../logging').getLogger('edit');
    
    // Grab a element of the editor controls
    var init = function($el, opts) {
        
        var $form    = $el.parents('form'),
            $ctrls   = $('.editor-ctrls'),
            buttons  = {};
        
        buttons.b                   = $ctrls.find('.strong');
        buttons.bold                = $ctrls.find('.strong');
        buttons.i                   = $ctrls.find('.emphasised');
        buttons.italic              = $ctrls.find('.emphasised');
        buttons.ol                  = $ctrls.find('.list-ordered');
        buttons.insertorderedlist   = $ctrls.find('.list-ordered');
        buttons.ul                  = $ctrls.find('.list-unordered');
        buttons.insertunorderedlist = $ctrls.find('.list-unordered');
        buttons.p                   = $ctrls.find('.paragraph');
        buttons.insertparagraph     = $ctrls.find('.paragraph');
        buttons.h1                  = $ctrls.find('.header_1');
        buttons.inserth1            = $ctrls.find('.header_1');
        buttons.h2                  = $ctrls.find('.header_2');
        buttons.inserth2            = $ctrls.find('.header_2');
        buttons.h3                  = $ctrls.find('.header_3');
        buttons.inserth3            = $ctrls.find('.header_3');

        // ensure form is ajaxified
        var ajaxify = require('../patterns').ajaxify.init;
        ajaxify($form);
        
        // Enables contentEditable
        $form.attr('contenteditable','true');
        // log editor control clicks
        $ctrls.find('button').on('click', function(ev) {
            log.debug('clicked', $(ev.target), ev);
        });

        // execCommand is invoked upon a document
        // the last selected contenteditable is what
        // recieves the application of execution.
       
        // shit happens
        buttons.b.on('click', function(ev) {
            log.debug('bold', $(ev.target), ev);
            document.execCommand("Bold");
        });
        
        buttons.i.on('click', function(ev) {
            document.execCommand('italic', false, '');
        });
        buttons.ol.on('click', function(ev) {
            document.execCommand('insertorderedlist');
        });
        buttons.ol.on('click', function(ev) {
            document.execCommand('insertorderedlist');
        });
        buttons.ul.on('click', function(ev) {
            document.execCommand('insertunorderedlist');
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
    };
    
    
    var pattern = {
        markup_trigger: 'form textarea.edit',
        initialised_class: 'edit',
        init: init
    };
    return pattern;
});
