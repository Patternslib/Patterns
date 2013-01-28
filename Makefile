NPM 		?= npm
JAM 		?= node_modules/.bin/jam
JSHINT 		?= node_modules/.bin/jshint
UGLIFYJS 	?= node_modules/.bin/uglifyjs
GRUNT		?= node_modules/.bin/grunt
PEGJS		?= pegjs
SOURCES		= $(wildcard src/*.js) $(wildcard src/*/*.js)
3RDPARTY	= $(shell find jam -name '*.js')
TARGETS		= bundles/patterns.js bundles/patterns.min.js

all:: check $(TARGETS)

bootstrap:
	mkdir -p bundles
	$(NPM) install
	#$(JAM) install

bundles/patterns.js: $(SOURCES) $(3RDPARTY)
	$(JAM) compile -i main --no-minify --almond $@

bundles/patterns.min.js: bundles/patterns.js
	$(JAM) compile -i main --almond $@
	#$(UGLIFYJS) $< > $@

bundles: bundles/patterns.js bundles/patterns.min.js

use-bundle:
	sed -i -e 's,<script data-main="src/main" src="jam/require.js",<script src="bundles/patterns.min.js",' index.html _SpecRunner.html
	sed -i -e 's,<script data-main="../src/main" src="../jam/require.js",<script src="../bundles/patterns.min.js",' demo/*html
	sed -i -e 's,<script data-main="../../src/main" src="../../jam/require.js",<script src="../../bundles/patterns.min.js",' demo/*/*.html

use-modular:
	sed -i -r -e 's,<script src="bundles/patterns.(min.)?js",<script data-main="src/main" src="jam/require.js",' index.html
	sed -i -r -e 's,<script src="../bundles/patterns.(min.)?js",<script data-main="../src/main" src="../jam/require.js",' demo/*html
	sed -i -r -e 's,<script src="../../bundles/patterns.(min.)?js",<script data-main="../../src/main" src="../../jam/require.js",' demo/*/*.html

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

nixenv/bin/phantomjs:
	nix-build --out-link nixenv dev.nix

phantom-via-nix: nixenv/bin/phantomjs
	rm -f ./node_modules/grunt-contrib-jasmine/node_modules/grunt-lib-phantomjs/node_modules/phantomjs/lib/phantom/bin/phantomjs
	ln -s $(shell realpath ./nixenv/bin/phantomjs) ./node_modules/grunt-contrib-jasmine/node_modules/grunt-lib-phantomjs/node_modules/phantomjs/lib/phantom/bin/phantomjs

check:
	@$(JSHINT) --config jshintrc Gruntfile.js $(CHECKSOURCES)
	@$(JSHINT) --config tests/jshintrc tests/*.js
	$(GRUNT) test

check-nix: phantom-via-nix check

clean:
	rm -f $(TARGETS)
	rm -rf build

localize-demo-images:
	tools/localize-demo-images.sh

.PHONY: all bootstrap check check-nix clean doc bundles phantom-via-nix
