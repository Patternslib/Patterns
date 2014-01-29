JSHINT 		?= node_modules/.bin/jshint
PEGJS		?= node_modules/.bin/pegjs
PHANTOMJS	?= node_modules/.bin/phantomjs

SOURCES		= $(wildcard src/*.js) $(wildcard src/*/*.js)
BUNDLES		= bundles/patterns.js bundles/patterns.min.js
THIRDPARTY	= bungledeps $(shell find bungledeps -name '*.js' 2>/dev/null)

GENERATED	= src/lib/depends_parse.js

JSHINTEXCEPTIONS = $(GENERATED) \
		   src/lib/dependshandler.js \
		   src/lib/htmlparser.js \
		   src/pat/skeleton.js
CHECKSOURCES	= $(filter-out $(JSHINTEXCEPTIONS),$(SOURCES))


all:: bundle.js

########################################################################
## Install dependencies

stamp-npm: package.json
	npm install
	touch stamp-npm

stamp-bower: stamp-npm
	bower install
	touch stamp-bower

clean::
	rm -f stamp-npm stamp-bower
	rm -rf node_modules src/bower_components


########################################################################
## Tests

check:: jshint
jshint: stamp-npm
	$(JSHINT) --config jshintrc $(CHECKSOURCES)


check:: stamp-npm
	$(PHANTOMJS) node_modules/phantom-jasmine/lib/run_jasmine_test.coffee tests/TestRunner.html


########################################################################
## Bundle generation

bundle bundle.js: $(GENERATED) $(SOURCES) build.js stamp-bower
	node_modules/.bin/r.js -o build.js


src/lib/depends_parse.js: src/lib/depends_parse.pegjs stamp-npm
	$(PEGJS) $^
	sed -i~ -e '1s/.*/define(function() {/' -e '$$s/()//' $@ || rm -f $@


.PHONY: all bundle clean check jshint tests
