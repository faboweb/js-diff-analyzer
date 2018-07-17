#! /usr/bin/env node
const cli = require("cli");
const uncovered = require("./uncovered.js");

cli.parse({
  projectRootFolder: ["r", "Path of the project being tested", "file", "./"],
  coveragePath: ["c", "Path of the coverage-final.json", "file"],
  referenceBranch: [
    "b",
    "Name of the reference branch",
    "string",
    "origin/develop"
  ]
});

cli.main(async function(args, options) {
  if (!options.projectRootFolder) {
    cli.fatal("You have to provide the root folder of the project: '-p PATH'");
    return;
  }
  if (!options.coveragePath) {
    cli.fatal(
      "You have to provide the path to the coverage-final.json output by istanbul: '-c PATH'"
    );
    return;
  }
  await uncovered(options);
});
