module.exports = function getUncoveredLines(path) {
  const coverageJson = require(path);

  return Object.keys(coverageJson)
    .map(key => ({
      file: key,
      coverage: coverageJson[key]
    }))
    .map(({ file, coverage: { statementMap, s } }) => {
      let uncoveredLines = Object.keys(statementMap)
        .filter(statementId => s[statementId] === 0)
        .map(statementId => statementMap[statementId].start.line);

      return { file, uncoveredLines };
    })
    .filter(({ uncoveredLines }) => uncoveredLines.length > 0);
};
