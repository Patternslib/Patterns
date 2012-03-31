define([
    'require',
    '../logging',
    '../patterns'
], function(require) {
    var log = require('../logging').getLogger('edit');

    // create a div after the textarea
    // copy the textarea's content unquoted to the div
    // hide the textarea
    // copy content back before form is serialized
    var text2div = function($el) {
        // hide textarea
        $el.hide();

        // make sure textarea has an id
        // XXX: generate something proper
        var id = $el.attr('id');
        if (!id) {
            id = "my-id-that-should-be-replaced-by-something-unique";
            $el.attr({id: id});
        }

        // create contenteditable div
        var editid = 'edit-' + id,
            $edit = $('<div id="' + editid + '" contenteditable="true"/>').insertAfter($el);
        $edit.html($el.val());
        $edit.attr({style: 'min-height: 50px'});

        // ensure form is ajaxified and copy content back before serialize
        var ajaxify = require('../patterns').ajaxify.init,
            $form    = $el.parents('form');
        ajaxify($form);
        $form.on('form-pre-serialize', function() {
            $el.html($edit.html());
        });

        return $edit;
    };

    var init = function($el, opts) {
        var $edit = text2div($el);

        var $ctrls   = $('.editor-controls'),
            buttons  = {};

        buttons.bold                = $ctrls.find('.strong');
        buttons.italic              = $ctrls.find('.emphasised');
        buttons.insertorderedlist   = $ctrls.find('.list-ordered');
        buttons.insertunorderedlist = $ctrls.find('.list-unordered');
        //buttons.insertparagraph     = $ctrls.find('.paragraph');
        buttons.clear               = $ctrls.find('.clear');
        buttons.inserth1            = $ctrls.find('.header_1');
        buttons.inserth2            = $ctrls.find('.header_2');
        buttons.inserth3            = $ctrls.find('.header_3');
        buttons.upload_image        = $ctrls.find('.upload_image');
        buttons.link_image          = $ctrls.find('.link_image');

        var button_handler = {
            'bold'                  : function(){ document.execCommand('bold'); },
            'italic'                : function(){ document.execCommand('italic'); },
            'insertparagraph'       : function(){ return 0; },
            'insertorderedlist'     : function(){ document.execCommand('insertorderedlist'); },
            'insertunorderedlist'   : function(){ document.execCommand('insertunorderedlist'); },
            'inserth1'              : function(){ wrap_selection('h1') },
            'inserth2'              : function(){ wrap_selection('h2') },
            'inserth3'              : function(){ wrap_selection('h3') },
            'clear'                 : function(){
                var selection_node = $(window.getSelection().anchorNode);
                document.execCommand('removeformat');
                if (is_contenteditable(selection_node)) {
                    selection_node.unwrap();
                    if (!$(selection_node).parent().is("p")) {
                        $(selection_node).wrap('<p>');
                    }
                }
            },
            'upload_image'          : function(){ document.execCommand(); },
            'link_image'            : function(){
                var source = prompt('URL of Image');
                if(source) {
                    document.execCommand('insertImage', false, source);
                }
            }
        };

        // utility method for determining if something is contenteditable
        var is_contenteditable = function(element) {
            mapped_elements = $(element).parents().map(function() {
                if ($(this).is("[contenteditable='true']")) {
                    return true;
                }
            }).get();

            // mapped_element[0] is the closest parent
            // in the document tree -- If it's true
            // the element will inherit contentEditable
            if (mapped_elements[0]) { return true; }
            return false;
        };

        // simply replaces
        // rather than toggles, but
        // theres no reason you couldn't have
        // it do both!
        var wrap_selection = function(wrap_html){
            var selection_node = $(window.getSelection().anchorNode);
            if(is_contenteditable(selection_node)) {
                // You just want to unwrap if your
                // parent is already selected
                if(selection_node.parent().is(wrap_html)) {
                    selection_node.unwrap();
                }
                else {
                    selection_node.wrap("<" + wrap_html + ">");
                }
            }
            // wrap() normally breaks contentEditable
            // this is a hacky replacement
            selection_node.attr('contenteditable', true);
        };

        // lame helper that
        // toggles the class,
        // triggers the handler
        var button_click = function(element) {
            buttons[element].toggleClass('selected');
            button_handler[element]();
        };

        // bind click to button_click()/1
        for (var key in buttons) {
            buttons[key].click(function(element){
                return function() {
                    log.debug('clicked', element);
                    button_click(element);
                };
            }(key));
        }

        // Enables contentEditable
        $('form').attr('contenteditable','true');

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
