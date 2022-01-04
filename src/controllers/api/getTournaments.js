const { api } = require("../../api");
const { filterLevelByAbility } = require("../../helpers/filterLevelByAbility");
const { getDate } = require("../../helpers/getDate");
const { getTime } = require("../../helpers/getTime");
const { startDay } = require("../../helpers/startDay");
const { readFile } = require("../../utils/promisify");
const { getRealTime } = require("../../helpers/getRealTime");

module.exports = async (req, res) => {
  try {
    const networks = req.query.networks;
    const time = req.query.time;
    const isB = req.query.onlyKO == "true" ? "B," : "";
    const isT = req.query.onlyTurbo == "true" ? "T" : "";
    const isNotB = req.query.onlyFreezout == "true" ? "B," : "";
    const isNotT = req.query.onlyNormal == "true" ? "T" : "";
    const moneyStart = req.query.moneyStart;
    const moneyEnd = req.query.moneyEnd;
    const level = req.query.level;
    const timezone = req.query.timezone;

    const treelikeState = JSON.parse(
      await readFile("src/state/treelikeState.json")
    );
    const stateAbility = JSON.parse(
      await readFile("src/state/stateByLevel.json")
    );
    const gaps = JSON.parse(await readFile("src/state/gap.json"));
    const settings = JSON.parse(await readFile("src/state/settings.json"));

    console.log("Начинаю делать запрос");
    let result = (
      await api.get(
        `https://www.sharkscope.com/api/pocarrleaderboard/networks/${networks}/activeTournaments?filter=Date!:${time}S;Type:NL,H;Type!:SAT;Class:SCHEDULED,SNG;`
      )
    ).RegisteringTournamentsResponse;
    console.log("Сделал запрос");

    if (!result) {
      return res.json([]);
    }

    result = Array.from(result.RegisteringTournaments.RegisteringTournament);

    const asyncFilter = async (arr, predicate) => {
      const results = await Promise.all(arr?.map(predicate) ?? []);

      return arr?.filter((_v, index) => results[index]);
    };

    result = result
      .sort(
        (a, b) =>
          (a["@scheduledStartDate"] ?? 0) - (b["@scheduledStartDate"] ?? 0)
      )
      .map((item) => {
        let network = item["@network"];
        const name = item["@name"]?.toLowerCase();
        const stake = Number(item["@stake"] ?? 0);
        const rake = Number(item["@rake"] ?? 0);
        const bid = (stake + rake).toFixed(2);
        const isStartDate = item["@scheduledStartDate"] ?? 0;
        const isRegDate = item["@lateRegEndDate"] ?? 0;
        const startDate = Number(isStartDate * 1000) + Number(timezone);
        const regDate = Number(isRegDate * 1000) + Number(timezone);
        const time = getRealTime(Number(`${isStartDate}000`));
        const bounty = item["@flags"]?.includes("B");
        const turbo =
          (item["@flags"]?.includes("T") ||
            name?.includes("turbo") ||
            name?.includes("hot")) &&
          !item["@flags"]?.includes("ST");
        const superturbo = item["@flags"]?.includes("ST");
        const status = `${bounty ? "KO" : "!KO"}${
          superturbo ? "SuperTurbo" : turbo ? "Turbo" : "Normal"
        }`;
        const currency = item["@currency"];
        const od = item["@flags"]?.includes("OD");
        const sng = item["@gameClass"]?.includes("sng");
        const isNL = item["@structure"] === "NL";
        const isH = item["@game"] === "H" || item["@game"] === "H6";
        const rebuy =
          network === "888Poker"
            ? name?.includes("r&a")
            : item["@flags"]?.includes("R");

        switch (network) {
          case "PokerStars(FR-ES-PT)": {
            network = "PS.es";
            break;
          }
          case "PokerStars": {
            network = "PS.eu";
            break;
          }
          case "PartyPoker": {
            network = "Party";
            break;
          }
          case "GGNetwork": {
            network = "GG";
            break;
          }
          case "888Poker": {
            network = "888";
            break;
          }
          case "Winamax.fr": {
            network = "WNMX";
            break;
          }
        }

        const isAdekvat = isNL && isH && !rebuy && !od && !sng && !superturbo;
        const info = treelikeState?.[network]?.[time]?.[bid]?.[name];
        const ability = isAdekvat && info?.["@avability"];
        const duration = info?.["@duration"]
          ? Math.round(info?.["@duration"])
          : null;
        const statusGap = `${turbo ? "turbo" : "normal"}`;
        const gap = gaps?.[level]?.[network]?.[statusGap]?.[bid];
        const realBid = gap ? gap : bid;
        const abilityBid =
          stateAbility[timezone]?.[network]?.[level]?.[currency]?.[realBid]?.[
            status
          ];

        //Фикс гарантии для WPN и 888Poker
        if (network === "WPN" || network === "888") {
          const $ = item["@name"].split("$");
          if ($.length > 1)
            item["@guarantee"] = $[1]
              .split(" ")[0]
              .replace(")", "")
              .replace(",", "");
        }

        const prizepool = Math.round(
          Math.max(
            Number(item["@guarantee"] ?? 0),
            Number(item["@totalEntrants"] ?? 0) * Number(item["@stake"] ?? 0)
          )
        );

        return {
          ...item,
          "@bid": bid,
          "@realBid": realBid,
          "@turbo": turbo,
          "@rebuy": rebuy,
          "@od": item["@flags"]?.includes("OD"),
          "@bounty": bounty,
          "@sng": item["@gameClass"]?.includes("sng"),
          "@deepstack": item["@flags"]?.includes("D"),
          "@superturbo": item["@flags"]?.includes("ST"),
          "@prizepool": prizepool > 0 ? prizepool : "-",
          "@network": network,
          "@ability": ability ? Number(ability) : "-",
          "@abilityBid": abilityBid
            ? Number(abilityBid) +
              Number(
                settings[network]?.[level]?.[currency]?.[realBid]?.[status]?.[
                  name
                ] ?? 0
              )
            : "-",
          "@duration": duration ? getTime(duration) : "-",
          "@startDay": isStartDate ? startDay(startDate) : "-",
          "@scheduledStartDate": isStartDate ? getDate(startDate) : "-",
          "@lateRegEndDate": isRegDate ? getDate(regDate) : "-",
          "@timezone": timezone,
          "@status": status,
          "@level": level,
        };
      });

    console.log("Промапил данные");
    console.log(result.length);
    result = await asyncFilter(result, async (tournament) => {
      const name = tournament["@name"]?.toLowerCase();
      const bounty = tournament["@flags"]?.includes("B");
      const turbo = tournament["@turbo"];

      const status = await filterLevelByAbility(level, tournament);
      return (
        tournament["@bid"] >= Number(moneyStart) &&
        tournament["@bid"] <= Number(moneyEnd) &&
        (isB ? bounty : true) &&
        (isT ? turbo : true) &&
        (isNotB ? !bounty : true) &&
        (isNotT ? !turbo : true) &&
        status
      );
    });
    return res.json(result ?? []);
  } catch (err) {
    console.log(err);
    res.status(500).json([]);
  }
};
