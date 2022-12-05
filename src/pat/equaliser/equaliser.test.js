import $ from "jquery";
import pattern from "./equaliser";

describe("pat-equaliser", function () {
    beforeEach(function () {
        $("<div/>", { id: "lab" }).appendTo(document.body);
    });

    afterEach(function () {
        $("#lab").remove();
    });

    describe("_update", function () {
        beforeEach(function () {
            var style,
                head = document.head || document.getElementsByTagName("head")[0],
                css = ".small { height: 50px; }\n" + ".large { height: 100px; }";

            style = document.createElement("style");
            style.id = "pat-equaliser-style";
            style.type = "text/css";
            if (style.styleSheet) style.styleSheet.cssText = css;
            else style.appendChild(document.createTextNode(css));
            head.appendChild(style);
        });

        afterEach(function () {
            $("#pat-equaliser-style").remove();
        });

        it("Basic setup", function () {
            var $container = $("<div/>");
            $("<div/>", { class: "small" }).appendTo($container);
            $("<div/>", { class: "large" }).appendTo($container);
            $container.appendTo("#lab");
            $container.data("pat-equaliser", { transition: "none" });
            pattern._update($container[0]);
            expect($container.find(".large").height()).toBe(100);
            expect($container.find(".large").hasClass("equalised")).toBeTruthy();
            expect($container.find(".small").height()).toBe(100);
            expect($container.find(".small").hasClass("equalised")).toBeTruthy();
        });

        it("Ignore inline styles", function () {
            // This is necessary so we do not get fooled by the height we
            // set ourselves.
            var $container = $("<div/>");
            $("<div/>", { class: "small" }).css("height", "200px").appendTo($container);
            $("<div/>", { class: "large" }).css("height", "200px").appendTo($container);
            $container.appendTo("#lab");
            $container.data("pat-equaliser", { transition: "none" });
            pattern._update($container[0]);
            expect($container.find(".small").height()).toBe(100);
            expect($container.find(".large").height()).toBe(100);
        });

        it("Triggers pat-update after equalisation.", function () {
            document.body.innerHTML = `
                <div class="pat-equaliser"
                     data-pat-equaliser="transition: none">
                    <div class="small"></div>
                    <div class="large"></div>
                </div>
            `;

            const $container = $(".pat-equaliser");

            let data = null;
            $container.on("pat-update", (e, d) => {
                data = d;
            });

            pattern._update($container[0]);

            expect(data.pattern).toBe("equaliser");
            expect(data.action).toBe("attribute-changed");
            expect(data.dom).toBe($container[0]);
        });
    });
});
