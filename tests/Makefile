
JAM 		?= ../node_modules/.bin/jam
PATTERNS 	= $(shell find ../src -name "*.js")
TESTS 		= $(wildcard ../tests/core/*.js) $(wildcard ../tests/pat/*.js)
TARGETS 	= TestRunner-bundle.html \
		  TestRunner-bundle.js \
		  TestRunner-modules.html \
		  TestRunner-modules.js


all:: $(TARGETS)

clean:
	@rm -f $(TARGETS)


TestRunner-bundle.html: TestRunner.html.in
	@sed -e 's#@PATTERNS@#src="../bundles/patterns.min.js"#' \
	     -e 's#@TESTRUNNER@#src="TestRunner-bundle.js"#' $< > $@

TestRunner-modules.html: TestRunner.html.in
	@sed -e 's#@PATTERNS@#src="../jam/require.js" data-main="../src/main"#' \
	     -e 's#@TESTRUNNER@#src="TestRunner-modules.js"#' $< > $@

TestRunner-bundle.js: TestRunner-modules.js
	@$(JAM) compile -i ../tests/$< $(patsubst %,-i %,$(TESTS)) \
	    $(patsubst %,-E ../tests/%,$(PATTERNS)) -o $@

empty  		:=
space 		:= $(empty) $(empty)
comma 		:= ,
TESTLIST 	= $(subst $(space),$(comma),$(patsubst %,\"%\",$(TESTS)))

TestRunner-modules.js: TestRunner.js.in $(TESTS)
	@sed -e "s#@TESTS@#$(TESTLIST)#" $< > $@



.PHONY: all clean

