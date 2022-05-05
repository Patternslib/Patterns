# Define the GITHUB_TOKEN in the .env file for usage with release-it.
-include .env
export

ESLINT		?= npx eslint
PEGJS		?= npx pegjs
SASS		?= npx sass
YARN		?= npx yarn

SOURCES		= $(wildcard src/*.js) $(wildcard src/pat/*.js) $(wildcard src/lib/*.js)
GENERATED	= src/lib/depends_parse.js

PACKAGE_NAME = "patternslib"

all:: bundle css


########################################################################
## Install dependencies

.PHONY: install
stamp-yarn install:
	$(YARN) install
	# Install pre commit hook
	$(YARN) husky install
	# We have checked in the .husky files, so no need to add the commitlint hook again.
	# $(YARN) husky add .husky/commit-msg "npx yarn commitlint --edit $1"
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
check: stamp-yarn eslint
	$(YARN) run testonce


########################################################################
## Builds

.PHONY: build
build: bundle all-css

.PHONY: bundle
bundle: stamp-yarn
	$(YARN) run build

release-zip: clean-dist bundle
	$(eval PACKAGE_VERSION := $(shell node -p "require('./package.json').version"))
	@echo name is $(PACKAGE_NAME)
	@echo version is $(PACKAGE_VERSION)
	mkdir -p dist/$(PACKAGE_NAME)-bundle-$(PACKAGE_VERSION)
	-mv dist/* dist/$(PACKAGE_NAME)-bundle-$(PACKAGE_VERSION)
	cd dist/ && zip -r $(PACKAGE_NAME)-bundle-$(PACKAGE_VERSION).zip $(PACKAGE_NAME)-bundle-$(PACKAGE_VERSION)/

.PHONY: release-major
release-major: check
	npx release-it major --dry-run --ci && \
		npx release-it major --ci && \
		make release-zip && \
		npx release-it --github.release --github.update --github.assets=dist/*.zip --no-github.draft --no-increment --no-git --no-npm --ci && \
		git checkout CHANGES.md

.PHONY: release-minor
release-minor: check
	npx release-it minor --dry-run --ci && \
		npx release-it minor --ci && \
		make release-zip && \
		npx release-it --github.release --github.update --github.assets=dist/*.zip --no-github.draft --no-increment --no-git --no-npm --ci && \
		git checkout CHANGES.md

.PHONY: release-patch
release-patch: check
	npx release-it patch --dry-run --ci && \
		npx release-it patch --ci && \
		make release-zip && \
		npx release-it --github.release --github.update --github.assets=dist/*.zip --no-github.draft --no-increment --no-git --no-npm --ci && \
		git checkout CHANGES.md

src/lib/depends_parse.js: src/lib/depends_parse.pegjs stamp-yarn
	$(PEGJS) $<
	sed -i~ -e '1s/.*/define(function() {/' -e '$$s/()//' $@ || rm -f $@

.PHONY: all-css
all-css: css
	@echo "Hang tight!"
	@$(SASS) -I . -I _sass src/pat/auto-scale/_auto-scale.scss src/pat/auto-scale/auto-scale.css
	@$(SASS) -I . -I _sass src/pat/auto-suggest/_auto-suggest.scss src/pat/auto-suggest/auto-suggest.css
	@$(SASS) -I . -I _sass src/pat/bumper/_bumper.scss src/pat/bumper/bumper.css
	@$(SASS) -I . -I _sass src/pat/carousel/_carousel.scss src/pat/carousel/carousel.css
	@$(SASS) -I . -I _sass src/pat/checklist/_checklist.scss src/pat/checklist/checklist.css
	@$(SASS) -I . -I _sass src/pat/collapsible/_collapsible.scss src/pat/collapsible/collapsible.css
	@$(SASS) -I . -I _sass src/pat/colour-picker/_colour-picker.scss src/pat/colour-picker/colour-picker.css
	@$(SASS) -I . -I _sass src/pat/date-picker/_date-picker.scss src/pat/date-picker/date-picker.css
	@$(SASS) -I . -I _sass src/pat/datetime-picker/_datetime-picker.scss src/pat/datetime-picker/datetime-picker.css
	@$(SASS) -I . -I _sass src/pat/equaliser/_equaliser.scss src/pat/equaliser/equaliser.css
	@$(SASS) -I . -I _sass src/pat/expandable-tree/_expandable-tree.scss src/pat/expandable-tree/expandable-tree.css
	@$(SASS) -I . -I _sass src/pat/focus/_focus.scss src/pat/focus/focus.css
	@$(SASS) -I . -I _sass src/pat/gallery/_gallery.scss src/pat/gallery/gallery.css
	@echo "Almost there, don't give up!"
	@$(SASS) -I . -I _sass src/pat/grid/_grid.scss src/pat/grid/grid.css
	@$(SASS) -I . -I _sass src/pat/image-crop/_image-crop.scss src/pat/image-crop/image-crop.css
	@$(SASS) -I . -I _sass src/pat/inject/_inject.scss src/pat/inject/inject.css
	@$(SASS) -I . -I _sass src/pat/masonry/_masonry.scss src/pat/masonry/masonry.css
	@$(SASS) -I . -I _sass src/pat/menu/_menu.scss src/pat/menu/menu.css
	@$(SASS) -I . -I _sass src/pat/modal/_modal.scss src/pat/modal/modal.css
	@$(SASS) -I . -I _sass src/pat/notification/_notification.scss src/pat/notification/notification.css
	@$(SASS) -I . -I _sass src/pat/sortable/_sortable.scss src/pat/sortable/sortable.css
	@$(SASS) -I . -I _sass src/pat/stacks/_stacks.scss src/pat/stacks/stacks.css
	@$(SASS) -I . -I _sass src/pat/switch/_switch.scss src/pat/switch/switch.css
	@$(SASS) -I . -I _sass src/pat/syntax-highlight/_syntax-highlight.scss src/pat/syntax-highlight/syntax-highlight.css
	@$(SASS) -I . -I _sass src/pat/toggle/_toggle.scss src/pat/toggle/toggle.css
	@$(SASS) -I . -I _sass src/pat/tooltip/_tooltip.scss src/pat/tooltip/tooltip.css
	@echo "Done. Each pattern now has a CSS file."

.PHONY: css
css:
	@$(SASS) -I style -I _sass -I . _sass/_patterns.scss style/patterns.css

.PHONY: watch
watch:
	$(SASS) --watch -I style -I . -I _sass _sass/_patterns.scss:style/patterns.css

########################################################################

.PHONY: serve
serve: bundle css
	$(YARN) run start
	@printf "\nBundle built\n\n"

.PHONY: designerhappy
designerhappy: serve

