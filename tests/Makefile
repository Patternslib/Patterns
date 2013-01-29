
JAM 		?= ../node_modules/.bin/jam
PATTERNS 	= $(shell find ../src -name "*.js")
SPECS 		= $(wildcard ../tests/specs/*.js)
TARGETS 	= SpecRunner-bundle.html \
		  SpecRunner-bundle.js \
		  SpecRunner-modules.html \
		  SpecRunner-modules.js


all:: $(TARGETS)

clean:
	@rm -f $(TARGETS)


SpecRunner-bundle.html: SpecRunner.html.in
	@sed -e 's#@PATTERNS@#src="../bundles/patterns.min.js"#' \
	     -e 's#@SPECRUNNER@#src="SpecRunner-bundle.js"#' $< > $@

SpecRunner-modules.html: SpecRunner.html.in
	@sed -e 's#@PATTERNS@#src="../jam/require.js" data-main="../src/main"#' \
	     -e 's#@SPECRUNNER@#src="SpecRunner-modules.js"#' $< > $@

SpecRunner-bundle.js: SpecRunner-modules.js
	@$(JAM) compile -i ../tests/$< $(patsubst %,-i %,$(SPECS)) \
	    $(patsubst %,-E ../tests/%,$(PATTERNS)) -o $@

empty  		:=
space 		:= $(empty) $(empty)
comma 		:= ,
SPECLIST 	= $(subst $(space),$(comma),$(patsubst %,\"%\",$(SPECS)))

SpecRunner-modules.js: SpecRunner.js.in $(SPECS)
	@sed -e "s#@SPECS@#$(SPECLIST)#" $< > $@



.PHONY: all clean

