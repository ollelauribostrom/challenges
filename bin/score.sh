#!/bin/bash

# Config git to make commits as 'Travis CI'
git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"
echo "[✓] Configured git"

# Create a temp dir and clone the repo there
repo_temp=$(mktemp -d)
git clone "https://github.com/ollelauribostrom/challenges" "$repo_temp" >/dev/null 2>&1
cd "$repo_temp"
echo "[✓] Cloned ollelauribostrom/challenges"

# Update the scores
completion_date=`date '+%Y-%m-%d %H:%M:%S'`
node ./bin/score.js "$completion_date"
echo "[✓] Updated the highscore"

# Commit the updated scores
git add challenges data
git commit --message "[skip ci] Updating the highscore 🏆"  >/dev/null 2>&1
echo "[✓] Commited the changes"

# Push to master
git push "https://${GH_TOKEN}@github.com/ollelauribostrom/challenges.git" master >/dev/null 2>&1
echo "[✓] Pushed to master"