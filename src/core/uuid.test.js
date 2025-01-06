import create_uuid from "./uuid";

describe("uuid", function () {
    it("returns a UUIDv4", function () {
        const uuid = create_uuid();
        expect(uuid).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
        );
    });

    it("returns a sufficiently unique id", function () {
        // Mock window.crypto.randomUUID not existing, like in browser with
        // non-secure context.
        const orig_randomUUID = window.crypto.randomUUID;
        window.crypto.randomUUID = undefined;

        const uuid = create_uuid();
        expect(uuid).toMatch(/^[0-9]*$/);

        window.crypto.randomUUID = orig_randomUUID;
    });
});
