import Pattern from "./scroll-marker";
import events from "../../core/events";
import utils from "../../core/utils";

async function create_scroll_marker({
    options = {},
    scroll_container_main = false,
} = {}) {
    document.body.innerHTML = `
          <nav class="pat-scroll-marker">
            <a href="#id1">link 1</a>
            <a href="#id2">link 2</a>
            <a href="#id3">link 3</a>
          </nav>

          <main>
            <section id="id1">
            </section>

            <section id="id2">
            </section>

            <section id="id3">
            </section>
          </main>
        `;
    const el = document.querySelector(".pat-scroll-marker");

    const main = document.querySelector("main");
    if (scroll_container_main) {
        main.style["overflow-y"] = "auto";
    }

    const nav_id1 = document.querySelector("[href='#id1']");
    const nav_id2 = document.querySelector("[href='#id2']");
    const nav_id3 = document.querySelector("[href='#id3']");

    const id1 = document.querySelector("#id1");
    const id2 = document.querySelector("#id2");
    const id3 = document.querySelector("#id3");

    // id1 not, id2 fully, id3 partly visible

    jest.spyOn(main, "clientHeight", "get").mockReturnValue(100);
    jest.spyOn(main, "getBoundingClientRect").mockImplementation(() => {
        return {
            top: 0,
            bottom: 100,
        };
    });

    jest.replaceProperty(window, "innerHeight", 100);
    jest.spyOn(id1, "getBoundingClientRect").mockImplementation(() => {
        return {
            top: -100,
            bottom: -50,
        };
    });
    jest.spyOn(id2, "getBoundingClientRect").mockImplementation(() => {
        return {
            top: 10,
            bottom: 60,
        };
    });
    jest.spyOn(id3, "getBoundingClientRect").mockImplementation(() => {
        return {
            top: 70,
            bottom: 120,
        };
    });

    const instance = new Pattern(el, options);
    jest.spyOn(instance, "scroll_marker_callback");
    jest.spyOn(instance, "scroll_marker_current_callback");

    await events.await_pattern_init(instance);

    instance.scroll_marker_callback([
        { target: id1, isIntersecting: false },
        { target: id2, isIntersecting: true },
        { target: id3, isIntersecting: true },
    ]);

    // wait for the debounced_scroll_marker_current_callback
    await utils.timeout(200);

    return {
        instance: instance,
        el: el,
        nav_id1: nav_id1,
        nav_id2: nav_id2,
        nav_id3: nav_id3,
        id1: id1,
        id2: id2,
        id3: id3,
        main: main,
    };
}

