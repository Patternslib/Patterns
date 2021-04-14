# Making a release

We are using release-it together with the convention-changelog plugin for automatic changelog generation.
Automatic changelog generation needs consistent commit messages wich follow th econventional commits format.
A pre-commit hook checks for each commit message to conform to the specs.

## Release process

- Run ``npm login`` to be able to push to the npm registry.
- Run ``make check``. If any errors occur, fix them first.
- Run ``npx release-it --dry-run`` to see if the release process would be successful.
- Run ``npx release-it`` for a patch level release or ``npx release-it minor`` or ``npx release-it major``.
  This updates the changelog, adds git tags and makes a npm and Github release.
- Run ``make release-web`` to create a tarball.

