# 0007 Restrict dynamic import contexts with webpackInclude

Status: Accepted (2026-11-28)

## Context

Dynamic imports with a template literal, like
``import(`moment/locale/${lang}.js`)``, make Webpack create a context module.
Every file which could match becomes its own chunk, and:

- A lookup map of all matching files is put into the chunk of the importing
  module. For Patterns this is the eagerly loaded patterns chunk.
- Every chunk gets an entry in the chunk filename map of the Webpack runtime,
  which is part of the entry points `bundle.min.js` and `remote.min.js`.
  Webpack lists all async chunks reachable from the entry there, no matter how
  deeply nested the dynamic import is.

Moving such an import into a lazily loaded `--implementation` module only
moves the lookup map out of the patterns chunk. The runtime chunk filename map
in the entry points stays the same. This was verified with a build.

Four imports caused 766 of the 832 entries in the runtime chunk filename map:

- pat-syntax-highlight: highlight.js languages (193) and themes (258,
  including the `base16/` subdirectory).
- pat-calendar: fullcalendar locales (156, including the `*.global.js`
  duplicates).
- pat-display-time: moment locales (139).

pat-calendar and pat-display-time cut the language to 2 letters, so locales
like `zh-tw` or `ar-dz` can never be requested.

pat-syntax-highlight restricts the `theme` option to `dark` and `light`, which
map to the `stackoverflow-*` themes. Other themes can only be passed as
options from JavaScript.

## Decision

Restrict the matching files with `webpackInclude`:

- pat-calendar and pat-display-time: Only 2-letter locales.
- pat-syntax-highlight themes: Only top-level themes, no `base16/` themes.
- pat-syntax-highlight languages: Only the languages of the highlight.js
  "common" build (`highlight.js/lib/common.js`).

`webpackInclude` is matched against the absolute file path, so the regular
expressions are anchored to the directory name and not to `./`.

## Consequences

Production build:

| | before | after |
|---|---|---|
| `bundle.min.js` | 126,967 B | 112,662 B |
| `remote.min.js` | 126,087 B | 111,784 B |
| runtime chunk filename map entries | 832 | 352 |
| eager patterns chunk | 223,222 B | 201,108 B |
| chunk files | 1660 | 700 |

- pat-calendar and pat-display-time behave the same as before.
- pat-syntax-highlight: Languages outside the common set are no longer
  available. They fall back to `highlightAuto`, which only knows already
  registered languages, so they are mostly not highlighted. Languages can be
  added to the `webpackInclude` list when needed.
- pat-syntax-highlight: `base16/` themes can no longer be passed from
  JavaScript.
- New template literal dynamic imports should get a `webpackInclude` filter
  too.