describe("pat-scroll-marker", () => {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("0: Inexistent targets do not break the runtime", async () => {
        document.body.innerHTML = `
          <nav class="pat-scroll-marker">
            <a href="#id1">link 1</a>
            <a href="#id2">link 2</a>
            <a href="#id3">link 3</a>
          </nav>
        `;
        const el = document.querySelector(".pat-scroll-marker");
        const instance = new Pattern(el);
        jest.spyOn(instance, "scroll_marker_callback");
        jest.spyOn(instance, "scroll_marker_current_callback");
        await events.await_pattern_init(instance);

        expect(instance.scroll_marker_callback).not.toHaveBeenCalled();
        expect(instance.scroll_marker_current_callback).not.toHaveBeenCalled();
    });

    describe("1: Test on window as scroll container", () => {
        it("1.1: default values, id3 is current", async () => {
            // With the default values the baseline is in the middle and the
            // content element side's are calculated from the top. id3 is therefore
            // the current one, as it's top is nearer to the middle than the top of
            // id2.

            const { instance, nav_id1, nav_id2, nav_id3, id1, id2, id3 } =
                await create_scroll_marker();

            // Without any overflow settings in other containers, the scroll
            // container is the window object.
            expect(instance.scroll_container).toBe(window);

            // Callbacks have been called.
            expect(instance.scroll_marker_callback).toHaveBeenCalled();
            expect(instance.scroll_marker_current_callback).toHaveBeenCalled();

            expect(nav_id1.classList.contains("in-view")).toBe(false);
            expect(nav_id2.classList.contains("in-view")).toBe(true);
            expect(nav_id3.classList.contains("in-view")).toBe(true);

            expect(nav_id1.classList.contains("current")).toBe(false);
            expect(nav_id2.classList.contains("current")).toBe(false);
            expect(nav_id3.classList.contains("current")).toBe(true);

            expect(id1.classList.contains("scroll-marker-current")).toBe(false);
            expect(id2.classList.contains("scroll-marker-current")).toBe(false);
            expect(id3.classList.contains("scroll-marker-current")).toBe(true);
        });

        it("1.2: distance 0, id2 is current", async () => {
            const { instance, nav_id1, nav_id2, nav_id3, id1, id2, id3 } =
                await create_scroll_marker({
                    options: {
                        distance: 0,
                    },
                });

            // Callbacks have been called.
            expect(instance.scroll_marker_callback).toHaveBeenCalled();
            expect(instance.scroll_marker_current_callback).toHaveBeenCalled();

            expect(nav_id1.classList.contains("in-view")).toBe(false);
            expect(nav_id2.classList.contains("in-view")).toBe(true);
            expect(nav_id3.classList.contains("in-view")).toBe(true);

            expect(nav_id1.classList.contains("current")).toBe(false);
            expect(nav_id2.classList.contains("current")).toBe(true);
            expect(nav_id3.classList.contains("current")).toBe(false);

            expect(id1.classList.contains("scroll-marker-current")).toBe(false);
            expect(id2.classList.contains("scroll-marker-current")).toBe(true);
            expect(id3.classList.contains("scroll-marker-current")).toBe(false);
        });

        it("1.3: distance 50, side bottom, id2 is current", async () => {
            const { instance, nav_id1, nav_id2, nav_id3, id1, id2, id3 } =
                await create_scroll_marker({
                    options: {
                        distance: "50%",
                        side: "bottom",
                    },
                });

            // Callbacks have been called.
            expect(instance.scroll_marker_callback).toHaveBeenCalled();
            expect(instance.scroll_marker_current_callback).toHaveBeenCalled();

            expect(nav_id1.classList.contains("in-view")).toBe(false);
            expect(nav_id2.classList.contains("in-view")).toBe(true);
            expect(nav_id3.classList.contains("in-view")).toBe(true);

            expect(nav_id1.classList.contains("current")).toBe(false);
            expect(nav_id2.classList.contains("current")).toBe(true);
            expect(nav_id3.classList.contains("current")).toBe(false);

            expect(id1.classList.contains("scroll-marker-current")).toBe(false);
            expect(id2.classList.contains("scroll-marker-current")).toBe(true);
            expect(id3.classList.contains("scroll-marker-current")).toBe(false);
        });

        it("1.4: distance 50, side top, visibility: most-visible, id2 is current", async () => {
            // Here we have again the default values, this time explicitly set.
            // Only the visibility is set to most-visible, which means that id2 is
            // the current one,
            //
            const { instance, nav_id1, nav_id2, nav_id3, id1, id2, id3 } =
                await create_scroll_marker({
                    options: {
                        distance: "50%",
                        side: "top",
                        visibility: "most-visible",
                    },
                });

            // Callbacks have been called.
            expect(instance.scroll_marker_callback).toHaveBeenCalled();
            expect(instance.scroll_marker_current_callback).toHaveBeenCalled();

            expect(nav_id1.classList.contains("in-view")).toBe(false);
            expect(nav_id2.classList.contains("in-view")).toBe(true);
            expect(nav_id3.classList.contains("in-view")).toBe(true);

            expect(nav_id1.classList.contains("current")).toBe(false);
            expect(nav_id2.classList.contains("current")).toBe(true);
            expect(nav_id3.classList.contains("current")).toBe(false);

            expect(id1.classList.contains("scroll-marker-current")).toBe(false);
            expect(id2.classList.contains("scroll-marker-current")).toBe(true);
            expect(id3.classList.contains("scroll-marker-current")).toBe(false);
        });
    });

    describe("2: Test on element as scroll container", () => {
        it("2.1: default values, id3 is current", async () => {
            // With the default values the baseline is in the middle and the
            // content element side's are calculated from the top. id3 is therefore
            // the current one, as it's top is nearer to the middle than the top of
            // id2.

            const { instance, nav_id1, nav_id2, nav_id3, id1, id2, id3, main } =
                await create_scroll_marker({ scroll_container_main: true });

            // Without any overflow settings in other containers, the scroll
            // container is the window object.
            expect(instance.scroll_container).toBe(main);

            // Callbacks have been called.
            expect(instance.scroll_marker_callback).toHaveBeenCalled();
            expect(instance.scroll_marker_current_callback).toHaveBeenCalled();

            expect(nav_id1.classList.contains("in-view")).toBe(false);
            expect(nav_id2.classList.contains("in-view")).toBe(true);
            expect(nav_id3.classList.contains("in-view")).toBe(true);

            expect(nav_id1.classList.contains("current")).toBe(false);
            expect(nav_id2.classList.contains("current")).toBe(false);
            expect(nav_id3.classList.contains("current")).toBe(true);

            expect(id1.classList.contains("scroll-marker-current")).toBe(false);
            expect(id2.classList.contains("scroll-marker-current")).toBe(false);
            expect(id3.classList.contains("scroll-marker-current")).toBe(true);
        });

        it("2.2: distance 0, id2 is current", async () => {
            const { instance, nav_id1, nav_id2, nav_id3, id1, id2, id3 } =
                await create_scroll_marker({
                    options: {
                        distance: 0,
                    },
                    scroll_container_main: true,
                });

            // Callbacks have been called.
            expect(instance.scroll_marker_callback).toHaveBeenCalled();
            expect(instance.scroll_marker_current_callback).toHaveBeenCalled();

            expect(nav_id1.classList.contains("in-view")).toBe(false);
            expect(nav_id2.classList.contains("in-view")).toBe(true);
            expect(nav_id3.classList.contains("in-view")).toBe(true);

            expect(nav_id1.classList.contains("current")).toBe(false);
            expect(nav_id2.classList.contains("current")).toBe(true);
            expect(nav_id3.classList.contains("current")).toBe(false);

            expect(id1.classList.contains("scroll-marker-current")).toBe(false);
            expect(id2.classList.contains("scroll-marker-current")).toBe(true);
            expect(id3.classList.contains("scroll-marker-current")).toBe(false);
        });

        it("2.3: distance 50, side bottom, id2 is current", async () => {
            const { instance, nav_id1, nav_id2, nav_id3, id1, id2, id3 } =
                await create_scroll_marker({
                    options: {
                        distance: "50%",
                        side: "bottom",
                    },
                    scroll_container_main: true,
                });

            // Callbacks have been called.
            expect(instance.scroll_marker_callback).toHaveBeenCalled();
            expect(instance.scroll_marker_current_callback).toHaveBeenCalled();

            expect(nav_id1.classList.contains("in-view")).toBe(false);
            expect(nav_id2.classList.contains("in-view")).toBe(true);
            expect(nav_id3.classList.contains("in-view")).toBe(true);

            expect(nav_id1.classList.contains("current")).toBe(false);
            expect(nav_id2.classList.contains("current")).toBe(true);
            expect(nav_id3.classList.contains("current")).toBe(false);

            expect(id1.classList.contains("scroll-marker-current")).toBe(false);
            expect(id2.classList.contains("scroll-marker-current")).toBe(true);
            expect(id3.classList.contains("scroll-marker-current")).toBe(false);
        });

        it("2.4: distance 50, side top, visibility: most-visible, id2 is current", async () => {
            // Here we have again the default values, this time explicitly set.
            // Only the visibility is set to most-visible, which means that id2 is
            // the current one,
            //
            const { instance, nav_id1, nav_id2, nav_id3, id1, id2, id3 } =
                await create_scroll_marker({
                    options: {
                        distance: "50%",
                        side: "top",
                        visibility: "most-visible",
                    },
                    scroll_container_main: true,
                });

            // Callbacks have been called.
            expect(instance.scroll_marker_callback).toHaveBeenCalled();
            expect(instance.scroll_marker_current_callback).toHaveBeenCalled();

            expect(nav_id1.classList.contains("in-view")).toBe(false);
            expect(nav_id2.classList.contains("in-view")).toBe(true);
            expect(nav_id3.classList.contains("in-view")).toBe(true);

            expect(nav_id1.classList.contains("current")).toBe(false);
            expect(nav_id2.classList.contains("current")).toBe(true);
            expect(nav_id3.classList.contains("current")).toBe(false);

            expect(id1.classList.contains("scroll-marker-current")).toBe(false);
            expect(id2.classList.contains("scroll-marker-current")).toBe(true);
            expect(id3.classList.contains("scroll-marker-current")).toBe(false);
        });
    });
});
