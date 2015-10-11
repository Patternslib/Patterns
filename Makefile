BOWER 		?= node_modules/.bin/bower
JSHINT 		?= node_modules/.bin/jshint
PEGJS		?= node_modules/.bin/pegjs
PHANTOMJS	?= node_modules/.bin/phantomjs
HTTPSERVE   ?= node_modules/.bin/http-server
BUNDLE      ?= ./.bundle/bin/bundle
SASS        ?= ./.bundle/bin/sass

SOURCES		= $(wildcard src/*.js) $(wildcard src/pat/*.js) $(wildcard src/pat/calendar/*.js) $(wildcard src/lib/*.js)
BUNDLES		= bundles/patterns.js bundles/patterns.min.js

GENERATED	= src/lib/depends_parse.js

TESTSOURCES	= $(wildcard tests/specs/*/*.js) \
			  $(wildcard src/pat/*/tests.js)
JSHINTEXCEPTIONS = $(GENERATED) \
		   src/lib/dependshandler.js \
		   src/lib/htmlparser.js \
		   src/pat/skeleton.js \
		   $(TESTSOURCES)
CHECKSOURCES	= $(filter-out $(JSHINTEXCEPTIONS),$(SOURCES))

all:: bundle.js css

########################################################################
## Install dependencies

stamp-npm: package.json
	npm install
	touch stamp-npm

stamp-bower: stamp-npm bower.json
	$(BOWER) install
	touch stamp-bower

stamp-bundler:
	mkdir -p .bundle
	gem install --user bundler --bindir .bundle/bin
	$(BUNDLE) install --path .bundle --binstubs .bundle/bin
	touch stamp-bundler

clean::
	rm -f stamp-npm stamp-bower
	rm -rf node_modules src/bower_components

########################################################################
## Tests

jshint: stamp-npm
	$(JSHINT) --config jshintrc $(CHECKSOURCES)
	$(JSHINT) --config jshintrc-tests $(TESTSOURCES)


.PHONY: check
check:: stamp-bower jshint
	$(PHANTOMJS) node_modules/phantom-jasmine/lib/run_jasmine_test.coffee tests.html


########################################################################
## Builds

build:: bundle all_css

bundle bundle.js: $(GENERATED) $(SOURCES) build.js stamp-bower
	node_modules/.bin/r.js -o build.js

src/lib/depends_parse.js: src/lib/depends_parse.pegjs stamp-npm
	$(PEGJS) $<
	sed -i~ -e '1s/.*/define(function() {/' -e '$$s/()//' $@ || rm -f $@

clean::
	rm -f bundle.js

all_css:: css
	@echo "Hang tight!"
	@$(SASS) src/pat/auto-scale/_auto-scale.scss src/pat/auto-scale/auto-scale.css
	@$(SASS) src/pat/auto-submit/_auto-submit.scss src/pat/auto-submit/auto-submit.css
	@$(SASS) src/pat/auto-suggest/_auto-suggest.scss src/pat/auto-suggest/auto-suggest.css
	@$(SASS) src/pat/autofocus/_autofocus.scss src/pat/autofocus/autofocus.css
	@$(SASS) src/pat/bumper/_bumper.scss src/pat/bumper/bumper.css
	@$(SASS) src/pat/calendar/_calendar.scss src/pat/calendar/calendar.css
	@$(SASS) src/pat/carousel/_carousel.scss src/pat/carousel/carousel.css
	@$(SASS) src/pat/checked-flag/_checked-flag.scss src/pat/checked-flag/checked-flag.css
	@$(SASS) src/pat/checklist/_checklist.scss src/pat/checklist/checklist.css
	@$(SASS) src/pat/clone/_clone.scss src/pat/clone/clone.css
	@$(SASS) src/pat/collapsible/_collapsible.scss src/pat/collapsible/collapsible.css
	@$(SASS) src/pat/date-picker/_date-picker.scss src/pat/date-picker/date-picker.css
	@$(SASS) src/pat/depends/_depends.scss src/pat/depends/depends.css
	@$(SASS) src/pat/edit-tinymce/_edit-tinymce.scss src/pat/edit-tinymce/edit-tinymce.css
	@$(SASS) src/pat/equaliser/_equaliser.scss src/pat/equaliser/equaliser.css
	@$(SASS) src/pat/expandable-tree/_expandable-tree.scss src/pat/expandable-tree/expandable-tree.css
	@$(SASS) src/pat/focus/_focus.scss src/pat/focus/focus.css
	@echo "Almost there, don't give up!"
	@$(SASS) src/pat/forward/_forward.scss src/pat/forward/forward.css
	@$(SASS) src/pat/gallery/_gallery.scss src/pat/gallery/gallery.css
	@$(SASS) src/pat/grid/_grid.scss src/pat/grid/grid.css
	@$(SASS) src/pat/image-crop/_image-crop.scss src/pat/image-crop/image-crop.css
	@$(SASS) src/pat/inject-history/_inject-history.scss src/pat/inject-history/inject-history.css
	@$(SASS) src/pat/inject/_inject.scss src/pat/inject/inject.css
	@$(SASS) src/pat/markdown/_markdown.scss src/pat/markdown/markdown.css
	@$(SASS) src/pat/masonry/_masonry.scss src/pat/masonry/masonry.css
	@$(SASS) src/pat/modal/_modal.scss src/pat/modal/modal.css
	@$(SASS) src/pat/navigation/_navigation.scss src/pat/navigation/navigation.css
	@$(SASS) src/pat/notification/_notification.scss src/pat/notification/notification.css
	@$(SASS) src/pat/slideshow-builder/_slideshow-builder.scss src/pat/slideshow-builder/slideshow-builder.css
	@$(SASS) src/pat/sortable/_sortable.scss src/pat/sortable/sortable.css
	@$(SASS) src/pat/stacks/_stacks.scss src/pat/stacks/stacks.css
	@$(SASS) src/pat/switch/_switch.scss src/pat/switch/switch.css
	@$(SASS) src/pat/toggle/_toggle.scss src/pat/toggle/toggle.css
	@$(SASS) src/pat/tooltip/_tooltip.scss src/pat/tooltip/tooltip.css
	@$(SASS) src/pat/validate/_validate.scss src/pat/validate/validate.css
	@$(SASS) src/pat/zoom/_zoom.scss src/pat/zoom/zoom.css
	@echo "Done. Each pattern now has a CSS file."

css:: stamp-bundler
	@$(SASS) -I style -I . _sass/_patterns.scss style/patterns.css

watch:: 
	$(SASS) --watch -I style -I . _sass/_patterns.scss:style/patterns.css

########################################################################

serve:: all
	@printf "\nDesigner, you can be happy now.\n Go to http://localhost:4001/demo/ to see the demo \n\n"
	@$(HTTPSERVE) -p 4001

designerhappy:: serve

.PHONY: all bundle clean jshint tests
