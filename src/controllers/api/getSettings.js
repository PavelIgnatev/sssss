const { readFile } = require("../../utils/promisify");

module.exports = async (req, res) => {
  try {
    const settings = JSON.parse(await readFile("src/state/prevAbility.json"));

    res.json(settings);
  } catch (error) {
    console.log(error);
  }
};
