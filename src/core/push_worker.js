console.log("SW 1");

const url = "wss://patternslib/ws";
const exchange = "patternslib";
const user_login = "guest";
const user_pass = "guest";
const topicfilter = "push_marker";

const logger = console;

let client;

self.addEventListener("install", function (event) {
    console.log("SW 2");
    importScripts("stomp.umd.js");
    console.log("SW 5");
});

self.addEventListener("activate", function (event) {
    console.log("SW 3");

    client = new self.StompJs.Client({
        brokerURL: url,
        connectHeaders: {
            login: user_login,
            passcode: user_pass,
        },
        debug: function (str) {
            logger.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 0,
        heartbeatOutgoing: 20000,
    });

    client.onConnect = () => {
        if (exchange) {
            client.subscribe(
                `/exchange/${exchange}/${topicfilter}.#`,

                () => {
                    console.log("ok");
                    self.registration.showNotification("aha", { body: "ok" });
                }
                //this.on_push_marker.bind(this)
            );
        }
    };

    client.onStompError = (frame) => {
        logger.error("Broker reported error: " + frame.headers["message"]);
        logger.debug("Additional details: " + frame.body);
    };

    client.activate();
    logger.debug("StompJs push support initialised on " + url);
});

self.addEventListener("message", function (event) {
    console.log("SW 6");
    console.log(event.data);
});

// Register event listener for the 'push' event.
self.addEventListener("push", function (event) {
    console.log("SW 4");
    // Keep the service worker alive until the notification is created.
    event.waitUntil(
        // Show a notification with title 'ServiceWorker Cookbook' and body 'Alea iacta est'.
        self.registration.showNotification("ServiceWorker Cookbook", {
            body: "Alea iacta est",
        })
    );
});
