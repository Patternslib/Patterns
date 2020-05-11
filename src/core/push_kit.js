/**
 * Patterns Push Kit - client to support websocket connection push
 *
 * Copyright 2018-2019 Alexander Pilz, Syslab.com GmbH
 */

import $ from "jquery";
import { Client } from "@stomp/stompjs";

const push_kit = {

    init() {
        const push_url = $("meta[name=patterns-push-server]").attr("content");
        const push_path = $("meta[name=patterns-push-path]").attr("content");
        const push_user = $("meta[name=patterns-push-user-TODO]").attr("content");
        const push_pass = $("meta[name=patterns-push-pass-TODO]").attr("content");
        if (!push_url || !push_path) {
            return;
        }

        const client = new Client({
            brokerURL: push_url,
            connectHeaders: {
                login: push_user,
                passcode: push_pass,
            },
            debug: function (str) {
                console.log(str);
            },
            //reconnectDelay: 5000,
            //heartbeatIncoming: 4000,
            //heartbeatOutgoing: 4000,
        });

        let subscription_push_marker;
        let subscription_desktop_notification;

        client.onConnect = (frame) => {
            subscription_push_marker = client.subscribe(
                push_path + "/push_marker",
                this.on_push_marker.bind(this)
            );
            subscription_desktop_notification = client.subscribe(
                push_path + "/desktop_notification",
                this.on_desktop_notification.bind(this)
            );
        };

        client.onStompError = (frame) => {
            console.log("Broker reported error: " + frame.headers["message"]);
            console.log("Additional details: " + frame.body);
        };

        client.activate();
        console.log("StompJS push support initialised on " + push_url);
    },

    on_push_marker(message) {
        console.log("Received push marker: ", message);
        if (!message || !message.body) {
            return;
        }
        $("body").trigger("push", [message.body]);
    },

    on_desktop_notification(message) {
        console.log("Received desktop notification: ", message);
        if (!message || !message.body) {
            return;
        }
        this.create_notification(message.body);
    },

    create_notification(text) {
        const img = $("meta[name=desktop-notification-image]").attr("content");

        // Let's check if the browser supports notifications
        if (!"Notification" in window) {
            console.log("This browser does not support notifications.");
            return;
        }

        // If not yet permitted, we need to ask the user for permission.
        // Note, Chrome does not implement the permission static property
        // So we have to check for NOT 'denied' instead of 'default'
        if (! Notification.permission in ["denied", "granted"]) {
            Notification.requestPermission((permission) => {
                // Whatever the user answers, we make sure Chrome stores the information
                if (!("permission" in Notification)) {
                    Notification.permission = permission;
                }
            });
        }

        // Let's check if the user is okay to get some notification
        if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            const message = {
                body: text
            }
            if (img) {
                message.icon = img;
            }
            new Notification("Update", message);
        }
    }

};

push_kit.init();

export default push_kit;
