/**
 * Patterns Push Kit - client to support websocket connection push
 *
 * Copyright 2018-2019 Alexander Pilz, Syslab.com GmbH
 */

define([import $ from "jquery";, "autobahn", import utils from "../../core/utils";], function($, autobahn, utils) {
    var push_kit = {
        init: function() {
            var pps = $("meta[name=patterns-push-server]").attr("content");
            if (!pps) return;

            var connection = new autobahn.Connection({
                url: pps,
                realm: "quaivecloud",
                on_user_error: function(error, customErrorMessage) {
                    // here comes your custom error handling, when a
                    // something went wrong in a user defined callback.
                    console.log("User error: ", error);
                },
                on_internal_error: function(error, customErrorMessage) {
                    // here comes your custom error handling, when a
                    // something went wrong in the autobahn core.
                    console.log("Internal error: ", error);
                }
            });
            connection.onopen = function(session) {
                function oneventPushMarker(args, kwargs, details) {
                    var item = args[0];
                    console.log("Received push event: ", item);
                    if (!item) return;
                    // only show if the notification is max 1 sec old
                    if (item["datetime"] > new Date().getTime() - 1000)
                        $("body").trigger("push", [item["title"]]);
                }

                session.subscribe("push_marker", oneventPushMarker);

                function oneventDesktopNotification(args, kwargs, details) {
                    var item = args[0];
                    console.log("Received push event: ", item);
                    if (!item) return;
                    // only show if the notification is max 1 sec old
                    if (item["datetime"] > new Date().getTime() - 1000)
                        push_kit.createNotification(item["title"]);
                }

                session.subscribe(
                    "desktop_notification",
                    oneventDesktopNotification
                );
            };

            connection.open();
            console.log("Crossbar push support initialised on " + pps);
        },

        createNotification: function(text) {
            var img = $("meta[name=desktop-notification-image]").attr(
                "content"
            );

            // Let's check if the browser supports notifications
            if (!"Notification" in window) {
                console.log("This browser does not support notifications.");
            }

            // Let's check if the user is okay to get some notification
            else if (Notification.permission === "granted") {
                // If it's okay let's create a notification

                var notification = new Notification("Update", {
                    body: text,
                    icon: img
                });
            }

            // Otherwise, we need to ask the user for permission
            // Note, Chrome does not implement the permission static property
            // So we have to check for NOT 'denied' instead of 'default'
            else if (Notification.permission !== "denied") {
                Notification.requestPermission(function(permission) {
                    // Whatever the user answers, we make sure Chrome stores the information
                    if (!("permission" in Notification)) {
                        Notification.permission = permission;
                    }

                    // If the user is okay, let's create a notification
                    if (permission === "granted") {
                        var notification = new Notification("Update", {
                            body: text,
                            icon: img
                        });
                    }
                });
            }
        }
    };
    push_kit.init();
    return push_kit;
});
