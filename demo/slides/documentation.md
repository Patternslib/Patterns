# Slides

## Description
With the slides pattern you may create PowerPoint-like slide shows with web standards.

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
			<div class="presenter-notes">
				<p>
				    Some notes
				</p>
			</div>
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
			<div class="presenter-notes">	
				<p>
				    Some notes
				</p>
			</div>
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
			<div class="presenter-notes">
				<p>
				    Some notes
				</p>				    
			</div>
		</div>
	</div>

What will happen is that `pat-slides` will trigger the slideshow pattern to bind the slideshow functions (such as key based hopping through slides) to the slides within the element that has `pat-slides` on it. 

Clicking on a slide will run the slide show from that slide on.

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

### Filters
It's possible to put a filter in the URI to show only specific slides. Consider the following URI format:

    <a href="my-slides.html?slides=first-slide,last-slide">Run</a>
    
Using the above URL, the the slideshow(s) on the page will only show slides in list view that match any of the IDs. Without any IDs, all slides will be shown. Also in full screen mode, the slides that are not in the URI will be skipped using the keystroke navigation. 