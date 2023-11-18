# Contributing

We use Github to manage our codebase.

## Internal Contributor Workflow

1. Create an issue for the feature or bug fix you are working on.
2. Create a branch from `master`. Branch name doesn't matter.
3. Make your changes.
4. Create a pull request to the `master` branch.

## External contributor workflow

1. (Optional) Create an issue for the feature or bug fix you are working on.
2. Fork the repository.
3. Create a branch from `master`. Branch name doesn't matter.
4. Make your changes.
5. Create a pull request to the upstream `master` branch.

## Pull Request Process

1. Create a Draft PR to get early feedback on your changes.
2. PR title should follow conventional commit format. See https://www.conventionalcommits.org/en/v1.0.0/ for more details.
3, In the PR description, add a bulleted list of changes and use magic words to link to issues and other PRs. See https://docs.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue for more details.
4. Mark the PR as ready for review when you are ready for it to be reviewed.
5. PR will be reviewed by at least one maintainer.
6. PR may be merged by a maintainer. Only squash merges are allowed.

## Release Process

Each component has its own version number. The versioning scheme we use is
[SemVer](http://semver.org/). The repo does not have a version number.

1. Increase the version number of a given component by running `npm version <major|minor|patch>` inside the package directory or by using the `--workspace=<package>` flag from the root directory.
2. Create a PR.
3. When the PR is merged, the CI will automatically publish the new version to NPM.