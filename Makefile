
NPM 		?= npm
JAM 		?= node_modules/.bin/jam
JSHINT 		?= node_modules/.bin/jshint
PEGJS		?= node_modules/.bin/pegjs
PHANTOMJS	?= node_modules/.bin/phantomjs

SOURCES		= $(wildcard src/*.js) $(wildcard src/*/*.js)
THIRDPARTY	= $(shell find jam -name '*.js')
TARGETS		= bundles/patterns.js bundles/patterns.min.js



all:: $(TARGETS)

bootstrap:
	mkdir -p bundles
	$(NPM) install
	@echo "Not calling \"jam install\". Jam packages are in git for now"
	#$(JAM) install

bundles: check-modules $(TARGETS)

bundles/patterns.js: $(SOURCES) $(THIRDPARTY) package.json
	$(JSHINT) --config jshintrc $(CHECKSOURCES)
	./build.js -n

bundles/patterns.min.js: $(SOURCES) $(THIRDPARTY) package.json
	$(JSHINT) --config jshintrc $(CHECKSOURCES)
	./build.js

use-bundle:
	sed -i -e 's,<script data-main="src/main" src="jam/require.js",<script src="bundles/patterns.min.js",' index.html
	sed -i -e 's,<script data-main="../src/main" src="../jam/require.js",<script src="../bundles/patterns.min.js",' demo/*html
	sed -i -e 's,<script data-main="../../src/main" src="../../jam/require.js",<script src="../../bundles/patterns.min.js",' demo/*/*.html

use-modules:
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

check-modules:
	$(JSHINT) --config tests/jshintrc tests/core/*.js tests/pat/*.js
	make -C tests
	@echo Running checks on modules
	@echo =========================
	$(PHANTOMJS) node_modules/phantom-jasmine/lib/run_jasmine_test.coffee tests/TestRunner-modules.html

check: check-modules $(TARGETS)
	@echo Running checks on bundles
	@echo =========================
	$(PHANTOMJS) node_modules/phantom-jasmine/lib/run_jasmine_test.coffee tests/TestRunner-bundle.html
	$(PHANTOMJS) node_modules/phantom-jasmine/lib/run_jasmine_test.coffee tests/TestRunner-bundle-min.html


nixenv/bin/phantomjs:
	nix-build --out-link nixenv dev.nix

phantom-via-nix: nixenv/bin/phantomjs
	rm -f $(PHANTOMJS)
	ln -s $(shell realpath ./nixenv/bin/phantomjs) $(PHANTOMJS)

check-nix: phantom-via-nix check


clean:
	make -C tests clean
	rm -f $(TARGETS)

localize-demo-images:
	tools/localize-demo-images.sh

.PHONY: all bootstrap bundles check check-modules check-nix clean doc phantom-via-nix use-modules use-bundles

