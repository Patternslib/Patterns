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
PNPM		?= npx pnpm

PACKAGE_NAME = "patternslib"

all:: bundle css


.PHONY: install
pnpm-lock.yaml install: .git/hooks/commit-msg
	$(PNPM) install


.git/hooks/commit-msg:
	echo "npx commitlint --edit" > .git/hooks/commit-msg
	chmod u+x .git/hooks/commit-msg


.PHONY: watch
watch: install
	$(PNPM) run watch


.PHONY: build
build: bundle css


.PHONY: depends-parser
depends-parser:  install
	$(PEGJS) -O size -f es src/lib/depends_parse.pegjs


# Unlink any linked dependencies before building a bundle.
# Also run parent @patternslib/dev `bundle-pre` (double colon `::`)
bundle-pre::
	-$(PNPM) unlink --recursive
	$(MAKE) install


.PHONY: css
css:
	@$(SASS) -I style --load-path node_modules/ _sass/_patterns.scss style/patterns.css


# Update patterns-site


Patterns-site/Makefile:
	git clone git@github.com:Patternslib/Patterns-site.git


.PHONY: update-patternslib-site
update-patternslib-site: Patterns-site/Makefile
	# something
	cd Patterns-site && git pull &&	$(MAKE) update-patternslib && git push


# Overrides release + Update https://patternslib.com


.PHONY: release-major
release-major:
	$(MAKE) LEVEL=major release
	$(MAKE) update-patternslib-site


.PHONY: release-minor
release-minor:
	$(MAKE) LEVEL=minor release
	$(MAKE) update-patternslib-site


.PHONY: release-patch
release-patch:
	$(MAKE) LEVEL=patch release
	$(MAKE) update-patternslib-site
