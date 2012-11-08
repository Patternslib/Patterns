describe("Core / logging", function() {
    var logging;

    requireDependencies(["core/logging"], function(cls) {
        logging = cls;
    });

    describe("Logger", function() {
        afterEach(function() {
            delete logging.getLogger("xyzzy")._parent._loggers.xyzzy;
        });

        describe("getLogger", function() {
            it("Create new logger", function() {
                var logger = logging.getLogger("xyzzy");
                expect(logger.name).toBe("xyzzy");
                var root = logger._parent;
                expect(root._loggers.xyzzy).toBe(logger);
            });

            it("Return existing logger", function() {
                logging.getLogger("xyzzy").dummy=true;
                var logger = logging.getLogger("xyzzy");
                expect(logger.dummy).toBe(true);
            });
        });

        describe("_getFlag", function() {
            it("Flag set on current instance", function() {
                var logger = logging.getLogger("xyzzy");
                logger._flag=true;
                expect(logger._getFlag("flag")).toBe(true);
            });

            it("Flag set on parent instance", function() {
                var logger = logging.getLogger("xyzzy");
                    root = logger._parent;
                root._flag=true;
                expect(logger._getFlag("flag")).toBe(true);
                delete root._flag;
            });

            it("Flag on child overrides flag on parent", function() {
                var logger = logging.getLogger("xyzzy"),
                    root = logger._parent;
                root._flag="parent";
                logger._flag="child";
                expect(logger._getFlag("flag")).toBe("child");
                delete root._flag;
            });
        });

        describe("setLevel", function() {
            afterEach(function() {
                logging.setLevel(logging.Level.INFO);
            });

            it("Integer level", function() {
                logging.setLevel(42);
                expect(logging.getLevel()).toBe(42);
            });

            it("Level name", function() {
                logging.setLevel("FATAL");
                expect(logging.getLevel()).toBe(logging.Level.FATAL);
            });

            it("Level name is not case sensitive", function() {
                logging.setLevel("FaTal");
                expect(logging.getLevel()).toBe(logging.Level.FATAL);
            });
        });
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
