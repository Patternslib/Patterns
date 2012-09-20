PHANTOMJS	?= phantomjs

all:: build/patterns.js

build/patterns.js: src/lib/jquery.form lib/requirejs $(wildcard src/*.js) $(wildcard src/*/*.js)
	node lib/r.js -o name=main out=$@ baseUrl=src/

lib/phantom-jasmine src/lib/jquery.form lib/requirejs:
	git git submodule update --init --recursive

check: lib/phantom-jasmine
	$(PHANTOMJS) lib/phantom-jasmine/lib/run_jasmine_test.coffee tests/unit/runner.html


.PHONY: all check
