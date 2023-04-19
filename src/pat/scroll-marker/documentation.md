# pat-scroll-marker

## Description

Marks navigation items and content with CSS classes if they are scrolled to and in view.


## Documentation

For hash-urls in a navigation structure with a corresponding content item, the
link and the content item are marked with configurable CSS classes when the
content item is in view or the current one.

For the pattern to work you need a navigation structure with hash-urls.
Only urls starting with a `#` sign are included in pat-scroll-marker.

There are different calculation strategies to determine the current content
item, explained in the options reference below.

Here is a complete example:

  <nav class="pat-navigation"
      data-pat-navigation="
        scroll-marker-visibility: most-visible;
        scroll-marker-distance: 100%;
        scroll-marker-side: auto;
      ">
    <a href="#id1">link 1</a>
    <a href="#id2">link 2</a>
    <a href="#id3">link 3</a>
  </nav>

  <section id="id1">
    <h3>1</h3>
    <p>text1</p>
  </section>

  <section id="id1">
    <h3>1</h3>
    <p>text1</p>
  </section>

  <section id="id1">
    <h3>1</h3>
    <p>text1</p>
  </section>


### Options reference

| Property              | Default        | Options                                  | Description                   |
| --------------------- | -------------- | ---------------------------------------- | ----------------------------- |
| current-class         | `current`      | CSS class name                           | CSS class for a navigation item when it's corresponding content item is the current one. |
| current-content-class | `current`      | CSS class name                           | CSS class for a content item when it is the current one. |
| in-view-class         | `in-view`      | CSS class name                           | CSS class for a navigation item when it's corresponding content item is in view. |
| side                  | `top`          | `top`, `bottom`, `middle`, `auto`        | Side of element that scrolls. This is used to calculate the current item. The defined side of the element will be used to calculate the distance baseline. If this is set to "auto" then one of the "top" or "bottom" positions are used, depending on which one is nearer to the distance baseline. |
| distance              | `50%`          | CSS length (px, %, vw, vh, vmin or vmax) | Distance from side of scroll box. any amount in px, %, vw, vh, vmin or vmax. This is used to calculate the current item. The nearest element to the distance-baseline measured from the top of the container will get the current class. |
| visibility            |                | `none`, `most-visible`                   | Visibility of element in scroll box. This is used to calculate the current item. If "most-visible" is set, the element which is most visible in the scroll container gets the current class. If more elements have the same visibility ratio, the other conditions are used to calculate the current one. |

