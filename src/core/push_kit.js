/**
 * Patterns Push Kit - client to support websocket connection push
 *
 * Copyright 2018-2019 Alexander Pilz, Syslab.com GmbH
 */

define([
    "jquery",
    "@horizon/client",
    "pat-utils"
], function($, Horizon, utils) {
    var push_kit = {

    	init: function () {
    		var pps = $('meta[name=patterns-push-server]').attr("content");
    		if (!pps) return;
		    const horizon = Horizon({host: pps});
		    horizon.onReady(function() {
		        console.log("Horizon push support initialised on " + pps)
		    });
		    horizon.connect();
		    const push_markers = horizon("push_marker");
		    push_markers.order("datetime", "descending").watch().subscribe(
		      (items) => {
		          item = items[0];
		          console.log(item);
		          if (!item) return;
		          // only show if the notification is max 1 sec old
		          if (item['datetime'].getTime() > new Date().getTime()-1000)
					$('body').trigger('push', [ item['title'] ]);
		      },
		      // If an error occurs, this function
		      //  will execute with the `err` message
		      (err) => {
		        console.log(err);
		      })
    	}

    };
    push_kit.init();
    return push_kit;
});

