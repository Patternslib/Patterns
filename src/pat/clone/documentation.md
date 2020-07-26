## Description

The clone pattern lets the website user clone elements in the page.

## Documentation

The clone pattern is typically used in case you want to create a form on which it is unknown how many instances the user will need of a certain field or group of fields.
For instance if you want to ask the user to fill out the name and birthdate of each family member.

### Usage

This pattern is enabled by adding the `pat-clone` class on a container element which contains the original element and any clones of it that may have beeen added.
The first element inside the .pat-clone container is by default assumed to be the original element may be cloned by the user.

Consider the following markup:

    <h3>List of family members</h3>

    <div class="pat-clone">
      <!-- The first element inside the .pat-clone container is by default
           assumed to be the original element which will be cloned.
        -->
      <fieldset class="clone"> <!-- By default, pat-clone will consider elements with the "clone" class to be clones. -->
        <legend>Family member 1</legend>
        <input name="name-1" type="text" placeholder="Name" />
        <input name="date-1" type="date" placeholder="birthdate" /><br/>
        <button type="button" class="remove-clone">Remove</button>
      </fieldset>
      <!-- Now comes the clone trigger, a button which when clicked will cause
           a new clone of the above fieldset to be created.
        -->
      <button type="button" class="add-clone">Add an extra family member</button>
    </div>

Each time the user clicks on the button saying 'Add an extra family member', the
pattern will make a copy of the first element inside the
`.pat-clone` element, unless the `template` property is used to configure a
different clone template. The `template` property takes a CSS selector as
value.

Typically when using a template element, such an element would be hidden from view.

The new clone is always appended at the end, inside the `.pat-clone` element.

When creating a `.pat-clone` element containing existing clones, it's
important that each existing clone either gets the `clone` CSS class or that you
pass in a unique CSS selector for each clone via the `clone-element`
property. This allows the pattern to properly determine how many existing
clones there are to start with.

#### Incrementation of values in clones

The pat-clone pattern will automatically add up any number in the values of name and value attributes.
For instance, if you have `name="item-1"` in your markup, then the first clone will be
`name="item-2"` and the one after that `name="item-3"` etc.. If you want to print a number
— for instance in a header of each clone — then you can use the syntax: `#{1}`. This string
will be replaced by an number that's also increased by 1 for each clone.

### Example with a hidden template

The markup below would have exactly the same effect as the first example, but using a hidden template. This might come in handy when the first instance shown should either contain different information, or if it will have pre-filled values by the server.

    <h3>List of family members</h3>

    <div class="pat-clone" data-pat-clone="template: #my-template">
      <!-- First visible instance and also template -->
      <fieldset class="clone">
        <legend>Family member 1</legend>
        <input name="Mary Johnson" type="text" placeholder="Name" />
        <input name="1977-04-16" type="date" placeholder="birthdate" /><br/>
        <button type="button" class="remove-clone">Remove</button>
      </fieldset>

      <!-- Template markup -->
      <fieldset id="my-template" hidden>
        <legend>Family member #{1}</legend>
        <input name="name-1" type="text" placeholder="Name" />
        <input name="date-1" type="date" placeholder="birthdate" /><br/>
        <button type="button" class="remove-clone">Remove</button>
      </fieldset>

      <!-- Clone trigger -->
      <button type="button" class="add-clone">Add an extra family member</button>
    </div>

### Option reference

| Property                            | Description                                                                                                                                                                | Default       | Allowed Values    | Type                              |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ----------------- | --------------------------------- |
| template                            | Selects the element that will be cloned each time. You might often want to refer to a piece of template markup for this that is hidden with though the CSS.                | :first        |                   | CSS Selector                      |
| max                                 | Maximum number of clones that is allowed                                                                                                                                   |               |                   | Integer                           |
| trigger-element                     | Selector of the element that will add the clone when clicked upon.                                                                                                         | .add-clone    |                   | CSS Selector                      |
| remove-element                      | Selector of the element that will remove the clone when clicked upon.                                                                                                      | .remove-clone |                   | CSS Selector                      |
| remove-behaviour or remove-behavior | What should happen when the user clicks on the element to remove a clone? Two choices exist currently. Show a confirmation dialog, or simply remove the clone immediately. | "confirm"     | "confirm", "none" | One of the allowed string values. |
| clone-element                       | Selector of the individual clone element(s).                                                                                                                               | .clone        |                   | CSS Selector                      |
