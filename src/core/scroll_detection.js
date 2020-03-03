/**
 * Patterns scroll detection - convenience classes requested in #701
 *
 * Copyright 2020- Alexander Pilz, Syslab.com GmbH
 */

define([
    "jquery"
], function($) {
    var scroll_detection = {

      init: function () {
        $(window).on('scroll touchmove', function(event) {
          if (window.scrollY == 0) {
            $("body").addClass("scroll-position-top");
          } else {
            $("body").removeClass("scroll-position-top");    
          }
          // at the bottom of the page
          if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            $("body").addClass("scroll-position-bottom");
          } else {
            $("body").removeClass("scroll-position-bottom");    
          }

        });
        $(window).on('wheel', function(event) {
          // at the top of the page
          // Are we scrolling?
          if (event.originalEvent.deltaY < 0) {
            // up
            $("body").addClass("scroll-up").removeClass("scroll-down");
          } else {
            // down
            $("body").addClass("scroll-down").removeClass("scroll-up");
          }

        });
      }     

    };
    scroll_detection.init();
    return scroll_detection;
});