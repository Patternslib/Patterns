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
 * - patterns-push-filter containing a topic filter including dot-seperated namespaces and wildcards. A commonly used filter value would be the currently logged in user. This will subscribe only to updates for this specific user.
 * - patterns-push-login containing the name of a read only user on the message queue server used to connect.
 * - patterns-push-password containing the password of a read only user on the message queue server used to connect.
 */
import "regenerator-runtime/runtime"; // needed for ``await`` support
import logging from "./logging";

const logger = logging.getLogger("core push kit");

const push_kit = {
    async init() {
        const url = document.querySelector("meta[name=patterns-push-server]")?.content;
        const exchange = document.querySelector("meta[name=patterns-push-exchange]")?.content; // prettier-ignore

        if (!url || !exchange) {
            return;
        }

        const topicfilter = document.querySelector("meta[name=patterns-push-filter]")?.content; // prettier-ignore
        const user_login = document.querySelector("meta[name=patterns-push-login]")?.content; // prettier-ignore
        const user_pass = document.querySelector("meta[name=patterns-push-password]")?.content; // prettier-ignore

        const StompJS = await import("@stomp/stompjs");
        const client = new StompJS.Client({
            brokerURL: url,
            connectHeaders: {
                login: user_login,
                passcode: user_pass,
            },
            debug: function (str) {
                logger.debug(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 0,
            heartbeatOutgoing: 20000,
        });

        client.onConnect = () => {
            client.subscribe(
                `/exchange/${exchange}/${topicfilter}.#`,
                this.on_push_marker.bind(this)
            );
            // TODO: we probably want to distinguish for desktop notifications with routing_key.
            // Only one subscription per connection is allowed. Otherwise the connection will terminate right away again.
            // client.subscribe(
            //     `/exchange/${exchange}_notification/${topicfilter}.#`,
            //     this.on_desktop_notification.bind(this)
            // );
        };

        client.onStompError = (frame) => {
            logger.error("Broker reported error: " + frame.headers["message"]);
            logger.debug("Additional details: " + frame.body);
        };

        client.activate();
        logger.debug("StompJS push support initialised on " + url);
    },

    on_push_marker(message) {
        logger.debug("Received push marker: ", message);
        if (!message || !message.body) {
            return;
        }
        document.body.dispatchEvent(
            new CustomEvent("push", { detail: { body: message.body } })
        );
    },

    on_desktop_notification(message) {
        logger.debug("Received desktop notification: ", message);
        if (!message || !message.body) {
            return;
        }
        this.create_notification(message.body);
    },

    create_notification(text) {
        const img = document.querySelector("meta[name=desktop-notification-image]")?.content; // prettier-ignore

        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            logger.error("This browser does not support notifications.");
            return;
        }

        // If not yet permitted, we need to ask the user for permission.
        // Note, Chrome does not implement the permission static property
        // So we have to check for NOT 'denied' instead of 'default'
        if (!(Notification.permission in ["denied", "granted"])) {
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
                body: text,
            };
            if (img) {
                message.icon = img;
            }
            new Notification("Update", message);
        }
    },
};

push_kit.init();

export default push_kit;
