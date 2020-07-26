## Description

The _depends_ pattern makes it possible to make visibility of content conditional on form data.

## Documentation

The _depends_ pattern makes it possible to make visibility of content
conditional on form data. A common use case is to only show parts of a
form when relevant. Here is an example from a hypothetical pizza order
form:

    <form>
      <label><input type="checkbox" name="custom"/> Add extra toppings</label>

      <fieldset class="pat-depends" data-pat-depends="custom">
        <legend>Extra toppings</legend>
        <label><input type="checkbox" name="pineapple"/> Pineapple</label>
        <label><input type="checkbox" name="gorgonzola"/> Gorgonzola</label>
        <label><input type="checkbox" name="peanuts"/> Peanuts</label>
        <label><input type="checkbox" name="redonion"/> Red onions</label>
      </fieldset>
    </form>

In this example the fieldset with options for extra toppings is only
shown when the user indicates he wants to add extra toppings.

Another common use case is filtering a list based on some options:

    <label><input type="checkbox" name="paid"/> Show paid invoices</label>
    <label><input type="checkbox" name="draft"/> Show draft invoices</label>
    <label><input type="checkbox" name="overdue" checked="checked"/> Show overdue invoices</label>

    <ul>
      <li class="pat-depends" data-pat-depends="paid">A paid invoice</li>
      <li class="pat-depends" data-pat-depends="paid">Another paid invoice</li>
      <li class="pat-depends" data-pat-depends="overdue">An overdue invoice</li>
      <li class="pat-depends" data-pat-depends="draft">A draft invoice</li>
      …
    </ul>

### Dependency expressions

Dependencies are specified via _dependency expression_. These are
expressions that specify when an item should be visible or not.

The simplest form of a dependency expression is `<input name>` which
indicates that an input element with the given name (or id) must have a
value (if it is a checkbox must be checked). You can also test for a
specific value:

- `<input name> = <value>`: indicates that an input element must have a
  specific value. This is most useful when used to check which radio
  button is checked.
- `<input name> != <value>`: indicates that an input element must not
  have a specific value. This is most useful when used to check if a
  specific radio button is not checked.
- `<input name> <= <value>`: indicates that an input element must have
  a value less than or equal than the given value. This is most useful
  for number and range inputs.
- `<input name> < <value>`: indicates that an input element must have
  a value less than the given value. This is most useful for number
  and range inputs. inputs.
- `<input name> > <value>`: indicates that an input element must have
  a value greater than the given value. This is most useful for number
  and range inputs. inputs.
- `<input name> >= <value>`: indicates that an input element must have
  a value greater than or equal than the given value. This is most
  useful for number and range inputs.
- `<input name> ~= <value>`: check if the value is a substring of the
  current value of the input.

You can also revert a test by putting the `not` keyword in front of it.
Here are some examples:

    <input type="checkbox" name="hidden"/>

    <p class="pat-depends" data-pat-depends="condition: hidden">
        Hidden items will be included.
    </p>

    <p class="pat-depends" data-pat-depends="condition: not hidden">
        Not showing hidden items.
    </p>

    <input type="range" name="price" value="50"/>

    <p class="pat-depends" data-pat-depends="price<100">
        Showing cheap options.
    </p>

You can also combine multiple tests using `and` and `or`, optionally
using parenthesis to specify the desired grouping. Here is a more
complex example which demonstrates the use of `and`:

    <fieldset>
      <legend>Select your flavour</legend>
      <label><input type="radio" name="flavour" value="hawaii"/> Hawaii</label>
      <label><input type="radio" name="flavour" value="meat"/> Meat fest </label>
      <label><input type="radio" name="flavour" value="veg"/> Vegeration </label>
      <label><input type="checkbox" name="custom"/> Add extra ingredients</label>
    </fieldset>

    <fieldset class="pat-depends" data-pat-depends="custom">
      <legend>Select custom ingredients</legend>
      <label><input type="checkbox" name="cheese"/> Extra cheese</label>
      <label><input type="checkbox" name="bacon"/> Bacon</label>
    </fieldset>

    <em class="warning pat-depends"
        data-pat-depends="condition:flavour=veg and custom and bacon">
      Adding bacon means your pizza is no longer vegetarian!</em>

This pizza menu will show a warning if the user selects a vegetarian
pizza but then also adds extra bacon to it.

### Actions

Two types of actions can be taken by the pattern: changing visibility
and disabling elements. The action can be specified using the `action`
property.

    <button data-pat-depends="title enable">Submit</button>

This example shows a submit button which is disabled if the title input
has no value.

The available actions are:

- `show`: make an item's visibility conditional, based on the
  dependencies. If the dependencies are not met the item will
  be made invisible. In addition a CSS class of `hidden` or
  `visible` will be set.
- `enable`: disables items and adds a `disabled` class if the
  dependencies are not met. Input elements are disabled by setting
  their disabled property. Links are disabled by registered a
  temporary event handler that blocks their default behaviour.
- `both`: both the `enable` and `show` actions will be applied. Conversely, an
  element will be both hidden and disabled when the condition is not met.

### Transitions

When hiding or showing items you can specify a transition effect to be
used. The default behaviour is to not use any transition and immediately
hide or show the element by toggling its `display` style. If you prefer
to control the effect completely with CSS you can use the `css`
transition.

    <style>
      .pat-depends {
          transition-property: opacity;
          transition-duration: 1s;
      }
      .visible {
          opacity: 1;
      }

      .hidden {
          opacity: 0;
      }
    </style>

    <fieldset class="pat-depends" data-pat-depends="condition:custom; transition: css">
      <legend>Select custom ingredients</legend>
      <label><input type="checkbox" name="cheese"/> Extra cheese</label>
      <label><input type="checkbox" name="bacon"/> Bacon</label>
    </fieldset>

This allow full control in CSS, including the use of animation for
browsers supporting CSS animation. Two non-CSS based animation options
are also included: `fade` will fade the element in and out, and `slide`
uses a vertical sliding effect. During a transition an `in-progress`
class will be set on the element.

### Option reference

The depends can be configured through a `data-pat-depends` attribute.
The available options are:

| Field             | Default | Description                                                                                                                                                |
| ----------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `condition`       |         | The dependency condition.                                                                                                                                  |
| `action`          | `show`  | Action to perform. One of `show`, `enable` or `both`.                                                                                                      |
| `transition`      | `show`  | Transition effect to use if the action is `show`. Must be one of `none`, `css`, `fade` or `slide`.                                                         |
| `effect-duration` | `fast`  | Duration of transition. This is ignored if the transition is `none` or `css`.                                                                              |
| `effect-easing`   | `swing` | Easing to use for the transition. This must be a known jQuery easing method. jQuery includes `swing` and `linear`, but more can be included via jQuery UI. |
