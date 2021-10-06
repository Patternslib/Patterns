const fs = require("fs");
const path = require("path");

const commits_template = fs
    .readFileSync(path.resolve(".release-it", "conventional-changelog-commit.hbs"))
    .toString();

module.exports = {
    npm: {
        publish: true,
    },
    git: {
        requireBranch: "master",
        commitMessage: "Release new version.",
        commitArgs: ["-n"],
    },
    plugins: {
        "@release-it/conventional-changelog": {
            infile: "CHANGES.md",
            preset: {
                name: "conventionalcommits",
                types: [
                    {
                        type: "breaking",
                        section: "Breaking Changes",
                    },
                    {
                        type: "feat",
                        section: "Features",
                    },
                    {
                        type: "fix",
                        section: "Bug Fixes",
                    },
                    {
                        type: "maint",
                        section: "Maintenance",
                    },
                ],
            },
            writerOpts: {
                commitPartial: commits_template,
            },
        },
    },
};
