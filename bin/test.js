const getLocalBranch = require('git-branch').sync;
const getLocalUsername = require('git-username');
const jest = require('jest');

function getUsername() {
  const slug = process.env.TRAVIS_PULL_REQUEST_SLUG;
  if (slug && slug !== '') {
    return process.env.TRAVIS_PULL_REQUEST_SLUG.split('/')[0];
  }
  return getLocalUsername();
}

function getBranch() {
  return process.env.TRAVIS_PULL_REQUEST_BRANCH || getLocalBranch();
}

// Collect the branch name and username
const username = getUsername();
const branch = getBranch();

// Set TESTPATH env variable to only test the current user's implementation
process.env.TESTPATH = username;

// Run tests for the current challenge based on the branch name
jest
  .runCLI({ roots: [`challenges/${branch}`] }, [__dirname])
  .then(({ results }) => process.exit(results.success ? 0 : 1))
  .catch(() => process.exit(1));
