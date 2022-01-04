const { readFile, writeFile } = require("../../utils/promisify");

module.exports = async (req, res) => {
  try {
    const settings = JSON.parse(await readFile("src/state/prevAbility.json"));

    res.json(settings);
  } catch (error) {
    const mockSettings = {
      abilityStep: 0,
    };
    await writeFile("src/state/settings.json", JSON.stringify(mockSettings));
    res.json(mockSettings);
    console.log(error);
  }
};
