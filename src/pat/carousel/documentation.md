## Description

The carousel pattern allows for displaying more content in the same amount of screen estate by letting users click or swipe through through slices of content.

## Documentation

Patterns builds on the slick library
[Slick](http://kenwheeler.github.io/slick/)
(licensed under LGPL 3) to provide a very simple way to create
carousels. Just by adding a `pat-carousel` class to your markup you can
turn anything into a beautiful carousel.

Carousels usually use an unordered list to define all panels:

    <ul class="pat-carousel">
      <li><img title="Panel 1"/></li>
      <li><img title="Panel 2"/></li>
      <li><img title="Panel 3"/></li>
    </ul>

This is not required though: any element can be used as container and
for panels. For example using a sequence of divs in a section:

    <section class="pat-carousel">
      <div>
        <h2>This is panel 1</h2>
        <p>....</p>
      </div>
      <div>
        <h2>This is panel 2</h2>
        <p>....</p>
      </div>
    </section>

There are no restrictions on the content that you use in a panels: you
can use images, videos, or any other HTML content.

Any links in the page that point directly to a panel will cause the
carousel to jump to the linked panel when clicked.

    <ul class="pat-carousel">
      <li id="intro"><img title="Panel 1"/></li>
      <li id="frontpage"><img title="Panel 2"/></li>
      <li id="reports"><img title="Panel 3"/></li>
    </ul>

    <p>As you can see in the <a href="#reports">reports screenshot</a>
     AcmeReports(TM) can generate beautiful reports.</p>

Such links will automatically get a `current` class when the panel they
are pointing to is displayed.

### Lazy loading

The carousel supports lazy loading. To use this simply give your images
a `data-src` attribute. When a panel is about to be displayed the
carousel will move all `data-src` attributes to `src`

    <ul class="pat-carousel">
      <li><img data-src="images/img1.jpg/></li>
      <li><img data-src="images/img2.jpg/></li>
    </ul>

### Customizing behaviour

The default carousel is quite spartan. You can customize it through
options in the `data-pat-carousel` attribute.

    <ul class="pat-carousel" data-pat-carousel="loop: false; control-arrows: true;">
      <li><img title="Panel 1"/></li>
      <li><img title="Panel 2"/></li>
      <li><img title="Panel 3"/></li>
    </ul>

| Property         | Description                                                                                         | Default | Allowed Values  | Type                             |
| ---------------- | --------------------------------------------------------------------------------------------------- | ------- | --------------- | -------------------------------- |
| auto-play        | …                                                                                                   | false   | true, false     | Boolean                          |
| auto-play-speed  | …                                                                                                   | 1000    |                 | Integer                          |
| slides-to-scroll | …                                                                                                   | 1       |                 | Integer                          |
| slides-to-show   |                                                                                                     | 3       |                 | Integer                          |
| dots             | …                                                                                                   | show    | show, hide      | One of the allowed string values |
| speed            | …                                                                                                   | 500     |                 | Integer                          |
| height           | Enables adaptive height for single slide horizontal carousels.                                      | fixed   | fixed, adaptive | One of the allowed string values |
| arrows           | Prev/Next Arrows                                                                                    | show    | show, hide      | One of the allowed string values |
| append-dots      | Change where the navigation dots are attached (Selector, htmlString, Array, Element, jQuery object) |         |                 | CSS selector                     |
| infinite         | Infinite loop sliding                                                                               | false   | true, false     | Boolean                          |
