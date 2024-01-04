import "./polyfills";

describe("NavigateEvent tests", () => {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("should fire an event when history.pushState is called.", () => {
        let destination_url;

        window.navigation.addEventListener("navigate", (event) => {
            destination_url = event.destination.url;
        });

        const path = "foo/bar/baz.html";
        history.pushState(null, "", path);

        expect(destination_url).toBe(path);
    });


    it("should fire an event when history.replaceState is called.", () => {
        let destination_url;

        window.navigation.addEventListener("navigate", (event) => {
            destination_url = event.destination.url;
        });

        const path = "foo/bar/baz.html";
        history.replaceState(null, "", path);

        expect(destination_url).toBe(path);
    });
});
