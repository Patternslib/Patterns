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


.PHONY: depends-parser
depends-parser:  stamp-yarn
	$(PEGJS) -O size -f es src/lib/depends_parse.pegjs


# Unlink any linked dependencies before building a bundle.
bundle-pre:
	-$(YARN) unlink @patternslib/dev
	-$(YARN) unlink @patternslib/pat-content-mirror
	-$(YARN) unlink @patternslib/pat-doclock
	-$(YARN) unlink @patternslib/pat-shopping-cart
	-$(YARN) unlink @patternslib/pat-sortable-table
	-$(YARN) unlink @patternslib/pat-tiptap
	-$(YARN) unlink @patternslib/pat-upload
	$(YARN) install --force


.PHONY: css
css:
	@$(SASS) -I style -I _sass -I . _sass/_patterns.scss style/patterns.css

