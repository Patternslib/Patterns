PHANTOMJS	?= phantomjs
SOURCES		= src/lib/jquery.form $(wildcard src/*.js) $(wildcard src/*/*.js)
TARGETS		= bundles/patterns.js bundles/patterns.min.js bundles/require-patterns.js bundles/require-patterns.min.js

all:: $(TARGETS)

bundles/patterns.js: $(SOURCES)
	node lib/r.js -o src/app.build.js out=$@ optimize=none

bundles/patterns.min.js: $(SOURCES)
	node lib/r.js -o src/app.build.js out=$@ optimize=uglify

bundles/require-patterns.js: 
	node lib/r.js -o src/app.build.js out=$@ \
		name=3rdparty/almond include=main wrap=true optimize=none

bundles/require-patterns.min.js: 
	node lib/r.js -o src/app.build.js out=$@ \
		name=3rdparty/almond include=main wrap=true optimize=uglify

lib/phantom-jasmine src/lib/jquery.form lib/requirejs:
	git submodule update --init --recursive

all:: build/docs/index.html

build/docs/index.html: docs/conf.py $(wildcard docs/*.rst) $(wildcard docs/*/*.rst)
	sphinx-build -b html docs build/docs

check: lib/phantom-jasmine
	$(PHANTOMJS) lib/phantom-jasmine/lib/run_jasmine_test.coffee tests/unit/runner.html

clean:
	rm -f $(TARGETS)

.PHONY: all clean check
