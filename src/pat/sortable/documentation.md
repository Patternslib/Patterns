## Description

This pattern allows you to change the order of appearance of a list by dragging and dropping the individual elements.

## Documentation

You can make lists sortable by adding a `pat-sortable` class to it.

Here is a simple example:

    <ol class="pat-sortable">
      <li id="one" >One</li>
      <li id="two">Two</li>
    </ol>

The sortable pattern automatically adds a drag handle

    <a href="#" class="sortable-handle"></a>

to each list element. The handle is the element that can be grabbed with
the pointer to initiate a drag and drop operation.

During a drag and drop operation the pattern will set the CSS class
`.dragged` on the list element that is currently being moved. It will
also indicate the current drop position by setting one of two different
CSS classes on exactly one list element:

1.  `.drop-target-above` indicates that the element being moved is going
    to be inserted above this list element.
2.  `.drop-target-below` indicates that the element being moved is going
    to be inserted below this list element.

### Using it in a form, so that changes can be submitted to the back end.

It's also possible to use **pat-sortable** inside a form with **pat-inject**, so
that the change in the ordering can be submitted to the server.

When using patterns, you should apply progressive enhancement, so that your
webpage will be accessible for people with disabilities and still be functional
for people without javascript.

So, in the example below, we start with a form for changing the order fo
elements and then put the "pat-sortable" class on it to make it dynamic
and to avoid page reloads.

We add a `button type="submit"` with values "up" and "down" which are used to
move an element up or down. We then also add a text input which specifies the
amount a sortable element is moved up or down.

It's up to the involved designers and developers to decide whether they want to
show or hide these elements to the user. For example, it might be preferable to
show the buttons, to provide accessibility to users with Parkinsons or similar
diseases.

#### Classes expected by pat-sortable when using it in a form

It's important that the "up" and "down" buttons have the class
`sortable-button-up` and `sortable-button-down` and that the input element has
the class `sortable-amount`. The sortable pattern will use these class names to
locate the particular elements, and without them the pattern won't work
properly.

    <form class="pat-inject" action="/src/pat/sortable/index.html" id="sortable-form"
            data-pat-inject="source: #sortable-form; target: #sortable-form">

        <ol class="pat-sortable" data-pat-sortable="selector: .sortable">
            <li class="sortable">
                Item 1
                <span class="button-cluster">
                    <!-- This classes "sortable-button-up" and "sortable-button-down" are required by pat-sortable in order to locate the buttons. -->
                    <button class="button sortable-button-up" type="submit" name="up_item_1" value="up" hidden>Up</button>
                    <button class="button sortable-button-down" type="submit" name="down_item_1" value="down" hidden>down</button>
                </span>
            </li>

            <li class="sortable">
                Item 2
                <span class="button-cluster">
                    <button class="button sortable-button-up" type="submit" name="up_item_2" value="up">Up</button>
                    <button class="button sortable-button-down" type="submit" name="down_item_2" value="down">down</button>
                </span>
            </li>

            <li class="sortable">
                Item 3
                <span class="button-cluster">
                    <button class="button sortable-button-up" type="submit" name="up_item_3" value="up">Up</button>
                    <button class="button sortable-button-down" type="submit" name="down_item_3" value="down">down</button>
                </span>
            </li>
        </ol>
        <!-- This element's class "sortable-amount" required by pat-sortable in order to locate it. -->
        <input type="hidden" name="amount" class="sortable-amount" value="1"/>
    </form>

### Option reference

| Property       | Type   | Default Value | Available values       | Description                                                                             |
| -------------- | ------ | ------------- | ---------------------- | --------------------------------------------------------------------------------------- |
| **selector**   | string | li            | Any valid CSS selector | This is the selector the pattern will use to determine which are the sortable elements. |
| **drag-class** | string | dragged       | Any valid CSS class    | A class name applied to the item being dragged.                                         |
| **drop**       | string |               | A Javascript function  | A Javascript callback function, called when the item is dropped.                        |
