const { filterLevelByRules } = require("./filterLevelByRules");
const { filterLevelByWord } = require("./filterLevelByWord");

const filterLevelByAbility = async (level, item) => {
  const name = item["@name"].toLowerCase(),
    network = item["@network"],
    abilityBid =
      item["@abilityBid"] === "-" ? "-" : Number(item["@abilityBid"]),
    ability = item["@ability"] === "-" ? "-" : Number(item["@ability"]);

  if (filterLevelByWord(network, name)) return false;

  if (
    ability === "-" ||
    abilityBid === "-" ||
    item["@rebuy"] ||
    item["@sng"] ||
    item["@od"] ||
    item["@superturbo"] ||
    item["@structure"] !== "NL" ||
    (item["@game"] !== "H" && item["@game"] !== "H6") ||
    ability > abilityBid
  ) {
    return filterLevelByRules(level, item);
  }
  return ability <= abilityBid;
};

module.exports = {
  filterLevelByAbility,
};
