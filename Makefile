BOWER 		?= node_modules/.bin/bower
JSHINT 		?= node_modules/.bin/jshint
PEGJS		?= node_modules/.bin/pegjs
PHANTOMJS	?= node_modules/.bin/phantomjs
HTTPSERVE   ?= node_modules/.bin/http-server
SASS        ?= sass 

SOURCES		= $(wildcard src/*.js) $(wildcard src/pat/*.js) $(wildcard src/pat/calendar/*.js) $(wildcard src/lib/*.js)
BUNDLES		= bundles/patterns.js bundles/patterns.min.js

GENERATED	= src/lib/depends_parse.js

JSHINTEXCEPTIONS = $(GENERATED) \
		   src/lib/dependshandler.js \
		   src/lib/htmlparser.js \
		   src/pat/skeleton.js
CHECKSOURCES	= $(filter-out $(JSHINTEXCEPTIONS),$(SOURCES))
TESTSOURCES	= $(wildcard tests/specs/*/*.js)


all:: bundle.js

########################################################################
## Install dependencies

stamp-npm: package.json
	npm install
	touch stamp-npm

stamp-bower: stamp-npm bower.json
	$(BOWER) install
	touch stamp-bower

clean::
	rm -f stamp-npm stamp-bower
	rm -rf node_modules src/bower_components

########################################################################
## Tests

check:: jshint
jshint: stamp-npm
	$(JSHINT) --config jshintrc $(CHECKSOURCES)
	$(JSHINT) --config jshintrc-tests $(TESTSOURCES)


check:: stamp-npm
	$(PHANTOMJS) node_modules/phantom-jasmine/lib/run_jasmine_test.coffee tests.html


########################################################################
## Builds

bundle bundle.js: $(GENERATED) $(SOURCES) build.js stamp-bower
	node_modules/.bin/r.js -o build.js

src/lib/depends_parse.js: src/lib/depends_parse.pegjs stamp-npm
	$(PEGJS) $<
	sed -i~ -e '1s/.*/define(function() {/' -e '$$s/()//' $@ || rm -f $@

clean::
	rm -f bundle.js

css::
	$(SASS) docs/patterns/auto-scale/_auto-scale.scss > docs/patterns/auto-scale/_auto-scale.css
	$(SASS) docs/patterns/auto-submit/_auto-submit.scss > docs/patterns/auto-submit/_auto-submit.css
	$(SASS) docs/patterns/auto-suggest/_auto-suggest.scss > docs/patterns/auto-suggest/_auto-suggest.css
	$(SASS) docs/patterns/autofocus/_autofocus.scss > docs/patterns/autofocus/_autofocus.css
	$(SASS) docs/patterns/bumper/_bumper.scss > docs/patterns/bumper/_bumper.css
	$(SASS) docs/patterns/calendar/_calendar.scss > docs/patterns/calendar/_calendar.css
	$(SASS) docs/patterns/carousel/_carousel.scss > docs/patterns/carousel/_carousel.css
	$(SASS) docs/patterns/checked-flag/_checked-flag.scss > docs/patterns/checked-flag/_checked-flag.css
	$(SASS) docs/patterns/checklist/_checklist.scss > docs/patterns/checklist/_checklist.css
	$(SASS) docs/patterns/clone/_clone.scss > docs/patterns/clone/_clone.css
	$(SASS) docs/patterns/collapsible/_collapsible.scss > docs/patterns/collapsible/_collapsible.css
	$(SASS) docs/patterns/depends/_depends.scss > docs/patterns/depends/_depends.css
	$(SASS) docs/patterns/edit-tinymce/_edit-tinymce.scss > docs/patterns/edit-tinymce/_edit-tinymce.css
	$(SASS) docs/patterns/equaliser/_equaliser.scss > docs/patterns/equaliser/_equaliser.css
	$(SASS) docs/patterns/expandable-tree/_expandable-tree.scss > docs/patterns/expandable-tree/_expandable-tree.css
	$(SASS) docs/patterns/focus/_focus.scss > docs/patterns/focus/_focus.css
	$(SASS) docs/patterns/fontello/_fontello.scss > docs/patterns/fontello/_fontello.css
	$(SASS) docs/patterns/forward/_forward.scss > docs/patterns/forward/_forward.css
	$(SASS) docs/patterns/gallery/_gallery.scss > docs/patterns/gallery/_gallery.css
	$(SASS) docs/patterns/grid/_grid.scss > docs/patterns/grid/_grid.css
	$(SASS) docs/patterns/image-crop/_image-crop.scss > docs/patterns/image-crop/_image-crop.css
	$(SASS) docs/patterns/inject-history/_inject-history.scss > docs/patterns/inject-history/_inject-history.css
	$(SASS) docs/patterns/inject/_inject.scss > docs/patterns/inject/_inject.css
	$(SASS) docs/patterns/markdown/_markdown.scss > docs/patterns/markdown/_markdown.css
	$(SASS) docs/patterns/masonry/_masonry.scss > docs/patterns/masonry/_masonry.css
	$(SASS) docs/patterns/modal/_modal.scss > docs/patterns/modal/_modal.css
	$(SASS) docs/patterns/navigation/_navigation.scss > docs/patterns/navigation/_navigation.css
	$(SASS) docs/patterns/notification/_notification.scss > docs/patterns/notification/_notification.css
	$(SASS) docs/patterns/slides/_slides.scss > docs/patterns/slides/_slides.css
	$(SASS) docs/patterns/slideshow-builder/_slideshow-builder.scss > docs/patterns/slideshow-builder/_slideshow-builder.css
	$(SASS) docs/patterns/sortable/_sortable.scss > docs/patterns/sortable/_sortable.css
	$(SASS) docs/patterns/stacks/_stacks.scss > docs/patterns/stacks/_stacks.css
	$(SASS) docs/patterns/subform/_subform.scss > docs/patterns/subform/_subform.css
	$(SASS) docs/patterns/switch/_switch.scss > docs/patterns/switch/_switch.css
	$(SASS) docs/patterns/toggle/_toggle.scss > docs/patterns/toggle/_toggle.css
	$(SASS) docs/patterns/tooltip/_tooltip.scss > docs/patterns/tooltip/_tooltip.css
	$(SASS) docs/patterns/validate/_validate.scss > docs/patterns/validate/_validate.css
	$(SASS) docs/patterns/zoom/_zoom.scss > docs/patterns/zoom/_zoom.css



########################################################################

serve:: all
	printf "\n\n Designer, you can be happy now.\n Go to http://localhost:4001/demo/ to see the demo \n\n\n\n"
	$(HTTPSERVE) -p 4001

designerhappy:: serve

.PHONY: all bundle clean check jshint tests
