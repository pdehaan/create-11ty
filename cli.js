#!/usr/bin/env node

const cp = require("child_process");
const fs = require("fs");
const path = require("path");

const arg = require("arg");
const { Liquid } = require("liquidjs");

const args = new arg({
  "--name": String
});

const globals = {
  name: args["--name"],
};

const engine = new Liquid({globals});

const files = ["package.json", ".eleventy.js"];

for (const file of files) {
  const $template = path.join(__dirname, `${file}.liquid`);
  const $file = fs.readFileSync($template).toString();
  const output = engine.parseAndRenderSync($file);
  fs.writeFileSync(file, output.toString());
}

cp.execSync("npm init -y");

console.info("Done!");
