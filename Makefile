
NPM 		?= npm
BUNGLE 		?= node_modules/.bin/bungle
JSHINT 		?= node_modules/.bin/jshint
PEGJS		?= node_modules/.bin/pegjs
PHANTOMJS	?= node_modules/.bin/phantomjs

ifeq ($(shell uname),Darwin)
SED		= sed -i "" -E
else
SED		= sed -i -r
endif

SOURCES		= $(wildcard src/*.js) $(wildcard src/*/*.js)
THIRDPARTY	= bungledeps $(shell find bungledeps -name '*.js' 2>/dev/null)
TARGETS		= bundles/patterns.js bundles/patterns.min.js



all:: $(TARGETS)

bootstrap:
	mkdir -p bundles
	$(NPM) install

bundles: check-modules $(TARGETS)

bungledeps:
	$(BUNGLE) update
	$(BUNGLE) install

bundles/patterns.js: $(SOURCES) $(THIRDPARTY) package.json
	$(JSHINT) --config jshintrc $(CHECKSOURCES)
	./build.js -n

bundles/patterns.min.js: $(SOURCES) $(THIRDPARTY) package.json
	$(JSHINT) --config jshintrc $(CHECKSOURCES)
	./build.js


ifdef REF
TAGARG = -t $(REF)
endif
bundle:
	./build.js -n $(TAGARG)
	echo $?
	./build.js $(TAGARG)
	echo $?

bundles-all-tags:
	$(foreach tag,$(shell git tag|sed 1d),./build.js -t $(tag); ./build.js -n -t $(tag);)



use-bundle:
	$(SED) -e 's,<script data-main="src/main" src="bungledeps/require.js",<script src="bundles/patterns.min.js",' index.html
	$(SED) -e 's,<script data-main="../src/main" src="../bungledeps/require.js",<script src="../bundles/patterns.min.js",' demo/*html
	$(SED) -e 's,<script data-main="../../src/main" src="../../bungledeps/require.js",<script src="../../bundles/patterns.min.js",' demo/*/*.html

use-modules:
	$(SED) -e 's,<script src="bundles/patterns.(min.)?js",<script data-main="src/main" src="bungledeps/require.js",' index.html
	$(SED) -e 's,<script src="../bundles/patterns.(min.)?js",<script data-main="../src/main" src="../bungledeps/require.js",' demo/*html
	$(SED) -e 's,<script src="../../bundles/patterns.(min.)?js",<script data-main="../../src/main" src="../../bungledeps/require.js",' demo/*/*.html

src/lib/depends_parse.js: src/lib/depends_parse.pegjs
	$(PEGJS) $^
	$(SED) -e '1s/.*/define(function() {/' -e '$$s/()//' $@ || rm -f $@

demo/calendar/fullcalendar.css: bungledeps/jquery.fullcalendar/fullcalendar/fullcalendar.css
	cp bungledeps/jquery-fullcalendar/fullcalendar/fullcalendar.css demo/calendar/fullcalendar.css


JSHINTEXCEPTIONS = src/core/parser.js \
		   src/lib/depends_parse.js \
		   src/lib/dependshandler.js \
		   src/lib/dependshandler.js \
		   src/lib/htmlparser.js
CHECKSOURCES = $(filter-out $(JSHINTEXCEPTIONS),$(SOURCES))

check-modules: $(TARGETS) $(THIRDPARTY)
	$(JSHINT) --config tests/jshintrc tests/core/*.js tests/pat/*.js
	make -C tests TestRunner-modules.html TestRunner-modules.js
	@echo Running checks on modules
	@echo =========================
	$(PHANTOMJS) node_modules/phantom-jasmine/lib/run_jasmine_test.coffee tests/TestRunner-modules.html

check: check-modules $(TARGETS) $(THIRDPARTY)
	make -C tests
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

.PHONY: all bootstrap bundle bundles bundles-all-tags check check-modules check-nix clean doc phantom-via-nix use-modules use-bundles

