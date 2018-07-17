const util = require("util");
const exec = util.promisify(require("child_process").exec);
const parseCoverage = require("./parse-coverage");
const path = require("path");

const folder = "/Users/fabo/Development/voyager";
const coverage =
  "/Users/fabo/Development/voyager/test/unit/coverage/coverage-final.json";

const gitDiff = require("./git-diff.js");

function parseChangesRequiringCoverage({ fileName, changes }) {
  const lines = changes
    .filter(({ added }) => added.lines > 0)
    .reduce((all, cur) => {
      let start = cur.added.start;
      let lines = Array(cur.added.lines)
        .fill(1)
        .map((x, i) => i + start);
      return all.concat(lines);
    }, []);

  return { fileName, lines };
}

function getUncoveredChanges(changesRequiringCoverage, uncoveredCode) {
  return changesRequiringCoverage
    .map(({ fileName, lines }) => {
      let file = uncoveredCode.find(({ file }) => file === fileName);
      if (!file) {
        // console.error("No coverage for file " + fileName + " found")
        return;
      }

      let uncoveredChanges = file.uncoveredLines.filter(lineNumber =>
        lines.find(x => parseInt(lineNumber) === x)
      );

      return { fileName, uncoveredChanges };
    })
    .filter(x => !!x)
    .filter(({ uncoveredChanges }) => uncoveredChanges.length > 0);
}

module.exports = async function main({ referenceBranch, projectRootFolder }) {
  const changes = await gitDiff(projectRootFolder, referenceBranch);
  const changesRequiringCoverage = changes
    .map(parseChangesRequiringCoverage)
    .filter(({ lines }) => lines.length > 0);

  const uncoveredCode = parseCoverage(coverage).map(
    ({ file, uncoveredLines }) => ({
      file: path.relative(folder, file),
      uncoveredLines
    })
  );
  let uncoveredRecords = getUncoveredChanges(
    changesRequiringCoverage,
    uncoveredCode
  );

  if (uncoveredRecords.length > 0) {
    console.error("Changes on your branch are not covered:");
    uncoveredRecords.forEach(({ fileName, uncoveredChanges }) => {
      console.log(fileName, "(Lines:", uncoveredChanges.join(", "), ")");
    });
    process.exit(1);
  }
  process.exit(0);
};
