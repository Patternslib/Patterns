BOWER 		?= node_modules/.bin/bower
JSHINT 		?= node_modules/.bin/jshint
PEGJS		?= node_modules/.bin/pegjs
PHANTOMJS	?= node_modules/.bin/phantomjs

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

check:: jshint test-bundle
jshint: stamp-npm
	$(JSHINT) --config jshintrc $(CHECKSOURCES)
	$(JSHINT) --config jshintrc-tests $(TESTSOURCES)


check:: stamp-npm
	$(PHANTOMJS) node_modules/phantom-jasmine/lib/run_jasmine_test.coffee tests/TestRunner.html


########################################################################
## Bundle generation

bundle bundle.js: $(GENERATED) $(SOURCES) build.js stamp-bower
	node_modules/.bin/r.js -o build.js

test-bundle test-bundle.js: $(GENERATED) $(SOURCES) test-build.js stamp-bower
	node_modules/.bin/r.js -o test-build.js


src/lib/depends_parse.js: src/lib/depends_parse.pegjs stamp-npm
	$(PEGJS) $<
	sed -i~ -e '1s/.*/define(function() {/' -e '$$s/()//' $@ || rm -f $@

clean::
	rm -f bundle.js


.PHONY: all bundle clean check jshint tests
