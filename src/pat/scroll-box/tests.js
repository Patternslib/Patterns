define(["pat-scroll-box", "pat-registry"], function (Pattern, registry) {

  describe("pat-scroll-box", function () {

    it("adds scroll classes when scrolling", function (done) {

      // setup
      document.body.setAttribute('class', 'pat-scroll-box');
      document.body.setAttribute('style', 'height: 1000px');
      let scrollbox = document.createElement('div');
      scrollbox.setAttribute('class', 'pat-scroll-box');
      scrollbox.setAttribute('style', 'overflow: auto; height: 200px');
      let scrollbox_inner = document.createElement('div');
      scrollbox_inner.setAttribute('style', 'height: 400px');

      scrollbox.appendChild(scrollbox_inner);
      document.body.appendChild(scrollbox);

      registry.init();
      // Pattern.init($(scrollbox));
      // Pattern.init($(document.body));

      // initial
      console.log(scrollbox.classList);
      console.log(document.body.classList);
      expect(scrollbox.classList.contains('scroll-down')).toBe(false);
      expect(scrollbox.classList.contains('scroll-up')).toBe(false);
      expect(scrollbox.classList.contains('scroll-position-top')).toBe(true);
      expect(scrollbox.classList.contains('scroll-position-bottom')).toBe(false);
      // body
      expect(document.body.classList.contains('scroll-down')).toBe(false);
      expect(document.body.classList.contains('scroll-up')).toBe(false);
      expect(document.body.classList.contains('scroll-position-top')).toBe(true);
      expect(document.body.classList.contains('scroll-position-bottom')).toBe(false);

      scrollbox.scrolltop = 100;
      // scrollbox
      expect(scrollbox.classList.contains('scroll-down')).toBe(true);
      expect(scrollbox.classList.contains('scroll-up')).toBe(false);
      expect(scrollbox.classList.contains('scroll-position-top')).toBe(false);
      expect(scrollbox.classList.contains('scroll-position-bottom')).toBe(false);
      // body
      expect(document.body.classList.contains('scroll-down')).toBe(false);
      expect(document.body.classList.contains('scroll-up')).toBe(false);
      expect(document.body.classList.contains('scroll-position-top')).toBe(true);
      expect(document.body.classList.contains('scroll-position-bottom')).toBe(false);  // 14016

      scrollbox.scrolltop = 50;
      // scrollbox
      expect(scrollbox.classList.contains('scroll-down')).toBe(false);
      expect(scrollbox.classList.contains('scroll-up')).toBe(true);
      expect(scrollbox.classList.contains('scroll-position-top')).toBe(false);
      expect(scrollbox.classList.contains('scroll-position-bottom')).toBe(false);
      // body
      expect(document.body.classList.contains('scroll-down')).toBe(false);
      expect(document.body.classList.contains('scroll-up')).toBe(false);
      expect(document.body.classList.contains('scroll-position-top')).toBe(true);
      expect(document.body.classList.contains('scroll-position-bottom')).toBe(false);

      scrollbox.scrolltop = 0;
      // scrollbox
      expect(scrollbox.classList.contains('scroll-down')).toBe(false);
      expect(scrollbox.classList.contains('scroll-up')).toBe(true);
      expect(scrollbox.classList.contains('scroll-position-top')).toBe(true);
      expect(scrollbox.classList.contains('scroll-position-bottom')).toBe(false);
      // body
      expect(document.body.classList.contains('scroll-down')).toBe(false);
      expect(document.body.classList.contains('scroll-up')).toBe(false);
      expect(document.body.classList.contains('scroll-position-top')).toBe(true);
      expect(document.body.classList.contains('scroll-position-bottom')).toBe(false);

      scrollbox.scrolltop = 400;
      // scrollbox
      expect(scrollbox.classList.contains('scroll-down')).toBe(true);
      expect(scrollbox.classList.contains('scroll-up')).toBe(false);
      expect(scrollbox.classList.contains('scroll-position-top')).toBe(false);
      expect(scrollbox.classList.contains('scroll-position-bottom')).toBe(true);
      // body
      expect(document.body.classList.contains('scroll-down')).toBe(false);
      expect(document.body.classList.contains('scroll-up')).toBe(false);
      expect(document.body.classList.contains('scroll-position-top')).toBe(true);
      expect(document.body.classList.contains('scroll-position-bottom')).toBe(false);

      // scrolling the body
      // scrollbox state is retained
      //
      window.scrollTo(0, 100);
      // scrollbox
      expect(scrollbox.classList.contains('scroll-down')).toBe(true);
      expect(scrollbox.classList.contains('scroll-up')).toBe(false);
      expect(scrollbox.classList.contains('scroll-position-top')).toBe(false);
      expect(scrollbox.classList.contains('scroll-position-bottom')).toBe(true);
      // body
      expect(document.body.classList.contains('scroll-down')).toBe(true);
      expect(document.body.classList.contains('scroll-up')).toBe(false);
      expect(document.body.classList.contains('scroll-position-top')).toBe(false);
      expect(document.body.classList.contains('scroll-position-bottom')).toBe(false);

      window.scrollTo(0, 50);
      // scrollbox
      expect(scrollbox.classList.contains('scroll-down')).toBe(true);
      expect(scrollbox.classList.contains('scroll-up')).toBe(false);
      expect(scrollbox.classList.contains('scroll-position-top')).toBe(false);
      expect(scrollbox.classList.contains('scroll-position-bottom')).toBe(true);
      // body
      expect(document.body.classList.contains('scroll-down')).toBe(false);
      expect(document.body.classList.contains('scroll-up')).toBe(true);
      expect(document.body.classList.contains('scroll-position-top')).toBe(false);
      expect(document.body.classList.contains('scroll-position-bottom')).toBe(false);

      window.scrollTo(0, 0);
      // scrollbox
      expect(scrollbox.classList.contains('scroll-down')).toBe(true);
      expect(scrollbox.classList.contains('scroll-up')).toBe(false);
      expect(scrollbox.classList.contains('scroll-position-top')).toBe(false);
      expect(scrollbox.classList.contains('scroll-position-bottom')).toBe(true);

      // body
      expect(document.body.classList.contains('scroll-down')).toBe(false);
      expect(document.body.classList.contains('scroll-up')).toBe(true);
      expect(document.body.classList.contains('scroll-position-top')).toBe(true);
      expect(document.body.classList.contains('scroll-position-bottom')).toBe(false);

      window.scrollTo(0, 400);
      // scrollbox
      expect(scrollbox.classList.contains('scroll-down')).toBe(true);
      expect(scrollbox.classList.contains('scroll-up')).toBe(false);
      expect(scrollbox.classList.contains('scroll-position-top')).toBe(false);
      expect(scrollbox.classList.contains('scroll-position-bottom')).toBe(true);
      // body
      expect(document.body.classList.contains('scroll-down')).toBe(true);
      expect(document.body.classList.contains('scroll-up')).toBe(false);
      expect(document.body.classList.contains('scroll-position-top')).toBe(false);
      expect(document.body.classList.contains('scroll-position-bottom')).toBe(true);

      done();

    });

    it("does not set classes when not scrollable", function (done) {

      // setup
      let scrollbox = document.createElement('div');
      scrollbox.setAttribute('class', 'pat-scroll-box');
      scrollbox.setAttribute('style', 'height: 200px'); // overflow not set, default = 'visible'
      let scrollbox_inner = document.createElement('div');
      scrollbox_inner.setAttribute('style', 'height: 400px');

      scrollbox.appendChild(scrollbox_inner);
      document.body.appendChild(scrollbox);

      registry.scan(document.body);

      // initial
      expect(scrollbox.classList.contains('scroll-down')).toBe(false);
      expect(scrollbox.classList.contains('scroll-up')).toBe(false);
      expect(scrollbox.classList.contains('scroll-position-top')).toBe(false);
      expect(scrollbox.classList.contains('scroll-position-bottom')).toBe(false);

      scrollbox.scrolltop = 100;
      expect(scrollbox.scrollTop).toBe(0); // cannot be scrolled
      expect(scrollbox.classList.contains('scroll-down')).toBe(false);
      expect(scrollbox.classList.contains('scroll-up')).toBe(false);
      expect(scrollbox.classList.contains('scroll-position-top')).toBe(false);
      expect(scrollbox.classList.contains('scroll-position-bottom')).toBe(false);

      done();

    });

  });
});
