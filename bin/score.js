const fs = require('fs');
const path = require('path');
const results = require('../data/results.json');

function getNewSolutions() {
  const solutions = [];
  Object.keys(results.challenges).forEach(challenge => {
    const challengePath = path.join(__dirname, `../challenges/${challenge}`);
    fs.readdirSync(challengePath).forEach(file => {
      const isDirectory = fs.lstatSync(path.join(challengePath, file)).isDirectory();
      if (file === 'tests' || !isDirectory) {
        return;
      }
      if (!results.challenges[challenge].completed.includes(file)) {
        solutions.push({ challenge, username: file, challengePath });
      }
    });
  });
  return solutions;
}

function addSolutionToChallengeReadme({ username, challengePath }) {
  const date = process.argv[2];
  const md = `\n- [${username}](https://github.com/${username}) - ${date}`;
  fs.appendFileSync(path.join(challengePath, 'README.md'), md);
}

function updateResults(solution) {
  const challenge = results.challenges[solution.challenge];
  challenge.completed.push(solution.username);
  if (!challenge.first || challenge.first === '') {
    challenge.first = solution.username;
  } else if (!challenge.second || challenge.second === '') {
    challenge.second = solution.username;
  } else if (!challenge.third || challenge.third === '') {
    challenge.third = solution.username;
  }
}

function generateHighscoreTable() {
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
    } else if (challenge.second) {
      scores[challenge.second].points += 2;
    } else if (challenge.third) {
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

function updateHighscoreReadme() {
  const challenges = Object.keys(results.challenges).map(
    challenge => `- [Challenge ${challenge}](${challenge}/)`
  );
  const table = generateHighscoreTable();
  const md = `# Challenges\n\n${challenges.join('\n')}\n\n### Highscore\n${table}`;
  fs.writeFileSync(path.join(__dirname, '../challenges/README.md'), md);
}

// Get all new solutions that have not yet been saved to data/results.json
const newSolutions = getNewSolutions();

// Add each new solution to the respective challenge README.md and to results
newSolutions.forEach(solution => {
  addSolutionToChallengeReadme(solution);
  updateResults(solution);
});

// Update the highscore readme based on the new results
updateHighscoreReadme();

// Write new results to data/results.json
fs.writeFileSync(path.join(__dirname, '../data/results.json'), JSON.stringify(results, null, 2));
