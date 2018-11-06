# Contributing to challenges

## Contribution process overview

1. Fork this project.
1. Create a feature branch.
1. Make your changes
1. Push your changes to your fork/branch.
1. Open a pull request.

### 1. Fork

1. Click the fork button up top.
1. Clone your fork locally (Notice that git's `origin` reference will point to your forked repository).
1. It is useful to have the upstream repository registered as well using: `git remote add upstream https://github.com/ollelauribostrom/challenges.git` and periodically fetch it using `git fetch upstream`.

### 2. Create a feature branch

Create and switch to a new feature branch: `git checkout -b {branch_name} upstream/master`  
(replace `{branch_name}` with a meaningful name that describes your feature or change).

### 3. Make your changes

Now that you have a new branch you can edit/create/delete files. Use touch-up commits using `git commit --amend`. (You may use git force push after that).

To avoid Travis CI from building your PR (which is currently set up to test challenge solutions), add the following prefix to your commit message: `[skip ci]`

If you are adding a new challenge, please make sure you have:

- Added a `README.md` that describes how to solve your challenge. Look at an example [here](https://github.com/ollelauribostrom/challenges/tree/master/challenges/001)
- Added tests for your challenge. Look at an example [here](https://github.com/ollelauribostrom/challenges/blob/master/challenges/001/tests/001.spec.js)
- Added your challenge to the list of challenges [here](https://github.com/ollelauribostrom/challenges/tree/master/challenges)
- Added your challenge to the results file [here](https://github.com/ollelauribostrom/challenges/blob/master/data/results.json)

### 4. Push your changes to your fork/branch

Push your changes to your fork/branch on GitHub: `git push origin {branch_name}`. For force push, which will destroy previous commits on the server, use `--force` (or `-f`) option.

### 5. Create a pull request

Create a pull request on GitHub for your feature branch.
