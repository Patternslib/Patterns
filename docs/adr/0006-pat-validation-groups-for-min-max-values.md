# 0006 pat-validation: Groups for min-values and max-values

Status: Accepted (2026-11-27)

## Context

We need to validate a minimum and maximum number of checked checkboxes, e.g.
"select at least one and at most three options". There is no native HTML
constraint for that. The `required` attribute only works for radio buttons as
a group.

pat-validation validates single inputs. For a minimum or maximum number of
values we need a group of inputs:

- to count the checked, selected or filled-out values,
- to set and clear the validation state on all members of the group,
- to place one error message for the whole group.

The first implementation defined the group by the inputs with the same name.
This does not cover groups of differently named checkboxes, e.g.
`newsletter`, `updates` and `events`.

The options can be defined on a wrapper element like a fieldset and are
inherited by the inputs. But the parser merges inherited options and loses the
information which element defined them, so the wrapper cannot be found via
the parsed options of an input.

## Decision

The `min-values` and `max-values` options define the group:

- The group root is the closest element - starting at the input and going up
  to and including the form - which itself defines `min-values` or
  `max-values`. Only the options defined directly on an element are taken into
  account (the parser is called without inheritance).
- If the input itself defines the options, the group consists of all inputs
  with the same name.
- If a wrapper element defines the options, the group consists of all inputs
  of the form within that wrapper, regardless of their names.
- If the form defines the options, the group consists of all inputs of the
  form, including inputs outside the form element.
- Without such a definition, the group consists of all inputs with the same
  name (e.g. radio buttons and checkboxes).

All members of a group share the same validation state. The error message is
placed after the last member of the group or after its label, if the input is
wrapped in a label.

Checkboxes and radio buttons count if checked, selects count their selected
options and all other inputs count if they have a value.

We did not introduce a separate option or pattern to define groups, so that
the group is defined where the constraint is defined.

## Consequences

- Groups of differently named inputs are supported by putting the options on
  a wrapper element.
- A wrapper element should only contain the inputs of the group. Every check
  of a group member re-evaluates and clears the state of the whole group, also
  for unrelated inputs within the wrapper.
- `min-values` and `max-values` should be defined on the same element. The
  values are read from the input with inheritance, so options split across
  nested elements would be combined while the group is defined by the inner
  element.
- Finding the group root parses the ancestors of an input each time the group
  is needed. This is acceptable for typical form sizes.
