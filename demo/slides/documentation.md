# Slides

## Description
With the slides pattern you can create PowerPoint-like slide shows with web standards.

## Documentation
### Running slide shows
Slide shows my be run **standalone** on a page or **injected** as part of a page or as a **composed injection**.

#### Standalone rendering
Consider the following markup:

	<div class="pat-slides">	
		<div class="slide" id="first-slide">
			<div class="slide-content">
				<section>
					<header>
						<h2>My beautiful slide</h2>
					</header>
					<img src="../../Media/illustrations/abdelaziz.jpg" />
				</section>
			</div>
			<footer>
				<p>
				    Some notes
				</p>
			</footer>
		</div>
		
		<div class="slide" id="second-slide">
			<div class="slide-content">
				<section>
					<header>
						<h2>Another slide</h2>
					</header>
					…
				</section>
			</div>
			<footer>
				<p>
				    Some notes
				</p>
			</footer>
		</div>
							
		<div class="slide" id="third-slide">
			<div class="slide-content">
				<section>
					<header>
						<h2>Final slide</h2>
					</header>
                …	
				</section>
			</div>
			<footer>
				<p>
				    Some notes
				</p>				    
			</footer>
		</div>
	</div>

What will happen is that `pat-slides` will trigger the slideshow pattern to bind the slideshow functions (such as key based hopping through slides) to the slides within the element that has `pat-slides` on it. 

Clicking on a slide will run the slide show from that slide on.

### Filters
It's possible to put a filter in the URI to show only specific slides. Consider the following URI format:

    <a href="my-slides.html?slides=first-slide,last-slide">Run</a>
    
Using the above URL, the the slideshow(s) on the page will only show slides in list view that match any of the IDs. Without any IDs, all slides will be shown. Also in full screen mode, the slides that are not in the URI will be skipped using the keystroke navigation. 

#### Injected slideshows
The injection pattern may be used to launch slideshows on a page as part of another design. When a user clicks on a slide, it will still run full window, but the list view will be integrated in the rest of the design. 

The injection pattern may be used as follows:

    <a href="my-slides.html?slides=first-slide,last-slide" class="pat-inject" data-pat-inject="target: self::element; trigger: autoload">Run</a>            
    
The source markup contains in this case the same markup structure as in the standalone rendering example and will therefor execute itself in the same fashion 

#### Composed injection
Composed injection allows for composing a slide show out of different HTML source files or a combination of standalone slides and slides out of an other HTML file. 

The example below would extract one slide (`third-slide`) from my-slides.html and combine it with a slide that is in the HTML file itself. 

	<div class="pat-slides">		
	   <a href="my-slides.html#third-slide" class="pat-inject" data-pat-inject="target: self::element; trigger: autoload">Run</a>
		<div class="slide" id="first-slide">
			<div class="slide-content">
				<section>
					<header>
						<h2>My beautiful slide</h2>
					</header>
					<img src="../../Media/illustrations/abdelaziz.jpg" />
				</section>
			</div>
			<div class="presenter-notes">
				<p>
				    Some notes
				</p>
			</div>
		</div>
	</div>

### Generated slideshows
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
    
