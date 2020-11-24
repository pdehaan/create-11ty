#!/usr/bin/env node

const fs = require("fs");
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



console.log(">>", globals);

for (const file of files) {
  const $file = fs.readFileSync(`${file}.liquid`).toString();
  const output = engine.parseAndRenderSync($file);
  fs.writeFileSync(file, output.toString());
}

// engine
//     .parseAndRenderSync('{{name | capitalize}}', {name: 'alice'})
//     .then(console.log);     // outputs 'Alice'

// fs.writeFileSync("package-s.json", JSON.stringify({name:'nom', devDependencies: {}}, null, 2));

console.info("Done!");
