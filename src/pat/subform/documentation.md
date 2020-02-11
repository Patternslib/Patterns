# Subform

## Description

Subfrom allows parts of a form to be submitted to different destinations.

## Documentation

The subform pattern on a subset of controls in a form. It is enabled by class
"pat-subform" on grouping elements of the form.

The most basic example:

    <form action=... method=...>
      <input type="text" name="global" placeholder="Global control"/>
      <fieldset class="pat-subform">
        <input type="text" name="local" placeholder="Local control"/>
        <button type="submit" name="local-button">Local submit</button>
      </fieldset>
      <button type="submit" name="global-button">Global submit</button>
    </form>

Both buttons will submit the form with a page load to the action and method
specified on the form. The global button will submit the whole form, the local
button will only submit the contents within the subform.

The form and/or subform can have "pat-autosubmit" installed to submit their
respective form-data automatically upon input:

    <form action=... method=... class="pat-autosubmit">
      <input type="text" name="global" placeholder="Global control"/>
      <fieldset class="pat-subform pat-autosubmit">
        <input type="text" name="local" placeholder="Local control"/>
      </fieldset>
    </form>

In the above example both buttons were replaced by an automatic submission.
Instead of a page load parts of the form can be submitted by injection:

    <form action=... method=... class="pat-autosubmit pat-inject" data-pat-inject="...">
      <input type="text" name="global" placeholder="Global control"/>
      <fieldset class="pat-subform pat-autosubmit">
        <input type="text" name="local" placeholder="Local control"/>
      </fieldset>
    </form>

This would submit the form via an ajax call and inject the answer into the page.
The subform would still be submitted via a page load. This example can also be
reversed:

    <form action=... method=... class="pat-autosubmit">
      <input type="text" name="global" placeholder="Global control"/>
      <fieldset class="pat-subform pat-autosubmit pat-inject" data-pat-inject="...">
        <input type="text" name="local" placeholder="Local control"/>
      </fieldset>
    </form>

Now the contents of the subform are submitted via ajax while the form is send
via a page load. Of course also both form and subform can be submitted via
injection.

    <form action=... method=... class="pat-autosubmit pat-inject" data-pat-inject="...">
      <input type="text" name="global" placeholder="Global control"/>
      <fieldset class="pat-subform pat-autosubmit pat-inject" data-pat-inject="...">
        <input type="text" name="local" placeholder="Local control"/>
      </fieldset>
    </form>
