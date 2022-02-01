const { writeFile } = require("../utils/promisify");

async function updateRules(preview) {
  const settings = {};

  const levels = Object.keys(preview);
  levels.forEach((level) => {
    preview[level].forEach((tournament) => {
      let { network, level, currency, bid, status, name, ability } = tournament;
      name = name.split(' (A1:')[0].split(' (A2: ')[0]
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
    });
  });
  await writeFile("src/store/rules/rules.json", JSON.stringify(settings));
}
module.exports = { updateRules };
