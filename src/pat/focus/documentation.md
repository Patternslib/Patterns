## Description

It is frequently useful to change the styling for labels or fieldsets if
they contain an input element that has the focus. Patterns facilitate
that by automatically adding a `focus` class.

## Documentation

It is frequently useful to change the styling for labels or fieldsets if
they contain an input element that has the focus. Patterns facilitate
that by automatically adding a `focus` class.

Let's look at a simple form:

    <form>
      <fieldset>
        <legend>Generic info</legend>
        <label>Title <input type="text" name="title"/></label>
        <label>Keywords <input type="text" name="keywords"/></label>
      </fieldset>

      <fieldset>
        <legend>Details</legend>
        ...
      </fieldset>
    </form>

If the focus changes to the keywords input Patterns will add the `focus`
class to the input element, its label and fieldset:

    <form>
      <fieldset class="focus">
        <legend>Generic info</legend>
        <label>Title <input type="text" name="title"/></label>
        <label class="focus">Keywords <input class="focus"type="text" name="keywords"/></label>
      </fieldset>

      <fieldset>
        <legend>Details</legend>
        ...
      </fieldset>
    </form>

It is not required to put the input element inside a label: labels will
automatically be scanned for relevant `for` attributes.

    <label for="title">Title</label>
    <input id="title" type="text" name="title"/>
