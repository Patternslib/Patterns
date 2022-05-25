import "regenerator-runtime/runtime"; // needed for ``await`` support
import Base from "../../core/base";
import logging from "../../core/logging";
import Parser from "../../core/parser";
import registry from "../../core/registry";

const logger = logging.getLogger("push");

export const parser = new Parser("push");
parser.addArgument("url", null);
parser.addArgument("push-id", null);
parser.addArgument("mode", "replace", ["replace", "append", "desktop-notification"]);

export default Base.extend({
    name: "push",
    trigger: ".pat-push",

    init() {
        this.options = parser.parse(this.el, this.options);
        document.body.addEventListener("push", (e) => {
            logger.debug("received push marker");
            const data = e?.detail?.body;
            if (data === this.options.pushId) {
                if (this.options.mode === "desktop-notification") {
                    this.desktop_notification();
                } else if (this.el.tagName === "FORM") {
                    this.el.submit();
                } else {
                    this.perform_inject();
                }
            }
        });
    },

    async perform_inject() {
        try {
            const response = await fetch(this.options.url);
            const data = await response.text();
            if (this.options.mode === "append") {
                this.el.insertAdjacentHTML("beforeend", data);
            } else {
                this.el.innerHTML = data;
            }
            registry.scan(this.el);
        } catch (e) {
            logger.error(
                `Could not fetch from ${this.options.url} on push-id ${this.options.pushId}.`
            );
        }
    },

    async desktop_notification() {
        try {
            // Let's check if the browser supports notifications
            if (!("Notification" in window)) {
                logger.error("This browser does not support notifications.");
                return;
            }

            // Notifications need to be granted.
            // Note: Current browsers don't allow an automatic request for
            //       permission but need an interaction to allow it.
            //       The following code won't work out of the box in such cases.
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
                const response = await fetch(this.options.url);
                const data = await response.json();

                if (data.length === 0) {
                    return;
                }

                for (const message of data) {
                    const notification = new Notification(message.title, message);
                    if (message.data?.url) {
                        // If ``message.data`` contains an URL, open it.
                        // If not, the browser will simply get the focus when
                        // clicking on the desktop notification.
                        notification.addEventListener("click", () => {
                            window.open(message.data.url, "_self");

                            // Opening a URL in a new tab from JavaScript is
                            // equivalent to opening a popup window which is
                            // blocked by default.
                            // Therefore, we open the URL in the same tab and
                            // rely on other mechanisms that the user's work
                            // isn't lost (auto-save, form unlod protection.)

                            // Don't focus the originating tab.
                            //e.preventDefault();
                            // Open in new window.
                            //const new_window = window.open(message.data.url, "_blank");
                            //try {
                            //    new_window.focus();
                            //} catch (e) {
                            //    // Opening of new window (aka "popup") might
                            //    // have been blocked.
                            //    window.focus();
                            //}
                        });
                    }
                }
            }
        } catch (e) {
            logger.error(
                `Could not fetch from ${this.options.url} on push-id ${this.options.pushId}.`
            );
        }
    },
});
