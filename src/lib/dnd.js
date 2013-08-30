/**
 * Patterns dnd - Drag and drop helpers for patterns.
 *
 * Copyright 2013 Marko Durkovic
 */
define([
    'jquery',
    '../core/logger'
], function($, logger) {
    var namespace = 'dnd',
        log = logger.getLogger(namespace);

    var _ = {
        draggable: function($el) {
            console.log('Initializing dragables');
            log.debug('Initializing dragables');

            if('draggable' in document.createElement('div')) {
                $el.attr('draggable', true);
            } else {
                $el.on('selectstart', function(event) {
                    event.preventDefault();
                });
            }

            $el.on('dragstart', function(event) {
                log.debug('Start drag');
                console.log('Start drag');
                event.originalEvent.dataTransfer.setData('text/plain', 'pat-dragable');
                event.originalEvent.dataTransfer.effectAllowed = ['move'];
                if ('setDragImage' in event.originalEvent.dataTransfer) {
                    event.originalEvent.dataTransfer.setDragImage(this, 0, 0);
                }
                $(this).addClass('pat-dragged');
            });

            $el.on('dragend', function() {
                log.debug('End drag');
                $(this).removeClass('pat-dragged');
            });
        }
    };

    return _;

});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
