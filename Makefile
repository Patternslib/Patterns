 ##############
## Please note
##############

# First, run ``make install``.
# After that you have through Makefile extension all the other base targets available.

# If you want to release on GitHub, make sure to have a .env file with a GITHUB_TOKEN.
# Also see:
#	https://github.com/settings/tokens
#	and https://github.com/release-it/release-it/blob/master/docs/github-releases.md#automated


# Include base Makefile
-include node_modules/@patternslib/dev/Makefile

# Define the GITHUB_TOKEN in the .env file for usage with release-it.
-include .env
export

PEGJS		?= npx pegjs
SASS		?= npx sass
YARN		?= npx yarn

PACKAGE_NAME = "patternslib"

all:: bundle css


.PHONY: install
stamp-yarn install:
	$(YARN) install
	# Install pre commit hook
	$(YARN) husky install
	# We have checked in the .husky files, so no need to add the commitlint hook again.
	# $(YARN) husky add .husky/commit-msg "npx yarn commitlint --edit $1"
	touch stamp-yarn


.PHONY: watch
watch: stamp-yarn
	$(YARN) watch


.PHONY: build
build: bundle css


src/lib/depends_parse.js: src/lib/depends_parse.pegjs stamp-yarn
	$(PEGJS) $<
	sed -i~ -e '1s/.*/define(function() {/' -e '$$s/()//' $@ || rm -f $@


.PHONY: css
css:
	@$(SASS) -I style -I _sass -I . _sass/_patterns.scss style/patterns.css

