/**
 * Patterns Push Kit - client to support websocket connection push
 *
 * Copyright 2018-2020 Johannes Raggam, Alexander Pilz, Syslab.com GmbH
 *
 * Basic push support connects to a push server and an exchange prefix.
 * it reads the name of the server and the exchange prefix from entries 
 * in the meta header of the page
 * Then it sets up two bindings to two different exchanges, one to receive 
 * push markers and one to receive desktop notifications. 
 * It assumes that the exchanges are named [prefix]_event and [prefix]_notification
 * 
 * If a message comes in on the [prefix]_event exchange, a javascript push event is triggered
 * which is listened to by all dom elements with class .pat-push on them. 
 * pat-push will then compare the sent message with its own push_marker value and execute on match.
 *
 * If a message comes in on the [prefix]_notification exchange, a desktop notification is triggered
 * which will show a desktop marker.
 *  
 * User filtering
 * all subscriptions are topic subscriptions and will only bind to topics that start with the userid
 * that way, users will only receive updates explicitly directed to them.
 *
 * This pattern expects the following meta tags to be available in the page to get the necessary configuration
 * - patterns-push-server-url containing a url pointing to a message queue server. Eg. ws://127.0.0.1:15674/ws
 * - patterns-push-exchange-base-name containing a text prefix. It will append _event and _notification to that prefix and attempt to contact these two message exchanges.
 * - patterns-push-user-id containing the user id of the currently logged in user. This is necessary to subscribe to updates only for this specific user.
 * - patterns-push-login containing the name of a read only user on the message queue server used to connect.
 * - patterns-push-password containing the password of a read only user on the message queue server used to connect.
 */

define([
    "jquery",
    "stompjs",
], function($, stompjs) {

const push_kit = {

    init() {
        const push_url = $("meta[name=patterns-push-server-url]").attr("content");
        const push_exchange = $("meta[name=patterns-push-exchange-base-name]").attr("content");
        const push_user_id = $("meta[name=patterns-push-user-id]").attr("content");
        const push_login = $("meta[name=patterns-push-login]").attr("content");
        const push_pass = $("meta[name=patterns-push-password]").attr("content");
        if (!push_url || !push_exchange) {
            return;
        }

        const client = new stompjs.Client({
            brokerURL: push_url,
            connectHeaders: {
                login: push_login,
                passcode: push_pass,
            },
            debug: function (str) {
                console.log(str);
            },
            // reconnectDelay: 5000,
            heartbeatIncoming: 0,
            heartbeatOutgoing: 20000,
        });

        let subscription_push_marker;
        let subscription_desktop_notification;

        client.onConnect = (frame) => {
            subscription_push_marker = client.subscribe(
                "/exchange/" + push_exchange + "_event/" + push_user_id + ".#",
                this.on_push_marker.bind(this)
            );
            // Only one subscription per connection is allowed. Otherwise the connection will terminate right away again.
            // subscription_desktop_notification = client.subscribe(
            //     "/exchange/" + push_exchange + "_notification/" + push_user_id + ".#",
            //     this.on_desktop_notification.bind(this)
            // );
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
    return push_kit;
});

