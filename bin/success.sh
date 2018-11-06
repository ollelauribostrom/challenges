#!/bin/bash

# Exit on any error
set -e

# Config git to make commits as 'Travis CI'
git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

# Extract username and challenge
slug=$TRAVIS_PULL_REQUEST_SLUG
username=${slug%/challenges*}
challenge=$TRAVIS_PULL_REQUEST_BRANCH

# Create a temp dir and clone the repo there
repo_temp=$(mktemp -d)
git clone "https://github.com/ollelauribostrom/challenges" "$repo_temp"
cd "$repo_temp"

# Pull down the PR
git checkout -b "$username:$TRAVIS_PULL_REQUEST_BRANCH" master
git pull https://github.com/${username}/challenges.git "$TRAVIS_PULL_REQUEST_BRANCH"
git checkout master

# Squash and merge the PR
git merge --squash "$username-$TRAVIS_PULL_REQUEST_BRANCH"
git commit --message "Merge branch '$username:$TRAVIS_PULL_REQUEST_BRANCH'"

# Update the scores
node ./bin/score.js "$username" "$challenge" `date '+%Y-%m-%d %H:%M:%S'`

# Commit the updated scores
git add challenges data
git commit --message "Updating results for challenge: ${challenge}"

# Push to master
git push "https://${GH_TOKEN}@github.com/ollelauribostrom/challenges.git" master >/dev/null 2>&1