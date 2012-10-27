STANDALONE      = name=../lib/almond include=main wrap=true
BUILDJS         = bundles/build.js
RJS		= lib/r.js
PHANTOMJS	?= phantomjs
SOURCES		= src/lib/jquery.form $(wildcard src/*.js) $(wildcard src/*/*.js)
TARGETS		= bundles/patterns.js bundles/patterns.min.js bundles/patterns-standalone.js bundles/patterns-standalone.min.js

all:: $(TARGETS)

bundles/patterns.js: $(SOURCES) $(BUILDJS)
	node $(RJS) -o $(BUILDJS) out=$@ optimize=none

bundles/patterns.min.js: $(SOURCES) $(BUILDJS)
	node $(RJS) -o $(BUILDJS) out=$@ optimize=uglify

bundles/patterns-standalone.js: $(BUILDJS)
	node $(RJS) -o $(BUILDJS) out=$@ optimize=none $(STANDALONE)

bundles/patterns-standalone.min.js: $(BUILDJS)
	node $(RJS) -o $(BUILDJS) out=$@ optimize=uglify $(STANDALONE)

lib/phantom-jasmine src/lib/jquery.form lib/requirejs:
	git submodule update --init --recursive

all:: build/docs/index.html

build/docs/index.html: docs/conf.py $(wildcard docs/*.rst) $(wildcard docs/*/*.rst)
	sphinx-build -b html docs build/docs

check: lib/phantom-jasmine
	$(PHANTOMJS) lib/phantom-jasmine/lib/run_jasmine_test.coffee tests/index.html

clean:
	rm -f $(TARGETS)

upgrade-requirejs:
	curl -s -o $(RJS) $(shell curl -s http://requirejs.org/docs/download.html | sed -ne '/download.*\/r.js/s/.*href="\([^"]*\).*/\1/p')
	curl -s -o src/3rdparty/require.js $(shell curl -s http://requirejs.org/docs/download.html | sed -ne '/download.*\/comments\/require.js/s/.*href="\([^"]*\).*/\1/p')
	curl -s -o src/3rdparty/require.min.js $(shell curl -s http://requirejs.org/docs/download.html | sed -ne '/download.*\/minified\/require.js/s/.*href="\([^"]*\).*/\1/p')

localize-demo-images:
	tools/localize-demo-images.sh

.PHONY: all clean check upgrade-requirejs
