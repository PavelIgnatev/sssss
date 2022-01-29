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
      if (!prevAbility[level.split("")[0]])
        prevAbility[level.split("")[0]] = [];
      
      prevAbility[level.split("")[0]].push({
        network,
        level,
        currency,
        bid,
        status,
        name:
          name +
          (!name.includes("(ability2") ? ` (ability2: ${ability2})` : ""),
        ability,
      });

      await writeFile(
        "src/store/rules/preview.json",
        JSON.stringify(prevAbility)
      );

      name = name.split(" (ability2: ")[0];

      if (!settings[network]) settings[network] = {};
      if (!settings[network][level]) settings[network][level] = {};
      if (!settings[network][level][currency])
        settings[network][level][currency] = {};
      if (!settings[network][level][currency][bid])
        settings[network][level][currency][bid] = {};
      if (!settings[network][level][currency][bid][status])
        settings[network][level][currency][bid][status] = {};
      if (!settings[network][level][currency][bid][status])
        settings[network][level][currency][bid][status][name] = {};

      settings[network][level][currency][bid][status][name] = Number(ability);
      if (!prevAbility[level]) prevAbility[level] = [];
    } else {
      prevAbility[level.split("")[0]] = prevAbility[level.split("")[0]].filter(
        (el) => {
          return !(
            el.network === network &&
            el.level === level &&
            el.currency === currency &&
            el.bid === bid &&
            el.status === status &&
            el.name == name
          );
        }
      );

      await writeFile(
        "src/store/rules/preview.json",
        JSON.stringify(prevAbility)
      );

      name = name.split(" (ability2: ")[0];

      try {
        delete settings[network][level][currency][bid][status][name];
      } catch (error) {
        console.log(error);
      }
    }
    await writeFile("src/store/rules/rules.json", JSON.stringify(settings));

    res.json(req.body);
  } catch (error) {
    res.status(500).json({});
    console.log(error);
  }
};
