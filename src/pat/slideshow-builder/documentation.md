## Description

This patterns provides a simple method to create custom slideshows.

## Documentation

A user can generate slide shows by cherry picking stock slides from a form. This is desired in situations where you want to have stock slide shows where individual end users want to leave out specific slides based not he audience for the presentation. Or to create new slide shows out of individually stored stock slides.

A form that generates a slide show URL looks as follows:

    <form action="my-slides.html" class="pat-slideshow-builder">
        <button type="submit">Run</button>
    </form>

The pattern will inject a Checklist at the beginning of the form based on the IDs of the slides in the source HTML. The slide names come from the first header that is found in the slide HTML.

    <form action="my-slides.html" class="pat-slideshow-builder">
        <fieldset class="checklist">
            <label><input type="checkbox" name="slides" value="introduction" />Introduction</label>
            <label><input type="checkbox" name="slides" value="slide-1" />Slide 1</label>
            <label><input type="checkbox" name="slides" value="slide-2" />Slide 2</label>
            <label><input type="checkbox" name="slides" value="slide-3" />Slide 3</label>
            <label><input type="checkbox" name="slides" value="slide-4" />Slide 4</label>
        </fieldset>
        <button type="submit">Run</button>
    </form>

When the user clicks on the submit button, the slideshow is started with filters already applied in the URI based on the selection the user made.

## Customising the form

Since this pattern will only insert a fieldset into a form you can easily extend the form in several ways. For example you can also use the checklist pattern to give a convenient method to (de)select all slides:

    <form action="my-slides.html" class="pat-slideshow-builder pas-checklist">
        <div class="functions">
            <button class="select-all">Select all</button>
            <button class="deselect-all">Deselect all</button>
        </div>
        <button type="submit">Run</button>
    </form>

You can also put the `pat-slideshow-builder` class on another element inside the form to get the fieldset in a different position than the start of the form.

    <form action="my-slides.html">
        <fieldset>
            <legend>Section one</section>
            ...
        </fieldset>
        <fieldset class="pat-slideshow-builder">
        </fieldset>
            <legend>Section three</section>
            ...
        </fieldset>
        <button type="submit">Run</button>
    </form>

### Options reference

This pattern has no configurable properties.
