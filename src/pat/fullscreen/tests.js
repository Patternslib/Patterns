define(["pat-fullscreen"], function(Pattern) {

    describe("Open in fullscreen", function() {
        beforeEach(function() {
            var el = document.createElement('div');
            el.setAttribute('class', 'fs');
            el.setAttribute('id', 'fs');
            document.body.appendChild(el);
        });
        afterEach(function() {
            document.body.removeChild(document.querySelector('#fs'));
            var exit = document.querySelector('.close-fullscreen');
            if (exit) {
                document.body.removeChild(exit);
            }
        });

        // NOTE:
        // These tests run in an iframe.
        // Setting fullscreen within an iframe doesn't work properly except the ``allow="fullscreen"`` attribute is set.
        // Running karma with ``client.useIframe: false`` doesn't help either.
        // Because of that screenful change event isn't thrown and the close button never removed.
        // Therefore do not fully assure the functionality of the fullscreen pattern.

        it("Open in fullscreen via an id reference in the href attribute of an anchor tag.", function(done) {
            var fs_el = document.querySelector('#fs');
            var pat_el = document.createElement('a');
            pat_el.setAttribute('class', 'pat-fullscreen');
            pat_el.setAttribute('href', '#fs');
            pat_el.appendChild(document.createTextNode('Open in fullscreen'));
            fs_el.appendChild(pat_el);

            Pattern.init($(".pat-fullscreen"));
            $('.pat-fullscreen').click();
            expect($('.close-fullscreen').length).toBe(1);
            // $('.close-fullscreen').click();
            // expect($('.close-fullscreen').length).toBe(0);
            done();
        });

        it("Open in fullscreen via an class reference in data attributes.", function(done) {
            var fs_el = document.querySelector('#fs');
            var pat_el = document.createElement('button');
            pat_el.setAttribute('class', 'pat-fullscreen');
            pat_el.setAttribute('data-pat-fullscreen', 'target:.fs');
            pat_el.appendChild(document.createTextNode('Open in fullscreen'));
            fs_el.appendChild(pat_el);

            Pattern.init($(".pat-fullscreen"));
            $('.pat-fullscreen').click();
            expect($('.close-fullscreen').length).toBe(1);
            // $('.close-fullscreen').click();
            // expect($('.close-fullscreen').length).toBe(0);
            done();
        });

        it("Open body in fullscreen.", function(done) {
            var fs_el = document.querySelector('#fs');
            var pat_el = document.createElement('button');
            pat_el.setAttribute('class', 'pat-fullscreen');
            pat_el.appendChild(document.createTextNode('Open in fullscreen'));
            fs_el.appendChild(pat_el);

            Pattern.init($(".pat-fullscreen"));
            $('.pat-fullscreen').click();
            expect($('.close-fullscreen').length).toBe(1);
            // $('.close-fullscreen').click();
            // expect($('.close-fullscreen').length).toBe(0);
            done();
        });

        it("Open in fullscreen without an close button.", function(done) {
            var fs_el = document.querySelector('#fs');
            var pat_el = document.createElement('button');
            pat_el.setAttribute('class', 'pat-fullscreen');
            pat_el.setAttribute('data-pat-fullscreen', 'closebutton:false');
            pat_el.appendChild(document.createTextNode('Open in fullscreen'));
            fs_el.appendChild(pat_el);

            Pattern.init($(".pat-fullscreen"));
            $('.pat-fullscreen').click();
            expect($('.close-fullscreen').length).toBe(0);
            done();
        });

    });
});
