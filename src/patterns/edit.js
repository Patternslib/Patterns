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
        buttons.upload_image        = $ctrls.find('.upload_image');
        buttons.link_image          = $ctrls.find('.link_image');

        // ensure form is ajaxified
        var ajaxify = require('../patterns').ajaxify.init;
        ajaxify($form);
        
        // Enables contentEditable
        // FIX $form to whatever it should be 
        $form.attr('contenteditable','true');

        // log editor control clicks
        $ctrls.find('button').on('click', function(ev) {
            log.debug('clicked', $(ev.target), ev);
        });

        // execCommand is invoked upon a document
        // the last selected contenteditable is what
        // recieves the application of execution.
      
        // This would be better implemented as subclass of
        // buttons I haven't researched how to implement singletons
        // in javascript
        buttons.b.on('click', function(ev) {
            document.execCommand('bold');
        });
        
        buttons.i.on('click', function(ev) {
            document.execCommand('italic');
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

        buttons.link_image.on('click', function(ev) {
            var source = prompt('URL of Image');
            if(source) { document.execCommand('insertImage', false, source); }; 
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
