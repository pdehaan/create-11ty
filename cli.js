#!/usr/bin/env node

const cp = require("child_process");
const path = require("path");

const arg = require("arg");
const fs = require("fs-extra");
const fixpack = require("fixpack");
const globby = require("globby").sync;
const { Liquid } = require("liquidjs");

const cfg = require("./package.json").cfg;

const TEMPLATE_DIR = path.join(__dirname, "template");

const config = getConfig();
const liquid = new Liquid({ globals: config });

makeDirs([
  config.dir.input
]);
makeFiles();

// Run `npm init -y` to inject user-specific author name, license, etc.
cp.execSync("npm init -y");
// Prettify package.json.
fixpack("./package.json");

function makeDirs(dirs = []) {
  for (const dir of dirs) {
    console.log(`Making ${dir}...`);
    fs.mkdirpSync(dir);
  }
}

function getFiles(templatePath = TEMPLATE_DIR) {
  return globby(templatePath, { dot: true });
}

function makeFiles(files = getFiles(), engine = liquid) {
  for (const file of files) {
    const content = fs.readFileSync(file).toString();
    const output = engine.parseAndRenderSync(content);
    const outputFile = file.replace(`${TEMPLATE_DIR}/`, "");
    fs.ensureDirSync(path.dirname(outputFile));
    fs.writeFileSync(outputFile, output);
  }
  // NOTE: For some reason the nested .gitignore file is getting
  // "lost" when installing via npx. This workaround just renames
  // the file after the folder recreation is done.
  fs.renameSync(".gitignore.txt", ".gitignore");
}

function getConfig() {
  const args = new arg({
    "--name": String,
    "--input": String,
    "--output": String,
    // Aliases
    "-n": "--name",
    "-i": "--input",
    "-o": "--output",
  });
  
  return {
    name: args["--name"] || args._[0],
    dir: {
      input: args["--input"] || cfg.dir.input,
      output: args["--output"] || cfg.dir.output
    }
  };
}
