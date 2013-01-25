# Documentation

You can make lists sortable by adding a `pat-sortable` class to it.

Here is a simple example:

    <ul class="pat-sortable">
      <li id="one" >One</li>
      <li id="two">Two</li>
    </ul>

The sortable pattern automatically adds a drag handle

    <a href="#" class="handle"></a>

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