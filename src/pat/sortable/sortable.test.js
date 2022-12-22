import events from "../../core/events";
import $ from "jquery";
import Sortable from "./sortable";

describe("pat-sortable", function () {
    afterEach(function () {
        document.body.innerHTML = "";
    });

    it("1 - adds class on drag start", function () {
        document.body.innerHTML = `
            <ul class="pat-sortable">
                <li>One</li>
                <li>Two</li>
                <li>Three</li>
            </ul>
        `;
        const el = document.querySelector(".pat-sortable");
        const sortable = new Sortable(el);
        const dragged = el.querySelector("li");
        const handle = dragged.querySelector(".sortable-handle");
        handle.dispatchEvent(new Event("dragstart"));
        expect(dragged.classList.contains(sortable.options.dragClass)).toBe(true);
    });

    it("2 - adds a sortable handle to sortable elements", function () {
        document.body.innerHTML = `
            <ul class="pat-sortable">
                <li>One</li>
                <li>Two</li>
                <li>Three</li>
            </ul>
        `;
        const el = document.querySelector(".pat-sortable");
        new Sortable(el);
        const handles = el.querySelectorAll("li a.sortable-handle");
        expect(handles.length).toBe(3);
        expect(handles[0].getAttribute("draggable")).toBe("true");
        expect(handles[1].getAttribute("draggable")).toBe("true");
        expect(handles[2].getAttribute("draggable")).toBe("true");
    });

    it("3 - submits a form if there is a .sortable-amount input and .sortable-button-(up|down) buttons", function () {
        document.body.innerHTML = `
            <form>
              <ol class="pat-sortable"
                  data-pat-sortable="selector: .sortable"
              >
                <li class="sortable"
                    id="item1"
                >
                  Item 1
                  <span class="button-cluster">
                    <button class="button sortable-button-up"
                            hidden
                            name="up_item_1"
                            type="submit"
                            value="up"
                    >Up</button>
                    <button class="button sortable-button-down"
                            hidden
                            name="down_item_1"
                            type="submit"
                            value="down"
                    >down</button>
                  </span>
                </li>
                <li class="sortable"
                    id="item2"
                >
                  Item 2
                  <span class="button-cluster">
                    <button class="button sortable-button-up"
                            name="up_item_2"
                            type="submit"
                            value="up"
                    >Up</button>
                    <button class="button sortable-button-down"
                            name="down_item_2"
                            type="submit"
                            value="down"
                    >down</button>
                  </span>
                </li>
                <li class="sortable"
                    id="item3"
                >
                  Item 3
                  <span class="button-cluster">
                    <button class="button sortable-button-up"
                            name="up_item_3"
                            type="submit"
                            value="up"
                    >Up</button>
                    <button class="button sortable-button-down"
                            name="down_item_3"
                            type="submit"
                            value="down"
                    >down</button>
                  </span>
                </li>
              </ol>
              <input class="sortable-amount"
                     name="amount"
                     type="hidden"
                     value="1"
              />
            </form>
        `;
        const el = document.querySelector(".pat-sortable");
        new Sortable(el);
        const handles = el.querySelectorAll("li a.sortable-handle");
        expect(handles.length).toBe(3);

        const form = document.querySelector("form");

        $("#item3").prependTo($("ol")); // Simulate dragging it to the top.
        const submitCallback = jest.fn();
        submitCallback.mockReturnValue(false);
        $(form).submit(submitCallback);
        document
            .querySelector("#item3 a.sortable-handle")
            .dispatchEvent(events.dragend_event());
        expect(document.querySelector(".sortable-amount").getAttribute("value")).toBe(
            "2"
        );
        expect(submitCallback).toHaveBeenCalled();
    });

    it("4 - Triggers pat-update on drag end", function () {
        document.body.innerHTML = `
          <ul class="pat-sortable">
            <li>One</li>
            <li>Two</li>
            <li>Three</li>
          </ul>
        `;
        const el = document.querySelector(".pat-sortable");
        new Sortable(el);
        const dragging_element = el.querySelector("li");
        const handle = dragging_element.querySelector("a.sortable-handle");

        let data = null;
        $(el).on("pat-update", (e, d) => {
            data = d;
        });

        handle.dispatchEvent(events.dragend_event());

        expect(data.pattern).toBe("sortable");
        expect(data.action).toBe("changed");
        expect(data.dom).toBe(dragging_element);
    });

    it("5 - Initializes sorting behavior on pat-clone'd elements.", async function () {
        const Clone = (await import("../clone/clone")).default;

        document.body.innerHTML = `
            <ul class="pat-sortable pat-clone"
                data-pat-clone="template: .clone-template; trigger-element: .clone-trigger">
            </ul>
            <button class="clone-trigger">Clone</button>
            <template class="clone-template">
                <li>item</li>
            </template>
        `;
        const el = document.querySelector(".pat-sortable");
        const sortable = new Sortable(el);
        new Clone(el);

        const clone_trigger = document.querySelector(".clone-trigger");
        clone_trigger.click();

        const cloned = el.querySelector("li");
        expect(cloned).toBeTruthy();

        const drag_handle = cloned.querySelector(".sortable-handle");
        expect(drag_handle).toBeTruthy();
        drag_handle.dispatchEvent(new Event("dragstart"));

        expect(cloned.classList.contains(sortable.options.dragClass)).toBe(true);
    });
});
