export PATH := ./.node/bin:$(PATH)

BUNGLE 		?= node_modules/.bin/bungle
JSHINT 		?= node_modules/.bin/jshint
PEGJS		?= node_modules/.bin/pegjs
PHANTOMJS	?= node_modules/.bin/phantomjs

SOURCES		= $(wildcard src/*.js) $(wildcard src/*/*.js)
BUNDLES		= bundles/patterns.js bundles/patterns.min.js

GENERATED	= src/lib/depends_parse.js

JSHINTEXCEPTIONS = $(GENERATED) \
		   src/lib/dependshandler.js \
		   src/lib/htmlparser.js \
		   src/pat/skeleton.js
CHECKSOURCES	= $(filter-out $(JSHINTEXCEPTIONS),$(SOURCES))


all:: $(BUNDLES) $(GENERATED)

# Installation of dependencies:

bungledeps: package.json
	$(BUNGLE) update
	$(BUNGLE) install
	touch bungledeps


# Bundle related rules

bundles: check-modules $(BUNDLES)

bundles/patterns.js: $(SOURCES) $(GENERATED) bungledeps package.json
	./build.js -n

bundles/patterns.min.js: $(SOURCES) $(GENERATED) bungledeps package.json
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


# Phony targets to switch all HTML pages between using modules and bundles.

use-bundle: $(BUNDLES)
	sed -i~ -e 's,<script data-main="\(.*\)src/autoinit" src="\1bungledeps/require.js",<script src="\1bundles/patterns.min.js",' index.html demo/*.html demo/*/*.html

use-modules:
	sed -i~ -e 's,<script src="\(.*\)bundles/patterns\.min\.js",<script data-main="\1src/autoinit" src="\1bungledeps/require.js",' index.html demo/*.html demo/*/*.html


# Development related rules

src/lib/depends_parse.js: src/lib/depends_parse.pegjs
	$(PEGJS) $^
	sed -i~ -e '1s/.*/define(function() {/' -e '$$s/()//' $@ || rm -f $@


check:: jshint
jshint:
	$(JSHINT) --config jshintrc $(CHECKSOURCES)

check:: check-modules
check-modules: bungledeps $(GENERATED)
	@echo Running checks on modules
	@echo =========================
	$(MAKE) $(MFLAGS) -C tests TestRunner-modules.html TestRunner-modules.js
	$(PHANTOMJS) node_modules/phantom-jasmine/lib/run_jasmine_test.coffee tests/TestRunner-modules.html

check:: check-bundles
check-bundles: $(BUNDLES)
	@echo Running checks on bundles
	@echo =========================
	$(MAKE) $(MFLAGS) -C tests
	$(PHANTOMJS) node_modules/phantom-jasmine/lib/run_jasmine_test.coffee tests/TestRunner-bundle.html
	$(PHANTOMJS) node_modules/phantom-jasmine/lib/run_jasmine_test.coffee tests/TestRunner-bundle-min.html


# PhantomJS installation on NixOS

nixenv/bin/phantomjs:
	nix-build --out-link nixenv dev.nix

phantom-via-nix: nixenv/bin/phantomjs
	rm -f $(PHANTOMJS)
	ln -s $(shell realpath ./nixenv/bin/phantomjs) $(PHANTOMJS)

check-nix: phantom-via-nix check


clean:
	$(MAKE) $(MFLAGS) -C tests clean
	rm -f $(BUNDLES)

.PHONY: all bundle bundles bundles-all-tags jshint check check-bundles check-modules check-nix clean doc phantom-via-nix use-modules use-bundle

