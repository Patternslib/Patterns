import store from "./store";

describe("Core / store", function() {

    describe("store API", function() {
        it("PhantomJS supports storage", function() {
            expect(store.supported).toBe(true);
        });

        it("localStorage accessor", function() {
            var storage = store.local("mypattern");
            expect(storage.prefix).toBe("mypattern");
            try {
                expect(storage.backend).toBe(window.localStorage);
            } catch(e) {
                // IE8 throws an exception if you try to do something as
                // simple as window.localStorage===window.localStorage
            }
        });

        it("sessionStorage accessor", function() {
            var storage = store.session("mypattern");
            expect(storage.prefix).toBe("mypattern");
            try {
                expect(storage.backend).toBe(window.sessionStorage);
            } catch (e) {
                // IE8 throws an exception if you try to do something as
                // simple as window.localStorage===window.localStorage
            }
        });
    });

    describe("Storage", function() {
        beforeEach(function() {
            window.localStorage.clear();
            window.sessionStorage.clear();
        });

        describe("get/set", function() {
            it("Get and set a string", function() {
                var storage = store.session("mypattern");
                storage.set("foo", "bar");
                expect(storage.get("foo")).toBe("bar");
            });

            it("Get and set an array", function() {
                var storage = store.session("mypattern");
                storage.set("foo", ["bar", "buz"]);
                expect(storage.get("foo")).toEqual(["bar", "buz"]);
            });

            it("Get an unknown key", function() {
                var storage = store.session("mypattern");
                expect(storage.get("foo")).toBeNull();
            });

            it("Values are local to storage", function() {
                var storage1 = store.session("pattern1"),
                    storage2 = store.session("pattern2");
                storage1.set("foo", "bar");
                expect(storage2.get("foo")).toBeNull();
            });
        });

        describe("pat-remove", function() {
            it("Remove unknown key", function() {
                var storage = store.session("mypattern");
                storage.set("foo", "bar");
                storage.remove("foo");
                expect(storage.get("foo")).toBeNull();
            });

            it("Remove is local to pattern", function() {
                var storage1 = store.session("pattern1"),
                    storage2 = store.session("pattern2");
                storage1.set("foo", "bar");
                storage2.set("foo", "bar");
                storage2.remove("foo");
                expect(storage2.get("foo")).toBeNull();
                expect(storage1.get("foo")).toBe("bar");
            });

            it("Remove key", function() {
                var storage = store.session("mypattern");
                storage.remove("foo");
            });
        });

        describe("clear", function() {
            it("Empty", function() {
                var storage = store.session("mypattern");
                storage.clear();
            });

            it("Clear storage", function() {
                var storage = store.session("mypattern");
                storage.set("foo", "bar");
                storage.clear();
                expect(storage.get("foo")).toBeNull();
            });

            it("Clear is local to storage", function() {
                var storage1 = store.session("pattern1"),
                    storage2 = store.session("pattern2");
                storage1.set("foo", "bar");
                storage2.set("foo", "bar");
                storage2.clear();
                expect(storage1.get("foo")).toBe("bar");
            });
        });

        describe("all", function() {
            it("Empty storage", function() {
                var storage = store.session("mypattern");
                expect(storage.all()).toEqual({});
            });

            it("Storage with data", function() {
                var storage = store.session("mypattern");
                storage.set("number", 7);
                storage.set("string", "Hello");
                expect(storage.all()).toEqual({number: 7, string: "Hello"});
            });

            it("Local to storage", function() {
                var storage1 = store.session("pattern1"),
                    storage2 = store.session("pattern2");
                storage1.set("foo", "bar");
                storage2.set("buz", "boo");
                expect(storage1.all()).toEqual({foo: "bar"});
                expect(storage2.all()).toEqual({buz: "boo"});
            });
        });
    });
});
