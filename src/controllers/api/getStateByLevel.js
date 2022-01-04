const { readFile } = require("../../utils/promisify");

module.exports = async (req, res) => {
  const stateByLevel = JSON.parse(await readFile("src/state/stateByLevel.json"))['0'];
  res.json(stateByLevel);
};
