const { getTime } = require("./getTime");
const { networkDefinition } = require("./networkDefinition");

const increaseProperties = (tournament) => {
  const name = tournament["@name"]?.toLowerCase();
  const network = networkDefinition(tournament["@network"]);
  const stake = Number(tournament["@stake"] ?? 0);
  const rake = Number(tournament["@rake"] ?? 0);
  const bid = (stake + rake).toFixed(2);

  //Фикс гарантии для WPN и 888Poker
  if (network === "WPN" || network === "888") {
    const $ = tournament["@name"].split("$");
    if ($.length > 1)
      tournament["@guarantee"] = $[1].split(" ")[0].replace(")", "").replace(",", "");
  }

  const prizepool = Math.round(
    Math.max(
      Number(tournament["@guarantee"] ?? 0),
      Number(tournament["@prizePool"] ?? 0),
      Number(tournament["@entrants"] ?? 0) * Number(tournament["@stake"] ?? 0),
      Number(tournament["@totalEntrants"] ?? 0) * Number(tournament["@stake"] ?? 0),
    )
  );

  const rebuy =
    network === "888" ? name?.includes("r&a") : tournament["@flags"]?.includes("R");

  return {
    ...tournament,
    "@bid": bid,
    "@turbo": tournament["@flags"]?.includes("T") || name?.includes("turbo"),
    "@rebuy": rebuy,
    "@od": tournament["@flags"]?.includes("OD"),
    "@bounty": tournament["@flags"]?.includes("B"),
    "@sng": tournament["@gameClass"]?.includes("sng"),
    "@deepstack": tournament["@flags"]?.includes("D"),
    "@superturbo": tournament["@flags"]?.includes("ST"),
    "@prizepool": prizepool > 0 ? prizepool : "-",
    "@network": network,
    "@duration": tournament["@duration"] ? getTime(tournament["@duration"]) : "-",
  }
};

module.exports = { increaseProperties };
