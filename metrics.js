// for JavaScript
const { analyze } = require("sonarjs")

function log(message) {
  console.log(message)
}

function onStart() {
  console.log("Analysis is started")
}

function onEnd() {
  console.log("Analysis is finished")
}

async function runSonarJS() {
  const issues = await analyze("./", { log, onStart, onEnd })
  // ...
}

runSonarJS()
