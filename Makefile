NPM 		?= npm
JAM 		?= node_modules/.bin/jam
UGLIFYJS 	?= node_modules/.bin/uglifyjs
GRUNT		?= grunt
PEGJS		?= pegjs
SOURCES		= $(wildcard src/*.js) $(wildcard src/*/*.js)
TARGETS		= bundles/patterns.js bundles/patterns.min.js

all:: check $(TARGETS)

bootstrap:
	mkdir -p bundles
	$(NPM) install jamjs uglify-js
	$(JAM) install

bundles/patterns.js: $(SOURCES)
	$(JAM) compile -i src/main --no-minify --almond $@

bundles/patterns.min.js: bundles/patterns.js
	$(UGLIFYJS) $# > $@

src/lib/depends_parse.js: src/lib/depends_parse.pegjs
	$(PEGJS) $^
	sed -i -e '1s/.*/define(function() {/' -e '$$s/()//' $@ || rm -f $@

all doc:: build/docs/index.html

build/docs/index.html: docs/conf.py $(wildcard docs/*.rst) $(wildcard docs/*/*.rst)
	sphinx-build -b html docs build/docs

demo/calender/calender.css: jam/fullcalender
	cp jam/fullcalender demo/calender/calender.css


JSHINTEXCEPTIONS = src/core/parser.js \
		   src/lib/depends_parse.js \
		   src/lib/dependshandler.js \
		   src/lib/dependshandler.js \
		   src/lib/htmlparser.js
CHECKSOURCES = $(filter-out $(JSHINTEXCEPTIONS),$(SOURCES))

check:
	@jshint --config jshintrc Gruntfile.js $(CHECKSOURCES)
	@jshint --config tests/jshintrc tests/*.js
	#$(GRUNT) test

clean:
	rm -f $(TARGETS)
	$(GRUNT) clean
	rm -rf build

localize-demo-images:
	tools/localize-demo-images.sh

.PHONY: all bootstrap check clean doc

