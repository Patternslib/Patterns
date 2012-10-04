PHANTOMJS	?= phantomjs

all:: build/patterns.js

build/patterns.js: src/lib/jquery.form lib/requirejs $(wildcard src/*.js) $(wildcard src/*/*.js)
	node lib/r.js -o name=main out=$@ baseUrl=src/

lib/phantom-jasmine src/lib/jquery.form lib/requirejs:
	git submodule update --init --recursive

all:: build/docs/index.html

build/docs/index.html: docs/conf.py $(wildcard docs/*.rst) $(wildcard docs/*/*.rst)
	sphinx-build -b html docs build/docs

check: lib/phantom-jasmine
	$(PHANTOMJS) lib/phantom-jasmine/lib/run_jasmine_test.coffee tests/unit/runner.html


.PHONY: all check
