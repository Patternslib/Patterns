# 0005 pat-validation: Event delegation on the document with focusout

Status: Accepted (2026-11-27)

## Context

pat-validation used to register `input`, `change` and `blur` event listeners on
each input of the form when the pattern was initialized, and re-registered them
on `pat-update` events.

This did not support:

- Dynamic forms, where inputs are added after initialization without a
  `pat-update` event.
- Inputs outside of the form element, which are associated with the form via
  the `form` attribute.

Event delegation needs bubbling events. `input` and `change` bubble, but `blur`
does not. `focusout` is the bubbling equivalent of `blur`.

Some patterns hide the original input and show a proxy widget instead, e.g.
pat-date-picker, pat-datetime-picker and pat-auto-suggest. They dispatch a
synthetic event on the original input to trigger the validation when the user
leaves the widget without making a choice. They used to dispatch a `blur`
event.

## Decision

- pat-validation registers one `input`, one `change` and one `focusout` event
  listener per pattern instance on the `document`.
- The handler only handles events whose target belongs to the form
  (`input.form === this.form`) and is one of the form's inputs.
- The list of inputs is not cached but computed from `form.elements` when
  needed, so that inputs added later and inputs outside the form are included.
- The validation is debounced per input, so that multiple inputs can be
  validated in parallel.
- The event listeners are registered with the instance scoped
  `BasePattern.add_event_listener` (see ADR 0004) and are removed by
  `BasePattern.destroy`.
- Patterns which want to trigger the validation of an input dispatch a
  bubbling `focusout` event (`events.focusout_event()`) on that input, not a
  `blur` event. pat-date-picker, pat-datetime-picker and pat-auto-suggest were
  changed accordingly.

## Consequences

- Dynamic forms and inputs outside the form are supported without
  re-initialization.
- A synthetic `blur` event does not trigger the validation anymore. Third
  party code and patterns which dispatch `blur` to trigger the validation must
  dispatch `focusout` instead.
- Every `input`, `change` and `focusout` event in the document passes the
  filter of every pat-validation instance. The filter is cheap.
- The pattern is destroyed automatically when the form is removed from the
  DOM (see ADR 0001), which also removes the listeners from the document.
- The inputs do not get event listeners of their own. Re-initializing the
  inputs on `pat-update` is not needed anymore.
