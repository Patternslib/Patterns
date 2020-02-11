## Description

The auto-submit pattern will automatically submit a form whenever the user changes a value of any input inside of it.
It can be used to incrementally send form input data to a server, for instance to create a live search pattern where the search results update on every keypress.

## Documentation

The auto-submit pattern submits a form whenever a value inside that form changes.

It is enabled by adding the `pat-auto-submit` CSS class to the form element.

Alternatively, you can also add `pat-auto-submit` to inputs or containers of inputs inside the form,
to only let changes to those particular inputs automatically submit the form.

This pattern plays nicely with `pat-subform`, which means that if an element changes inside a subform, only that subform will be submitted.

## Examples

On only one element:

    <form>
      <input class="pat-auto-submit" type="text" name="q" placeholder="Search query"/>
    </form>

On a fieldset:

    <form>
      <fieldset class="pat-auto-submit">
       <input type="text" name="q" placeholder="Search query"/>
       <label><input type="checkbox" name="local"/> Only search in this section</label>
     </fieldset>
    </form>

And on the whole form:

    <form class="pat-auto-submit">
      <fieldset>
       <input type="text" name="q" placeholder="Search query"/>
       <label><input type="checkbox" name="local"/> Only search in this section</label>
     </fieldset>
    </form>

### What constitutes a change?

While for a checkbox a change is clearly defined as uncheck/check, for
input fields there are more options.

Without configuration, a change will be detected 400ms after the last
keypress in an input field. Naturally, if two keypresses are more than
400ms apart, two submits will be triggered.

You can configure this behaviour with the delay option.

no delay:

    <form>
      <input name="q" class="pat-auto-submit" data-pat-auto-submit="delay: 0ms"/>
    </form>

longer delay:

    <form>
      <input name="q" class="pat-auto-submit" data-pat-auto-submit="delay: 1000ms"/>
    </form>

delay until element loses focus:

    <form>
      <input name="q" class="pat-auto-submit" data-pat-auto-submit="delay: defocus"/>
    </form>

### Combining with injection

The auto-submit pattern is most useful when combined with injection. This makes it
trivial to create a form that automatically loads content and displays
it on the page. Here is a minimal search page:

    <form class="pat-inject pat-auto-submit" action="/search" data-pat-inject="target: #results">
      <input type="text" name="q" placeholder="Search query"/>
      <label><input type="checkbox" name="local"/> Only search in this section</label>
    </form>

    <section id="results">
      ... present search results here
    </section>

As soon as the user starts entering text in the search field or changes
the local-search toggle search requests will send to the server and the
results will be inserted into the existing page by replacing the content
of the _results_ section.

### Option reference

| Property  | Type             | Default Value | Available values                  | Description                                                                                                                                                                                                    |
| --------- | ---------------- | ------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **delay** | string or number | 400           | A milliseconds value or "defocus" | The amount of milliseconds to wait until submitting the form. "Defocus" only applies when pat-auto-submit is applied to input elements and means that the form will be submitted when the element loses focus. |
