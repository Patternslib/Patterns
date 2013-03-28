# Slideshow builder

## Description
This patterns provided a simple method to create custom slideshows.

## Documentation

A user can generate slide shows by cherry picking stock slides from a form. This is desired in situations where you want to have stock slide shows where individual end users want to leave out specific slides based not he audience for the presentation. Or to create new slide shows out of individually stored stock slides. 

A form that generates a slide show URL looks as follows:

    <form action="my-slides.html" class="pat-slideshow-builder">
        <button type="submit">Run</button>
    </form>

The pattern will inject a Checklist into the form based on the IDs of the slides in the source HTML. The slide names come from the first header that is found in the slide HTML.

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
    
