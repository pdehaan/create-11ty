#!/usr/bin/env node

const cp = require("child_process");
const fs = require("fs");
const path = require("path");

const arg = require("arg");
const fixpack = require("fixpack");
const { Liquid } = require("liquidjs");
const mkdirp = require("mkdirp");

const args = new arg({
  "--name": String
});

const globals = {
  name: args["--name"],
};

if (!globals.name && args._.length) {
  globals.name = args._[0];
}

makeDirs([
  "src/pages"
]);
makeFiles([
  "package.json",
  ".eleventy.js"
]);

cp.execSync("npm init -y");
fixpack("./package.json");

function makeDirs(dirs = []) {
  for (const dir of dirs) {
    mkdirp.sync(dir);
  }
}

function makeFiles(files = [], engine = new Liquid({globals})) {
  for (const file of files) {
    const $template = path.join(__dirname, `${file}.liquid`);
    const $file = fs.readFileSync($template).toString();
    const output = engine.parseAndRenderSync($file);
    fs.writeFileSync(file, output.toString());
  }
}
