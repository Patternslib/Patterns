ESLINT 		?= node_modules/.bin/eslint
PEGJS		?= node_modules/.bin/pegjs
SASS		?= node_modules/.bin/sass

SOURCES		= $(wildcard src/*.js) $(wildcard src/pat/*.js) $(wildcard src/lib/*.js)
GENERATED	= src/lib/depends_parse.js


all:: bundle.js css

########################################################################
## Install dependencies

stamp-yarn: package.json
	yarn install

clean::
	rm -f stamp-yarn
	rm -rf node_modules

########################################################################
## Tests

eslint: stamp-yarn
	$(ESLINT) ./src

.PHONY: check
check:: stamp-yarn eslint
	yarn run testonce


########################################################################
## Builds

build:: bundle all_css

# bundle bundle.js: $(GENERATED) $(SOURCES) stamp-yarn
bundle bundle.js: stamp-yarn
	yarn run build

src/lib/depends_parse.js: src/lib/depends_parse.pegjs stamp-yarn
	$(PEGJS) $<
	sed -i~ -e '1s/.*/define(function() {/' -e '$$s/()//' $@ || rm -f $@

clean::
	rm -f bundle.js bundle.min.js

all_css:: css
	@echo "Hang tight!"
	@$(SASS) -I . -I _sass src/pat/auto-scale/_auto-scale.scss src/pat/auto-scale/auto-scale.css
	@$(SASS) -I . -I _sass src/pat/auto-submit/_auto-submit.scss src/pat/auto-submit/auto-submit.css
	@$(SASS) -I . -I _sass src/pat/auto-suggest/_auto-suggest.scss src/pat/auto-suggest/auto-suggest.css
	@$(SASS) -I . -I _sass src/pat/autofocus/_autofocus.scss src/pat/autofocus/autofocus.css
	@$(SASS) -I . -I _sass src/pat/bumper/_bumper.scss src/pat/bumper/bumper.css
	@$(SASS) -I . -I _sass src/pat/calendar/_calendar.scss src/pat/calendar/calendar.css
	@$(SASS) -I . -I _sass src/pat/carousel/_carousel.scss src/pat/carousel/carousel.css
	@$(SASS) -I . -I _sass src/pat/checklist/_checklist.scss src/pat/checklist/checklist.css
	@$(SASS) -I . -I _sass src/pat/clone/_clone.scss src/pat/clone/clone.css
	@$(SASS) -I . -I _sass src/pat/collapsible/_collapsible.scss src/pat/collapsible/collapsible.css
	@$(SASS) -I . -I _sass src/pat/date-picker/_date-picker.scss src/pat/date-picker/date-picker.css
	@$(SASS) -I . -I _sass src/pat/datetime-picker/_datetime-picker.scss src/pat/datetime-picker/datetime-picker.css
	@$(SASS) -I . -I _sass src/pat/depends/_depends.scss src/pat/depends/depends.css
	@$(SASS) -I . -I _sass src/pat/equaliser/_equaliser.scss src/pat/equaliser/equaliser.css
	@$(SASS) -I . -I _sass src/pat/expandable-tree/_expandable-tree.scss src/pat/expandable-tree/expandable-tree.css
	@$(SASS) -I . -I _sass src/pat/focus/_focus.scss src/pat/focus/focus.css
	@echo "Almost there, don't give up!"
	@$(SASS) -I . -I _sass src/pat/forward/_forward.scss src/pat/forward/forward.css
	@$(SASS) -I . -I _sass src/pat/fullscreen/_fullscreen.scss src/pat/fullscreen/fullscreen.css
	@$(SASS) -I . -I _sass src/pat/gallery/_gallery.scss src/pat/gallery/gallery.css
	@$(SASS) -I . -I _sass src/pat/grid/_grid.scss src/pat/grid/grid.css
	@$(SASS) -I . -I _sass src/pat/image-crop/_image-crop.scss src/pat/image-crop/image-crop.css
	@$(SASS) -I . -I _sass src/pat/inject-history/_inject-history.scss src/pat/inject-history/inject-history.css
	@$(SASS) -I . -I _sass src/pat/inject/_inject.scss src/pat/inject/inject.css
	@$(SASS) -I . -I _sass src/pat/markdown/_markdown.scss src/pat/markdown/markdown.css
	@$(SASS) -I . -I _sass src/pat/masonry/_masonry.scss src/pat/masonry/masonry.css
	@$(SASS) -I . -I _sass src/pat/modal/_modal.scss src/pat/modal/modal.css
	@$(SASS) -I . -I _sass src/pat/notification/_notification.scss src/pat/notification/notification.css
	@$(SASS) -I . -I _sass src/pat/sortable/_sortable.scss src/pat/sortable/sortable.css
	@$(SASS) -I . -I _sass src/pat/stacks/_stacks.scss src/pat/stacks/stacks.css
	@$(SASS) -I . -I _sass src/pat/switch/_switch.scss src/pat/switch/switch.css
	@$(SASS) -I . -I _sass src/pat/toggle/_toggle.scss src/pat/toggle/toggle.css
	@$(SASS) -I . -I _sass src/pat/tooltip/_tooltip.scss src/pat/tooltip/tooltip.css
	@$(SASS) -I . -I _sass src/pat/validate/_validate.scss src/pat/validate/validate.css
	@$(SASS) -I . -I _sass src/pat/zoom/_zoom.scss src/pat/zoom/zoom.css
	@echo "Done. Each pattern now has a CSS file."

css::
	@$(SASS) -I style -I _sass -I . _sass/_patterns.scss style/patterns.css

watch::
	$(SASS) --watch -I style -I . -I _sass _sass/_patterns.scss:style/patterns.css

########################################################################

serve:: all _serve

_serve:
	yarn run start
	@printf "\nBundle built\n\n"

designerhappy:: serve

.PHONY: all bundle clean eslint
