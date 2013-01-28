We need a further separation of layers:

1. markup that triggers patterns

2. code that reads options from DOM elements and calls library functions

3. library functions that have no clue that their options came from
   DOM elements

By that the library function can easily be used by other patterns if
they need them, e.g. collapsible can do injection on open.

In here code be 1. and ../lib could contain the libraries. Currently
there are also external libraries which should be in ../../lib.
