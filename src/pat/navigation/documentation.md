## Description

Marks navigation paths with "in-path" and "current" classes.


## Documentation

When clicking on a navigation item this one will always get the `current-class`.
When loading a page and the browser's url matches a navigation item's href value, this one will get the `current-class`.
Any navigation items in it's path will get the `in-path-class`.

### scroll-marker functionality

When a content items with an id which matches a hash-url in the navigation are scrolled into view then the corresponding navigation items will get the `in-view-class`.
One matching navigation item will get the `current-class` and the corresponding content item will get the `current-content-class`, depending on the algorithm in use as described in the [pat-scroll-marker documentation](../scroll-marker/documentation.md).
The default is that the content item in view, which top position is neares to the middle of the scrolling container will be the current item.

### Automatic loading of items

You can automatically load the navigation item marked with the `current` class by adding the class `navigation-load-current` along with `pat-navigation` on the pattern element.
This would invoke a `click` event on the current navigation item and that can be used to load content via `pat-inject`.


### Option reference

The navigation pattern can be configured through a `data-pat-navigation` attribute.
The available options are:

| Field                   | Default                      | Options                                  | Description             |
| ----------------------- | ---------------------------- | ---------------------------------------- | ----------------------- |
| item-wrapper            | `li`                         | CSS selector                             | The DOM element which wraps each menu item. This is used to set the "current" and "in-path" classes also on the wrapper element. If empty, no wrapper element is used. |
| in-path-class           | `navigation-in-path`         | CSS class name                           | Class name, which is set on item-wrapper elements if nested menu items are within the current path. |
| current-class           | `current`                    | CSS class name                           | Class name, which is set on item-wrapper or items if they are the currently selected menu option or - for hash links - when it's corresponding content item is in view. |
| current-content-class   | `current`                    | CSS class name                           | CSS class for a content item when it is the current one. |
| in-view-class           | `in-view`                    | CSS class name                           | CSS class for a navigation item when it's corresponding content item is in view. |
| scrill-item-side        | `top`                        | `top`, `bottom`, `middle`, `auto`        | Side of element that scrolls. This is used to calculate the current item. The defined side of the element will be used to calculate the distance baseline. If this is set to "auto" then one of the "top" or "bottom" positions are used, depending on which one is nearer to the distance baseline. |
| scrill-item-distance    | `50%`                        | CSS length (px, %, vw, vh, vmin or vmax) | Distance from side of scroll box. any amount in px, %, vw, vh, vmin or vmax. This is used to calculate the current item. The nearest element to the distance-baseline measured from the top of the container will get the current class. |
| scrill-item-visibility  |                              | `none`, `most-visible`                   | Visibility of element in scroll box. This is used to calculate the current item. If "most-visible" is set, the element which is most visible in the scroll container gets the current class. If more elements have the same visibility ratio, the other conditions are used to calculate the current one. |
| scroll-trigger-selector | `a[href^='#'].scroll-trigger` | CSS selector, `none`                     | Selects the element within the pat-navigation container that should get a class current while scrolling, when applicable. |

