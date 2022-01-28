const { readFile, writeFile } = require("../../utils/promisify");

module.exports = async (req, res) => {
  try {
    const settings = JSON.parse(await readFile("src/state/settings.json"));
    let { network, level, currency, bid, status, name, ability } = req.body;
    let prevAbility = JSON.parse(await readFile("src/state/prevAbility.json"));

    if (req.body.method === "add") {
      if(prevAbility[level]) prevAbility[level] = []
      prevAbility[level].push({
        network,
        level,
        currency,
        bid,
        status,
        name,
        ability,
      });

      await writeFile(
        "src/state/prevAbility.json",
        JSON.stringify(prevAbility)
      );

      name = name.split('    (')[0]

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
      try {
        delete settings[network][level][currency][bid][status][name];
      } catch (error) {
        console.log(error);
      }

      prevAbility[level] = prevAbility[level].filter((el) => {
        return !(
          el.network === network &&
          el.level === level &&
          el.currency === currency &&
          el.bid === bid &&
          el.status === status &&
          el.name == name
        );
      });

      await writeFile(
        "src/state/prevAbility.json",
        JSON.stringify(prevAbility)
      );
    }
    await writeFile("src/state/settings.json", JSON.stringify(settings));

    res.json(req.body);
  } catch (error) {
    res.status(500).json({});
    console.log(error);
  }
};
