ESLINT		?= npx eslint
PEGJS		?= npx pegjs
SASS		?= npx sass
YARN		?= npx yarn

SOURCES		= $(wildcard src/*.js) $(wildcard src/pat/*.js) $(wildcard src/lib/*.js)
GENERATED	= src/lib/depends_parse.js

define get_package_var
$(shell node -p "require('./package.json').$(1)")
endef
PACKAGE_NAME := $(shell node -p "'$(call get_package_var,name)'.replace('@patternslib/', '')")
PACKAGE_VERSION := $(call get_package_var,version)


all:: bundle css

########################################################################
## Install dependencies

stamp-yarn:
	$(YARN) install
	# Install pre commit hook
	$(YARN) husky install
	# We have checked in the .husky files, so no need to add the commitlint hook again.
	# $(YARN) husky add .husky/commit-msg "yarn commitlint --edit $1"
	touch stamp-yarn

clean-dist:
	rm -Rf dist/

.PHONY: clean
clean: clean-dist
	rm -f stamp-yarn
	rm -Rf node_modules/

########################################################################
## Tests

.PHONY: eslint
eslint: stamp-yarn
	$(ESLINT) ./src

.PHONY: check
check:: stamp-yarn eslint
	$(YARN) run testonce


########################################################################
## Builds

.PHONY: build
build:: bundle all-css

.PHONY: bundle
bundle: stamp-yarn
	$(YARN) run build

release-web: clean-dist bundle
	@echo name is $(PACKAGE_NAME)
	@echo version is $(PACKAGE_VERSION)
	tar -czf ./$(PACKAGE_NAME)-$(PACKAGE_VERSION).tar.gz dist --transform s/dist/$(PACKAGE_NAME)-$(PACKAGE_VERSION)/
	git clone -n git@github.com:Patternslib/Patterns-releases.git --depth 1 ./dist/Patterns-releases
	mkdir ./dist/Patterns-releases/releases
	mv ./$(PACKAGE_NAME)-$(PACKAGE_VERSION).tar.gz ./dist/Patterns-releases/releases/
	cd ./dist/Patterns-releases && \
		git reset HEAD && \
		git add ./releases/$(PACKAGE_NAME)-$(PACKAGE_VERSION).tar.gz && \
		git commit -m"Add release $(PACKAGE_NAME)-$(PACKAGE_VERSION).tar.gz" && \
		git push

.PHONY: release-major
release-major: check
	npx release-it major --dry-run --ci && \
		npx release-it major --ci  && \
		make release-web

.PHONY: release-minor
release-minor: check
	npx release-it minor --dry-run --ci && \
		npx release-it minor --ci  && \
		make release-web

.PHONY: release-patch
release-patch: check
	npx release-it --dry-run --ci && \
		npx release-it --ci  && \
		make release-web


src/lib/depends_parse.js: src/lib/depends_parse.pegjs stamp-yarn
	$(PEGJS) $<
	sed -i~ -e '1s/.*/define(function() {/' -e '$$s/()//' $@ || rm -f $@

.PHONY: all-css
all-css:: css
	@echo "Hang tight!"
	@$(SASS) -I . -I _sass src/pat/auto-scale/_auto-scale.scss src/pat/auto-scale/auto-scale.css
	@$(SASS) -I . -I _sass src/pat/auto-submit/_auto-submit.scss src/pat/auto-submit/auto-submit.css
	@$(SASS) -I . -I _sass src/pat/auto-suggest/_auto-suggest.scss src/pat/auto-suggest/auto-suggest.css
	@$(SASS) -I . -I _sass src/pat/autofocus/_autofocus.scss src/pat/autofocus/autofocus.css
	@$(SASS) -I . -I _sass src/pat/bumper/_bumper.scss src/pat/bumper/bumper.css
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
	@$(SASS) -I . -I _sass src/pat/zoom/_zoom.scss src/pat/zoom/zoom.css
	@echo "Done. Each pattern now has a CSS file."

.PHONY: css
css::
	@$(SASS) -I style -I _sass -I . _sass/_patterns.scss style/patterns.css

.PHONY: watch
watch::
	$(SASS) --watch -I style -I . -I _sass _sass/_patterns.scss:style/patterns.css

########################################################################

.PHONY: serve
serve: bundle css
	$(YARN) run start
	@printf "\nBundle built\n\n"

.PHONY: designerhappy
designerhappy:: serve

