# Making a release

## Update numbers

First, update the version number in

- package.json
- VERSION.txt (remove the -dev from the version number in VERSION.txt)
- and add the date to CHANGES.md

  git commit -m "Prepare release"

## Merge master into the "release" branch

    git checkout --track origin/release
    git merge --no-commit --no-ff master

## Make sure all tests are passing

    make check

## If tests pass, commit the merge

    git commit -am "Merge master into release branch"

## Create a new bundle and commit that

    make bundle
    git add -f bundle.js
    git commit bundle.js -m "Add bundle for next release 2.0.0"

## Tag the release and set it free

    git tag 2.0.0
    git push && git push --tags

## checkout master, update VERSION.txt to the next logical version number and append '-dev' to it.

## Create the release in github

- Go to https://github.com/Patternslib/Patterns/releases/
- Click the new tag
- Click "Edit tag"
- Add a Title, e.g. "2.0.14 - Aug 15, 2016"
- Copy the corresponding changelog part into the body field
- Finally click "Publish release"

## Release to npmjs.org

Run:

- npm login
- npm version <update_type>
  where update_type is patch, minor or major. See https://docs.npmjs.com/getting-started/publishing-npm-packages.
- npm publish

## Now contact support@syslab.com and request an update of the patternslib.com site as well.

This is done as follows:

- Log into patternslib.syslab.com

  sudo -iu patternslib
  cd Patterns-site
  cd patternslib
  git pull
  make clean && make bundle
  cd .. && bundle exec jekyll serve
