import "./form-data-event";
import registry from "./registry";
import utils from "./utils";

describe("form-data-event: Pass form data via events.", () => {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("Initializes a form with data when receiving an initialization event, but only once", async () => {
        document.body.innerHTML = `
            <form
                class="form-data-event"
                data-form-data-event="
                    event-name-init: init-event
                ">
              <input type="text" name="inp1" />
              <input type="text" name="inp2" />
              <input type="checkbox" name="inp3" />
              <textarea name="inp4"></textarea>
            </form>
        `;

        registry.scan(document.body);

        const longer_text = `HalloGallo
Sonderangebot
Weissensee
Jahresüberblick
Im Glück
Negativland
Lieber Honig`;

        const form_data = new FormData();
        form_data.append("inp1", "Neu!");
        form_data.append("inp2", "1972");
        form_data.append("inp3", true);
        form_data.append("inp4", longer_text);

        const init_event = new CustomEvent("init-event", {
            detail: { form_data: form_data },
        });
        document.dispatchEvent(init_event);

        await utils.timeout(1);

        const form = document.querySelector("form");
        expect(form.querySelector("[name=inp1]").value).toBe("Neu!");
        expect(form.querySelector("[name=inp2]").value).toBe("1972");
        expect(form.querySelector("[name=inp3]").checked).toBe(true);
        expect(form.querySelector("[name=inp4]").value).toBe(longer_text);

        // Another initialization Event won't change the form again
        // The reason for the once-registration of the event is to prevent
        // unused event handlers to be hanging around.

        const form_data_2 = new FormData();
        form_data_2.append("inp1", "Kraftwerk");
        form_data_2.append("inp2", "Autobahn");
        form_data_2.append("inp3", false);
        form_data_2.append("inp4", "");

        const init_event_2 = new CustomEvent("init-event", {
            detail: { form_data: form_data_2 },
        });
        document.dispatchEvent(init_event_2);

        await utils.timeout(1);

        expect(form.querySelector("[name=inp1]").value).toBe("Neu!");
        expect(form.querySelector("[name=inp2]").value).toBe("1972");
        expect(form.querySelector("[name=inp3]").checked).toBe(true);
        expect(form.querySelector("[name=inp4]").value).toBe(longer_text);
    });

    it("Passes form data via an submit event", async () => {
        // Note: line breaks might change from /n to /r
        // Testing without line breaks for now.
        const longer_text = `Autobahn, Kometenmelodie 1, Kometenmelodie 2, Mitternacht, Morgenspaziergang`;

        document.body.innerHTML = `
            <form
                class="form-data-event"
                data-form-data-event="
                  event-name-submit: submit-event
                ">
              <input type="text" name="inp1" value="Kraftwerk" />
              <input type="text" name="inp2" value="Autobahn" />
              <input type="checkbox" name="inp3" value="on" checked />
              <textarea name="inp4">${longer_text}</textarea>
            </form>
        `;

        registry.scan(document.body);

        let form_data;
        document.addEventListener("submit-event", (e) => {
            form_data = e.detail.form_data;
        });

        const form = document.querySelector("form");

        form.dispatchEvent(new Event("submit"));

        await utils.timeout(1);

        expect(form_data instanceof FormData).toBeTruthy();
        expect(form_data.get("inp1")).toBe("Kraftwerk");
        expect(form_data.get("inp2")).toBe("Autobahn");
        expect(form_data.get("inp3")).toBe("on");
        expect(form_data.get("inp4")).toBe(longer_text);
    });
});
