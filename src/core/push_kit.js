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
 * - patterns-push-url containing a url pointing to a message queue server. Eg. ws://127.0.0.1:15674/ws
 * - patterns-push-exchange containing the exchange nanem to subscribe to.
 * - patterns-push-filter containing a topic filter including dot-seperated namespaces and wildcards. A commonly used filter value would be the currently logged in user. This will subscribe only to updates for this specific user.
 * - patterns-push-login containing the name of a read only user on the message queue server used to connect.
 * - patterns-push-password containing the password of a read only user on the message queue server used to connect.
 */
import logging from "./logging";
import utils from "./utils";

const logger = logging.getLogger("core push kit");

const push_kit = {
    async init() {
        const url = document.querySelector("meta[name=patterns-push-url]")?.content;
        const exchange = document.querySelector("meta[name=patterns-push-exchange]")?.content; // prettier-ignore

        if (!url || !exchange) {
            return;
        }

        const topicfilter = document.querySelector("meta[name=patterns-push-filter]")?.content; // prettier-ignore
        const user_login = document.querySelector("meta[name=patterns-push-login]")?.content; // prettier-ignore
        const user_pass = document.querySelector("meta[name=patterns-push-password]")?.content; // prettier-ignore

        debugger;

        const service_worker = await navigator.serviceWorker.register(
            utils.base_url() + "../push_worker.js"
        );

        //service_worker.postMessage({
        //    type: "initialize",
        //    url: url,
        //    exchange: exchange,
        //    user_login: user_login,
        //    user_pass: user_pass,
        //});

        // const StompJS = await import("@stomp/stompjs");
        // const client = new StompJS.Client({
        //     brokerURL: url,
        //     connectHeaders: {
        //         login: user_login,
        //         passcode: user_pass,
        //     },
        //     debug: function (str) {
        //         logger.debug(str);
        //     },
        //     reconnectDelay: 5000,
        //     heartbeatIncoming: 0,
        //     heartbeatOutgoing: 20000,
        // });

        // client.onConnect = () => {
        //     if (exchange) {
        //         client.subscribe(
        //             `/exchange/${exchange}/${topicfilter}.#`,
        //             this.on_push_marker.bind(this)
        //         );
        //     }
        // };

        // client.onStompError = (frame) => {
        //     logger.error("Broker reported error: " + frame.headers["message"]);
        //     logger.debug("Additional details: " + frame.body);
        // };

        // client.activate();
        // logger.debug("StompJS push support initialised on " + url);
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
};

push_kit.init();

export default push_kit;
