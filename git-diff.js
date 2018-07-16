const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function getGitBranchDiff(folder) {
  const { stdout, stderr } = await exec(
    "git --no-pager diff origin/develop --unified=0",
    {
      cwd: folder
    }
  );
  process.stderr = stderr;

  return stdout;
}

function getChanges(lines) {
  const changeIndicatorRegex = /@@ (.+) (.+) @@/;
  return lines
    .filter(line => changeIndicatorRegex.test(line))
    .map(line => changeIndicatorRegex.exec(line))
    .map(matches => ({
      removed: matches[1].replace("-", ""),
      added: matches[2].replace("+", "")
    }));
}

function formatChanges(changes) {
  return changes.map(({ removed, added }) => ({
    removed: {
      start: parseInt(removed.split(",")[0]),
      lines: parseInt(removed.split(",")[1] || "1")
    },
    added: {
      start: parseInt(added.split(",")[0]),
      lines: parseInt(added.split(",")[1] || "1")
    }
  }));
}

function getFileDiff(fileRecord) {
  let lines = fileRecord.split("\n"); // lines

  let fileNameRegex = /a\/(.+) b\/.+/;
  let matches = fileNameRegex.exec(lines[0]);
  if (!matches) return null;
  let fileName = matches[1];

  let rawChanges = getChanges(lines);
  return {
    fileName,
    changes: formatChanges(rawChanges)
  };
}

function notEmpty(x) {
  return x !== null && x !== undefined;
}

module.exports = async function(folder) {
  const branchDiff = await getGitBranchDiff(folder);

  return branchDiff
    .split("diff --git ") // each file
    .filter(notEmpty)
    .map(getFileDiff)
    .filter(notEmpty);
};
