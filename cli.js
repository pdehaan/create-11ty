#!/usr/bin/env node

const cp = require("child_process");
const fs = require("fs");
const path = require("path");

const arg = require("arg");
const fixpack = require("fixpack");
const globby = require("globby");
const { Liquid } = require("liquidjs");
const mkdirp = require("mkdirp");

const cfg = require("./package.json").cfg;

const args = new arg({
  "--name": String
});

const globals = {
  name: args["--name"],
  ...cfg
};

if (!globals.name && args._.length) {
  globals.name = args._[0];
}

const files = globby.sync(path.join(__dirname, "template"), { dot: true });
console.log(files);
console.log(globals);

// makeDirs([
//   "src/pages"
// ]);
makeFiles(files);

// Run `npm init -y` to inject user-specific author name, license, etc.
cp.execSync("npm init -y");
// Prettify package.json.
fixpack("./package.json");

function makeDirs(dirs = []) {
  for (const dir of dirs) {
    mkdirp.sync(dir);
  }
}

function makeFiles(files = [], engine = new Liquid({globals})) {
  for (const file of files) {
    const content = fs.readFileSync(file).toString();
    const output = engine.parseAndRenderSync(content);
    const outputFile = file.replace("template/", "./");
    fs.writeFileSync(outputFile, output);
  }
}
