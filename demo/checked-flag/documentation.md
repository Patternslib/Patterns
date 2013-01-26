# Documentation

You may want to form components differently depending on the state of
their checkbox or radio button. Patterns supports this by automatically
adding a `checked` or `unchecked` class to labels and fieldset to
reflect if they contain any checked checkbox or radio buttons.

    <fieldset class="condensed">
      <legend>Type of bread</legend>
      <label><input type="radio" name="radio"/> Brown</label>
      <label><input type="radio" name="radio" checked="checked"/> Wheat</label>
      <label><input type="radio" name="radio"/> White</label>
    </fieldset>

Patterns will modify this to look like this:

    <fieldset class="condensed checked">
      <legend>Type of bread</legend>
      <label class="unchecked"><input type="radio" name="radio"/> Brown</label>
      <label class="checked"><input type="radio" name="radio" checked="checked"/> Wheat</label>
      <label class="unchecked"><input type="radio" name="radio"/> White</label>
    </fieldset>

As you can see, the fieldset and both labels have gotten a new class
which matches the selection state of the radio button.