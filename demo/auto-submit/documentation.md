# Auto submit

## Description
Auto submit will submit what the user fills out on a form without the need for the user to press the submit button. It can be used to incrementally send form input data to a server. 

For instance to create a live search pattern where the search results update on every keypress. 

## Documentation
The autosubmit pattern submits a form if a form element changes. It is
enabled by class "pat-autosubmit" for individual form elements, on
grouping elements for all elements in the group, and on forms for all
elements of the form.

Only one element:

    <form>
      <input class="pat-autosubmit" type="text" name="q" placeholder="Search query"/>
    </form>

On a fieldset:

    <form>
      <fieldset class="pat-autosubmit">
       <input type="text" name="q" placeholder="Search query"/>
       <label><input type="checkbox" name="local"/> Only search in this section</label>
     </fieldset>
    </form>

And on the form:

    <form class="pat-autosubmit">
      <fieldset>
       <input type="text" name="q" placeholder="Search query"/>
       <label><input type="checkbox" name="local"/> Only search in this section</label>
     </fieldset>
    </form>

### What constitutes a change

While for a checkbox a change is clearly defined as uncheck/check, for
input fields there are more options.

Without configuration, a change will be detected 400ms after the last
keypress in an input field. Naturally, if two keypresses are more than
400ms apart, two submits will be triggered.

You can configure this behaviour with the delay option.

no delay:

    <form>
      <input name="q" class="pat-autosubmit" data-pat-autosubmit="delay: 0ms"/>
    </form>

longer delay:

    <form>
      <input name="q" class="pat-autosubmit" data-pat-autosubmit="delay: 1000ms"/>
    </form>

delay until element loses focus:

    <form>
      <input name="q" class="pat-autosubmit" data-pat-autosubmit="delay: defocus"/>
    </form>

### Combining with injection

Autosubmit is most useful when combined with injection. This makes it
trivial to create a form that automatically loads content and displays
it on the page. Here is a minimal search page:

    <form class="pat-inject pat-autosubmit" action="/search" data-pat-inject="target: #results">
      <input type="text" name="q" placeholder="Search query"/>
      <label><input type="checkbox" name="local"/> Only search in this section</label>
    </form>

    <section id="results">
      ... present search results here
    </section>

As soon as the user starts entering text in the search field or changes
the local-search toggle search requests will send to the server and the
results will be inserted into the existing page by replacing the content
of the *results* section.
