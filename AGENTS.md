# Patternslib AGENTS.md instructions

## Relevant Paths

- First search all the relevant paths, then - if needed - the individual `node_modules` directories.

- "@patternslib/patternslib" at `./` is the main Patternslib directory
- "@patternslib/dev" at `../REPOS-pat/dev/` is for base configuration files, e.g. Webpack, prettier, eslint and release-it.
- External Patterns which use this Patternslib infrastructure can be found at: `../REPOS-pat/`
- Plone's "@plone/mockup" repository - the base Plone ClassicUI JavaScript library which uses "@patternslib/patternslib" can be found at: `../../../../plone/patternslib/mockup/`

## Dev environment tips

- "@plone/mockup" uses "pnpm"
- "@patternslib/patternslib" and most others use "yarn" (We think of switching to "pnpm")
- All we still Webpack based projects (We think of switching to "rspack" or "vite")
- All use "Jest" as testing framework (We think of switching to "vitest" or "rstest")
- We make heavy use of Module Federation to share libraries between individual Patternslib addons and not to load dependencies twice.
- We use "release-it" for releasing packages on npm.

### Commit message style

- We use "conventionalchangelog" changelog generation when releasing. The format is `category(subtitle): commit message`, where category is one of `breaking`, `feat`, `fix`, `maint` or `tech`. Subtitle should define the Pattern or module we were working on, e.g. "pat-inject". The commit message title is a concise summary of what was done. A more elaborate body can be given.
    Example:

```
feat(pat-inject):‌ Sanitize HTML using DOMPurify

We're now using DOMPurify to sanitize the HTML response instead of the previous custom regex based sanitization method. This improves the libraries security.
```

- If a source commit implements a decision documented in an ADR, reference that ADR in the commit message as (same rule as in AGENTS.md):

```
ORIGINAL COMMIT MESSAGE

Ref: ADR NNNN
```

- If a commit was done with significant help from someone else, append this to the commit message:

```
ORIGINAL COMMIT MESSAGE

Co-Authored-By: NAME <EMAIL>
```

- If a commit was done with significant help from an AI, append this to the commit message:

```
ORIGINAL COMMIT MESSAGE

Assisted-by: NAME <EMAIL>
```

Don't use `Co-Authored-By` for AI contributions, as for Plone and other projects we need a contributor agreement for commits and an AI cannot sign it.

- Use these rules in order as they are defined here - first ADR, then scrum, then co-authored, then assisted references.

- These rules do not apply to build-output commits as defined above. Their commit message must be `Compiled.`

## Architecture Decision Records

Record significant decisions made during agentic sessions as Architecture
Decision Records (ADRs) in `./docs/adr/`.

- Write an ADR when a session makes a non-trivial design, architecture or
  styling decision, or a change whose reasoning is not obvious from the
  code. Q&A, reviews and trivial fixes need none. If unsure, ask.
- Start with a draft ADR, so that it can be referenced from source commits.
- One ADR per decision, not per session. Write it when the decision is
  implemented, before committing. This is not a strict rule.
- File name: `NNNN-short-kebab-title.md`, numbered consecutively.
- Sections: title, `Status: <Proposed|Accepted|Superseded by NNNN> (YYYY-MM-DD)`,
  Context, Decision, Consequences. See `./docs/adr/0004-pat-inject-execute-returns-a-promise.md` as an example.
- Unpushed ADRs may be rewritten freely. Once pushed, an accepted ADR is
  only changed for typos and clarifications; to revise the decision, write
  a new ADR and mark the old one `Superseded by NNNN`.
- If a source commit implements a decision documented in an ADR, reference that ADR in the commit message as:

```
ORIGINAL COMMIT MESSAGE

Ref: ADR NNNN
```
