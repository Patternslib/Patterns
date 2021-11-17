# Making a release

We are using release-it together with the conventional-changelog plugin for automatic changelog generation.
Automatic changelog generation needs consistent commit messages wich follow th econventional commits format.
A pre-commit hook checks for each commit message to conform to the specs.
See our [code style guide](docs/developer/styleguide.md) for the changelog format.

Make sure, you have a ``.env`` file with a ``GITHUB_TOKEN=...`` entry.
This is used for the GitHub release which is created along with the npm release by ``make release-major``, ``make release-minor`` or ``make release-patch``.
Also see: https://github.com/settings/tokens and https://github.com/release-it/release-it/blob/master/docs/github-releases.md#automated

## Release process

- Run ``npm login`` to be able to push to the npm registry.
- Run either of ``make release-major`` for major releases (e.g. 4.0.0), ``make release-minor`` for minor releases (e.g. 4.1.0) or ``make release-patch`` for patch releases (e.g. 4.0.1).
  This command runs ``make check``, runs ``release-it`` in dry run and if successful in real, generates the changelog, increases the package.json version, does a git tag, releases the package to npm and creates a zip file of the bundle which is published at the GitHub releases page.
- Check: https://www.npmjs.com/package/@patternslib/patternslib
- Check: https://github.com/Patternslib/Patterns/releases

