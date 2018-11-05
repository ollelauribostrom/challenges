#!/bin/bash

get_username() {
  slug=$TRAVIS_PULL_REQUEST_SLUG
  echo ${slug%/challenges*}
}

get_challenge() {
  echo $TRAVIS_PULL_REQUEST_BRANCH
}

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

username=$(get_username)
challenge=$(get_challenge)

repo_temp=$(mktemp -d)
git clone "https://github.com/ollelauribostrom/challenges" "$repo_temp"
cd "$repo_temp"

git checkout -b "$username-$TRAVIS_PULL_REQUEST_BRANCH" master
git pull https://github.com/${username}/challenges.git "$TRAVIS_PULL_REQUEST_BRANCH"
git checkout master

git merge --no-ff "$username-$TRAVIS_PULL_REQUEST_BRANCH"

md="- [${username}](https://github.com/${username}) - `date '+%Y-%m-%d %H:%M:%S'`"
echo ${md} >> challenges/${challenge}/README.md

git add . *.md
git commit --message "Updating results for challenge: ${challenge}"

git push "https://${GH_TOKEN}@github.com/ollelauribostrom/challenges.git" master >/dev/null 2>&1