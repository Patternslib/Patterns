import pattern, {
    TIMEOUT_CALLBACK,
    TIMEOUT_FIRST_CALLBACK,
    TIMEOUT_PAUSE,
} from "./scroll-box";
import utils from "../../core/utils";

describe("pat-scroll-box", function () {
    afterEach(function () {
        jest.restoreAllMocks();
        document.body.innerHTML = "";
    });

    it("1 - First callback invoked early", async function () {
        document.body.innerHTML = `
          <div id="el1" style="overflow: scroll"></div>
        `;
        const el = document.querySelector("#el1");

        const instance = new pattern(el);
        await utils.timeout(1);

        const spy_set_scroll_classes = jest.spyOn(instance, "set_scroll_classes");

        // First invocation is after TIMEOUT_FIRST_CALLBACK
        el.dispatchEvent(new Event("scroll"));
        await utils.timeout(1);
        expect(spy_set_scroll_classes).toHaveBeenCalledTimes(0);
        await utils.timeout(TIMEOUT_FIRST_CALLBACK - 1);
        expect(spy_set_scroll_classes).toHaveBeenCalledTimes(1);
        // No other callback invocations with just one scroll event.
        await utils.timeout(TIMEOUT_CALLBACK - TIMEOUT_FIRST_CALLBACK - 1);
        expect(spy_set_scroll_classes).toHaveBeenCalledTimes(1);

        // Now, subsequent scroll events invoke the callback after TIMEOUT_CALLBACK
        // But multiple scroll events don't lead to multiple callback invocations.
        el.dispatchEvent(new Event("scroll"));
        await utils.timeout(1);
        el.dispatchEvent(new Event("scroll"));
        await utils.timeout(1);
        el.dispatchEvent(new Event("scroll"));
        // After TIMEOUT_FIRST_CALLBACK no NEW cb invocation
        await utils.timeout(TIMEOUT_FIRST_CALLBACK);
        expect(spy_set_scroll_classes).toHaveBeenCalledTimes(1);
        // After TIMEOUT_CALLBACK there should be another cb invocation
        await utils.timeout(TIMEOUT_CALLBACK - TIMEOUT_FIRST_CALLBACK);
        expect(spy_set_scroll_classes).toHaveBeenCalledTimes(2);
        // But without a new scroll event no more callback invocations.
        await utils.timeout(TIMEOUT_CALLBACK);
        expect(spy_set_scroll_classes).toHaveBeenCalledTimes(2);

        // Another scroll event, another callback invocation after 200ms
        // We have to dispatch again
        el.dispatchEvent(new Event("scroll"));
        // After TIMEOUT_FIRST_CALLBACK no NEW cb invocation
        await utils.timeout(TIMEOUT_FIRST_CALLBACK);
        expect(spy_set_scroll_classes).toHaveBeenCalledTimes(2);
        // After TIMEOUT_CALLBACK there should be another cb invocation
        await utils.timeout(TIMEOUT_CALLBACK - TIMEOUT_FIRST_CALLBACK);
        expect(spy_set_scroll_classes).toHaveBeenCalledTimes(3);

        // Let's wait for TIMEOUT_PAUSE to reset and start again with the
        // first call after TIMEOUT_FIRST_CALLBACK.
        // The user probably stopped scrolling and starts over again
        await utils.timeout(TIMEOUT_PAUSE);
        el.dispatchEvent(new Event("scroll"));
        await utils.timeout(TIMEOUT_FIRST_CALLBACK);
        expect(spy_set_scroll_classes).toHaveBeenCalledTimes(4);
        el.dispatchEvent(new Event("scroll"));
        await utils.timeout(TIMEOUT_CALLBACK);
        expect(spy_set_scroll_classes).toHaveBeenCalledTimes(5);
    });
});
