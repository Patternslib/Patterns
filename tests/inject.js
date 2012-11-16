describe("inject-pattern", function() {
    var pattern;

    requireDependencies(["patterns/inject"], function(cls) {
        pattern = cls;
    });

    // Reset the lab before each test
    beforeEach(function() {
        $("#lab *").remove();
    });

    describe("Functional tests", function() {
        
        describe("extract/verifyConfig", function() {
            var $a, $target;

            beforeEach(function() {
                $a = $('<a class="pat-inject" href="test.html#someid">link</a>');
                $target = $('<div id="someid">');

                $("#lab").append($a).append($target);
            });


            it("fall back to href id", function() {
                var cfgs = pattern.extractConfig($a);
                expect(pattern.verifyConfig(cfgs)).toBeTruthy();

                expect(cfgs.length).toBe(1);
                expect(cfgs[0].source).toBe('#someid');
                expect(cfgs[0].target).toBe('#someid');
            });

            it("take first positional option as source and target", function() {
                var cfgs;

                $a.attr('data-pat-inject', '#otherid');
                $target.attr('id', 'otherid');
                cfgs = pattern.extractConfig($a);
                expect(pattern.verifyConfig(cfgs)).toBeTruthy();

                expect(cfgs[0].source).toBe('#otherid');
                expect(cfgs[0].target).toBe('#otherid');
            });

            it("take two positional options as source and target resp.", function() {
                var cfgs;

                $a.attr('data-pat-inject', '#otherid; #yetanotherid');
                $target.attr('id', 'yetanotherid');
                cfgs = pattern.extractConfig($a);
                expect(pattern.verifyConfig(cfgs)).toBeTruthy();

                expect(cfgs[0].source).toBe('#otherid');
                expect(cfgs[0].target).toBe('#yetanotherid');
            });

            it("create target if it doesn't exist", function() {
                var cfgs = pattern.extractConfig($a);

                $target.remove();
                expect(pattern.verifyConfig(cfgs)).toBeTruthy();
                
                $target = $('#someid');
                this.after(function() { $target.remove(); });
                expect($target.length).toBeGreaterThan(0);
                expect($target.parent().prop('tagName')).toBe('BODY');
            });
        });
    });

    describe("DOM tests", function() {
            
        describe("inject on anchor", function() {
            var $a, $div, answer;

            answer = function(html) {
                expect($.ajax).toHaveBeenCalled();
                $.ajax.mostRecentCall.args[0]['success'](html);
            };

            beforeEach(function() {
                $a = $('<a class="pat-inject" href="test.html#someid">link</a>'),
                $div = $('<div id="someid" />');
                $("#lab").append($a).append($div);

                spyOn($, "ajax");
            });


            it("fetches url on click", function() {
                pattern.init($a);

                $a.trigger("click");

                expect($.ajax).toHaveBeenCalled();
                expect($.ajax.mostRecentCall.args[0]['url']).toBe("test.html");
            });
            
            it("injects into existing div", function() {
                pattern.init($a);
                $a.trigger("click");
                answer('<html><body><div id="someid">replacement</div></body></html>');

                expect($div.html()).toBe("replacement");
            });

            it("injects multiple times", function() {
                pattern.init($a);
                $a.trigger("click");
                answer('<html><body><div id="someid">replacement</div></body></html>');
                expect($div.html()).toBe("replacement");

                $a.trigger("click");
                answer('<html><body><div id="someid">new replacement</div></body></html>');
                expect($div.html()).toBe("new replacement");
            });

            it("takes multiple source-target pairs", function() {
                $a.attr("data-pat-inject", "#someid1; #otherid1 && #someid2; #otherid2");
                $target1 = $('<div id="otherid1" />');
                $target2 = $('<div id="otherid2" />');
                $div.append($target1).append($target2);

                pattern.init($a);
                $a.trigger("click");
                answer('<html><body>'
                       + '<div id="someid1">repl1</div>'
                       + '<div id="someid2">repl2</div>'
                       + '</body></html>');

                expect($target1.html()).toBe("repl1");
                expect($target2.html()).toBe("repl2");
            });
                
            it("acts on other selectors as well", function() {
                $a.attr("data-pat-inject", "target: #someid > .someclass");
                $target1 = $('<div class="someclass" />');
                $target2 = $('<div class="someclass" />');
                $div.append($target1).append($target2);

                pattern.init($a);
                $a.trigger("click");
                answer('<html><body>'
                       + '<div id="someid">repl</div>'
                       + '</body></html>');

                expect($target1.html()).toBe("repl");
                expect($target2.html()).toBe("repl");
            });

            it("sets/unsets load class 'injecting'", function() {
                var callback = jasmine.createSpy("patterns-injected");
                $(document).on("patterns-injected", callback);

                pattern.init($a);
                $a.trigger("click");
                
                expect($div.hasClass("injecting")).toBeTruthy();

                answer('<html><body>'
                       + '<div id="someid">repl</div>'
                       + '</body></html>');
                expect($div.hasClass("injecting")).toBeFalsy();

                expect(callback).toHaveBeenCalled();
            });

            // XXX: Tests for ::element ::after, ...
        });


        describe("inject on forms", function() {
            // XXX
        });
    });
});

// jshint indent: 4, browser: true, jquery: true, quotmark: double
// vim: sw=4 expandtab
