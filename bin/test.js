const getBranch = require('git-branch').sync;
const getUsername = require('git-username');
const jest = require('jest');

function setTestFilePath() {
  let path;
  const slug = process.env.TRAVIS_PULL_REQUEST_SLUG;
  if (slug && slug !== '') {
    [path] = process.env.TRAVIS_PULL_REQUEST_SLUG.split('/');
  }
  process.env.TESTPATH = path || getUsername();
}

function getChallengePath() {
  return process.env.TRAVIS_PULL_REQUEST_BRANCH || getBranch();
}

setTestFilePath();

jest
  .runCLI({ roots: [`challenges/${getChallengePath()}`] }, [__dirname])
  .then(({ results }) => process.exit(results.success ? 0 : 1))
  .catch(() => process.exit(1));
