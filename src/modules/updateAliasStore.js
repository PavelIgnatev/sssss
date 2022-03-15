const { writeFile, readFile } = require("../utils/promisify");

async function updateAliasStore(alias) {
  const aliases = JSON.parse(await readFile("src/store/alias/alias.json"));

  if (!aliases[alias]) {
    aliases[alias] = {};
  }

  await writeFile("src/store/alias/alias.json", JSON.stringify(aliases));
}

module.exports = { updateAliasStore };
