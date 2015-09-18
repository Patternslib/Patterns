# Making a release

Firstly, update the version number in bower.json, package.json and add the date to changes.md

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
