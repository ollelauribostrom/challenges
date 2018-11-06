const fs = require('fs');
const path = require('path');
const results = require('../data/results.json');

function updateResults(username) {
  if (!results.challenges[challenge].completed.includes(username)) {
    results.challenges[challenge].completed.push(username);
  } else {
    return;
  }
  if (!results.challenges[challenge].first || results.challenges[challenge].first === '') {
    results.challenges[challenge].first = username;
    return;
  }
  if (!results.challenges[challenge].second || results.challenges[challenge].second === '') {
    results.challenges[challenge].second = username;
    return;
  }
  if (!results.challenges[challenge].third || results.challenges[challenge].third === '') {
    results.challenges[challenge].third = username;
  }
}

function generateLeaderboard() {
  const scores = {};
  Object.values(results.challenges).forEach(challenge => {
    challenge.completed.forEach(username => {
      if (scores[username]) {
        scores[username].points += 1;
        scores[username].completed += 1;
      } else {
        scores[username] = { points: 1, completed: 1 };
      }
    });
    if (challenge.first) {
      scores[challenge.first].points += 3;
    }
    if (challenge.second) {
      scores[challenge.second].points += 2;
    }
    if (challenge.third) {
      scores[challenge.third].points += 1;
    }
  });
  const header1 = '| Username | Completed Challenges | Points  |\n';
  const header2 = '|:--------:|:--------------------:|:-------:|\n';
  const rows = Object.keys(scores)
    .sort((a, b) => scores[b].points - scores[a].points)
    .map(username => {
      const { completed, points } = scores[username];
      return `| ${username} | ${completed} | ${points} |`;
    })
    .join('\n');
  return `${header1}${header2}${rows}`;
}

function updateLeaderboardReadme() {
  const challenges = Object.keys(results.challenges).map(
    challenge => `- [Challenge ${challenge}](${challenge}/)`
  );
  const leaderBoard = generateLeaderboard();
  const md = `# Challenges\n\n${challenges.join('\n')}\n\n### Highscore\n${leaderBoard}`;
  fs.writeFileSync(path.join(__dirname, '../challenges/README.md'), md);
}

function updateChallengeReadme(username, challenge, date) {
  if (!results.challenges[challenge].completed.includes(username)) {
    const md = `\n- [${username}](https://github.com/${username}) - ${date}`;
    fs.appendFileSync(path.join(__dirname, `../challenges/${challenge}/README.md`), md);
  }
}

const username = process.argv[2];
const challenge = process.argv[3];
const date = process.argv[4];

if (!username || !challenge || !date) {
  throw new Error('Missing needed information');
}

updateChallengeReadme(username, challenge, date);
updateResults(username);
updateLeaderboardReadme();
fs.writeFileSync(path.join(__dirname, '../data/results.json'), JSON.stringify(results, null, 2));
