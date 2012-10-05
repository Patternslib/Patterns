PHANTOMJS	?= phantomjs

all:: dist/patterns.js

dist/patterns.js dist/patterns.min.js: src/lib/jquery.form lib/requirejs $(wildcard src/*.js) $(wildcard src/*/*.js)
	node lib/r.js -o src/app.build.js out=dist/patterns.js optimize=none
	node lib/r.js -o src/app.build.js out=dist/patterns.min.js optimize=uglify

lib/phantom-jasmine src/lib/jquery.form lib/requirejs:
	git submodule update --init --recursive

all:: build/docs/index.html

build/docs/index.html: docs/conf.py $(wildcard docs/*.rst) $(wildcard docs/*/*.rst)
	sphinx-build -b html docs build/docs

check: lib/phantom-jasmine
	$(PHANTOMJS) lib/phantom-jasmine/lib/run_jasmine_test.coffee tests/unit/runner.html

.PHONY: all check
