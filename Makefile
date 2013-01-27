NPM 		?= npm
JAM 		?= node_modules/.bin/jam
JSHINT 		?= node_modules/.bin/jshint
UGLIFYJS 	?= node_modules/.bin/uglifyjs
GRUNT		?= node_modules/.bin/grunt
PEGJS		?= pegjs
SOURCES		= $(wildcard src/*.js) $(wildcard src/*/*.js)
TARGETS		= bundles/patterns.js bundles/patterns.min.js

all:: check $(TARGETS)

bootstrap:
	mkdir -p bundles
	$(NPM) install
	#$(JAM) install

bundles/patterns.js: $(SOURCES)
	$(JAM) compile -i main --no-minify --almond $@

bundles/patterns.min.js: bundles/patterns.js
	$(JAM) compile -i main --almond $@
	#$(UGLIFYJS) $< > $@

bundles: bundles/patterns.js bundles/patterns.min.js

src/lib/depends_parse.js: src/lib/depends_parse.pegjs
	$(PEGJS) $^
	sed -i -e '1s/.*/define(function() {/' -e '$$s/()//' $@ || rm -f $@

demo/calendar/fullcalendar.css: jam/jquery-fullcalendar/fullcalendar/fullcalendar.css
	cp jam/jquery-fullcalendar/fullcalendar/fullcalendar.css demo/calendar/fullcalendar.css


JSHINTEXCEPTIONS = src/core/parser.js \
		   src/lib/depends_parse.js \
		   src/lib/dependshandler.js \
		   src/lib/dependshandler.js \
		   src/lib/htmlparser.js
CHECKSOURCES = $(filter-out $(JSHINTEXCEPTIONS),$(SOURCES))

check:
	@$(JSHINT) --config jshintrc Gruntfile.js $(CHECKSOURCES)
	@$(JSHINT) --config tests/jshintrc tests/*.js
	$(GRUNT) test

clean:
	rm -f $(TARGETS)
	rm -rf build

localize-demo-images:
	tools/localize-demo-images.sh

.PHONY: all bootstrap check clean doc bundles
