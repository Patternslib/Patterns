## Description

The EPUB pattern renders books in the EBOOK format so that users may read them before or instead of downloading them.

## Documentation

The EPUB pattern is triggered by the class pat-epub which may be placed on a hyperlink that points to an ebook. The download link will be repalced by a render of the book.

The href value points to the location of the epub file.

Pat-epub is not compatible with other e-book formats or with EPUB books that have DRM on it.

Pat-epub uses EPUB.js from [FuturePress](http://futurepress.org).

## Option reference

| Property | Default value | Values   | Description |
| -------- | ------------- | -------- | ----------- |
| `width` | `100%` | A numeric value in % or px | The width of the book may set with with this property. Example: `width: 100%` or `width: 400px`. |
| `height` | `400px` | A numeric value in % or px | The height of the book may set with with this property. Example: `height: 60%` or `height: 400px`. |
| `flow` | `paginated` | `single`, `double`, `scroll` | The option to choose between a single page view, a double page view or a scrolling document. |
| `toc` |  | CSS selector | The CSS selector of the element that should be replaced by a select element that allows for jumping to a certain topic. |
| `next` |  | CSS selector | The CSS selector of the element that should act as the next page button. |
| `previous` |  | CSS selector | The CSS selector of the element that should act as the pevious page button. |

