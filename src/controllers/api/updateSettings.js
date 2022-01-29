const { updateRules } = require("../../modules/updateRules");
const { readFile, writeFile } = require("../../utils/promisify");

module.exports = async (req, res) => {
  try {
    const settings = JSON.parse(await readFile("src/store/rules/rules.json"));
    let { network, level, currency, bid, status, name, ability, ability2 } =
      req.body;
    let prevAbility = JSON.parse(
      await readFile("src/store/rules/preview.json")
    );

    if (req.body.method === "add") {
      if (!prevAbility[level]) prevAbility[level] = [];

      const previw = {
        network,
        level,
        currency,
        bid,
        status,
        name:
          name +
          (!name.includes("(ability2") ? ` (ability2: ${ability2})` : ""),
        ability,
      };

      prevAbility[level].push(previw);
      console.log('Новое правило ' + previw + ' добавлено')

      await writeFile(
        "src/store/rules/preview.json",
        JSON.stringify(prevAbility)
      );
    } else {
      prevAbility[level] = prevAbility[level].filter((el) => {
        return !(
          el.network === network &&
          el.level === level &&
          el.currency === currency &&
          el.bid === bid &&
          el.status === status &&
          el.name == name &&
          el.ability == ability
        );
      });

      await writeFile(
        "src/store/rules/preview.json",
        JSON.stringify(prevAbility)
      );
    }
    updateRules(prevAbility);
    res.json(req.body);
  } catch (error) {
    res.status(500).json({});
    console.log(error);
  }
};
