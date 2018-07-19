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
		      });
			const desktop_notifications = horizon("desktop_notification");
		    desktop_notifications.order("datetime", "descending").watch().subscribe(
		      (items) => {
		          item = items[0];
		          console.log(item);
		          if (!item) return;
		          // only show if the notification is max 1 sec old
		          if (item['datetime'].getTime() > new Date().getTime()-1000)
					push_kit.createNotification(item['title']);
		      },
		      // If an error occurs, this function
		      //  will execute with the `err` message
		      (err) => {
		        console.log(err);
		      });
    	},


	    createNotification: function(text) {
    		var img = $('meta[name=desktop-notification-image]').attr("content");

	        // Let's check if the browser supports notifications
	        if (!"Notification" in window) {
	          console.log("This browser does not support notifications.");
	        }

	        // Let's check if the user is okay to get some notification
	        else if (Notification.permission === "granted") {
	          // If it's okay let's create a notification

	          var notification = new Notification('Update', { body: text, icon: img });

	        }

	        // Otherwise, we need to ask the user for permission
	        // Note, Chrome does not implement the permission static property
	        // So we have to check for NOT 'denied' instead of 'default'
	        else if (Notification.permission !== 'denied') {
	          Notification.requestPermission(function (permission) {

	            // Whatever the user answers, we make sure Chrome stores the information
	            if(!('permission' in Notification)) {
	              Notification.permission = permission;
	            }

	            // If the user is okay, let's create a notification
	            if (permission === "granted") {
	              var notification = new Notification('Update', { body: text, icon: img });

	            }
	          });
	        }
	    }     


    };
    push_kit.init();
    return push_kit;
});

