const path = require("path");
const { readFile } = require("../../utils/promisify");

module.exports = async (req, res) => {
  res.json(JSON.parse(await readFile("src/store/rules/preview.json")));
};
