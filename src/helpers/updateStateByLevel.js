const { readFile, writeFile } = require("../utils/promisify");
const { startDay } = require("./startDay");
const {
  filterLevelByRulesWithoutBrown,
} = require("./filterLevelByRulesWithoutBrown");
const { getDate } = require("./getDate");
const { getTime } = require("./getTime");
const updateStateByLevel = async () => {
  const levels = [ "7A", "7B"];
  const state = JSON.parse(await readFile("src/state/filtredState.json"));
  const gaps = JSON.parse(await readFile("src/state/gap.json"));

  const newState = [];

  // const timezones = [
  //   "-10800000",
  //   "-46800000",
  //   "-39600000",
  //   "-36000000",
  //   "-32400000",
  //   "-28800000",
  //   "-25200000",
  //   "-23400000",
  //   "-21600000",
  //   "-18000000",
  //   "-7200000",
  //   "-3600000",
  //   "0",
  //   "9000000",
  //   "18000000",
  //   "21600000",
  //   "23400000",
  //   "25200000",
  // ];

  const timezones = ["0"];
  Object.values(state).forEach((arr) => {
    Object.values(arr).forEach((item) => {
      let network = item["@network"];
      const stake = Number(item["@stake"] ?? 0);
      const rake = Number(item["@rake"] ?? 0);
      const bid = (stake + rake).toFixed(2);
      const name = item["@name"]?.toLowerCase();

      if (!name || !network || !bid) {
        return;
      }

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
          Number(item["@prizePool"] ?? 0),
          Number(item["@entrants"] ?? 0) * Number(item["@stake"] ?? 0)
        )
      );

      const rebuy =
        network === "888"
          ? name?.includes("r&a")
          : item["@flags"]?.includes("R");

      newState.push({
        ...item,
        "@bid": bid,
        "@turbo": item["@flags"]?.includes("T") || name?.includes("turbo"),
        "@rebuy": rebuy,
        "@od": item["@flags"]?.includes("OD"),
        "@bounty": item["@flags"]?.includes("B"),
        "@sng": item["@gameClass"]?.includes("sng"),
        "@deepstack": item["@flags"]?.includes("D"),
        "@superturbo": item["@flags"]?.includes("ST"),
        "@prizepool": prizepool > 0 ? prizepool : "-",
        "@network": network,
        "@duration": item["@duration"] ? getTime(item["@duration"]) : "-",
      });
    });
  });

  const obj = {};
  const obj2 = {};

  timezones.forEach((timezone) => {
    levels.forEach((level) => {
      newState.forEach((tournament) => {
        const isStartDate = tournament["@date"] ?? 0;
        const startDate = Number(isStartDate * 1000) + Number(timezone);
        tournament["@startDay"] = isStartDate ? startDay(startDate) : "-";

        let bid = tournament["@bid"];
        const avability = tournament["@avability"];
        const network = tournament["@network"];
        const turbo = tournament["@turbo"];
        const statusGap = `${turbo ? "turbo" : "normal"}`;
        const gap = gaps?.[level]?.[network]?.[statusGap]?.[bid];
        const KO = tournament["@bounty"];
        const superturbo = tournament["@flags"]?.includes("ST");
        const status = `${KO ? "KO" : "!KO"}${
          superturbo ? "SuperTurbo" : turbo ? "Turbo" : "Normal"
        }`;
        const name = tournament["@name"]?.toLowerCase();
        if (
          (tournament["@bid"] && !avability) ||
          !tournament["@currency"] ||
          !name
        ) {
          return;
        }

        const currency = tournament["@currency"];

        if (gap) {
          bid = gap;
        }

        if (filterLevelByRulesWithoutBrown(level, tournament)) {
          if (!obj[timezone]) obj[timezone] = {};
          if (!obj[timezone][network]) obj[timezone][network] = {};
          if (!obj[timezone][network][level])
            obj[timezone][network][level] = {};
          if (!obj[timezone][network][level])
            obj[timezone][network][level] = {};
          if (!obj[timezone][network][level][currency])
            obj[timezone][network][level][currency] = {};
          if (!obj[timezone][network][level][currency][bid])
            obj[timezone][network][level][currency][bid] = {};
          if (!obj[timezone][network][level][currency][bid][status])
            obj[timezone][network][level][currency][bid][status] = {};
          if (!obj[timezone][network][level][currency][bid][status][name])
            obj[timezone][network][level][currency][bid][status][name] = [];

          if (currency === undefined) {
            console.log(tournament);
          }
          const result = {
            "@scheduledStartDate": isStartDate ? getDate(startDate) : "-",
            ...tournament,
          };
          delete result["@date"];
          delete result["@currency"];
          delete result["@combinedavroi"];
          delete result["@entrants"];
          delete result["@game"];
          delete result["@id"];
          delete result["@rake"];
          delete result["@reEntries"];
          delete result["@region"];
          delete result["@stake"];
          delete result["@structure"];
          delete result["@turbo"];
          delete result["@superturbo"];
          delete result["@deepstack"];
          delete result["@prizePool"];
          delete result["@rebuy"];
          delete result["@od"];
          delete result["@bounty"];
          delete result["@startDay"];
          delete result["@rebuy"];
          delete result["@sng"];
          obj[timezone][network][level][currency][bid][status][name].push(
            result
          );
        }

        if (!obj2[timezone]) obj2[timezone] = {};
        if (!obj2[timezone][network]) obj2[timezone][network] = {};
        if (!obj2[timezone][network][level])
          obj2[timezone][network][level] = {};
        if (!obj2[timezone][network][level])
          obj2[timezone][network][level] = {};
        if (!obj2[timezone][network][level][currency])
          obj2[timezone][network][level][currency] = {};
        if (!obj2[timezone][network][level][currency][bid])
          obj2[timezone][network][level][currency][bid] = {};
        if (!obj2[timezone][network][level][currency][bid][status])
          obj2[timezone][network][level][currency][bid][status] = {};
        if (!obj2[timezone][network][level][currency][bid][status][name])
          obj2[timezone][network][level][currency][bid][status][name] = 0;
      });
    });
  });

  Object.keys(obj).forEach((timezone) => {
    Object.keys(obj[timezone]).forEach((network) => {
      Object.keys(obj[timezone][network]).forEach((level) => {
        Object.keys(obj[timezone][network][level]).forEach((currency) => {
          Object.keys(obj[timezone][network][level][currency]).forEach(
            (bid) => {
              Object.keys(obj[timezone][network][level][currency][bid]).forEach(
                (status) => {
                  let result = [];

                  Object.keys(
                    obj[timezone][network][level][currency][bid][status]
                  ).forEach((name) => {
                    const values =
                      obj[timezone][network][level][currency][bid][status][
                        name
                      ];
                    const length = values?.length;

                    if (length >= 3) {
                      result = result.concat(values);
                    }
                  });

                  obj[timezone][network][level][currency][bid][status] = result;
                }
              );
            }
          );
        });
      });
    });
  });

  await writeFile("src/state/stateByLevelWithoutSum.json", JSON.stringify(obj));

  Object.keys(obj).forEach((timezone) => {
    Object.keys(obj[timezone]).forEach((network) => {
      Object.keys(obj[timezone][network]).forEach((level) => {
        Object.keys(obj[timezone][network][level]).forEach((currency) => {
          Object.keys(obj[timezone][network][level][currency]).forEach(
            (bid) => {
              Object.keys(obj[timezone][network][level][currency][bid]).forEach(
                (status) => {
                  const values =
                    obj[timezone][network][level][currency][bid][status];
                  const length = values?.length || 1;
                  const ability2 = Math.round(
                    Number(
                      values.reduce((r, i) => r + Number(i["@avability"]), 0) /
                        length
                    )
                  );

                  if (ability2) {
                    obj[timezone][network][level][currency][bid][status] =
                      ability2;
                  } else {
                    delete obj[timezone][network][level][currency][bid][status];
                    if (
                      !Object.keys(obj[timezone][network][level][currency][bid])
                        .length
                    ) {
                      delete obj[timezone][network][level][currency][bid];
                      if (
                        !Object.keys(obj[timezone][network][level][currency])
                          .length
                      ) {
                        delete obj[timezone][network][level][currency];
                      }
                    }
                  }
                }
              );
            }
          );
        });
      });
    });
  });
  await writeFile("src/state/stateByLevel.json", JSON.stringify(obj));

  Object.keys(obj2).forEach((timezone) => {
    Object.keys(obj2[timezone]).forEach((network) => {
      Object.keys(obj2[timezone][network]).forEach((level) => {
        Object.keys(obj2[timezone][network][level]).forEach((currency) => {
          Object.keys(obj2[timezone][network][level][currency]).forEach(
            (bid) => {
              Object.keys(
                obj2[timezone][network][level][currency][bid]
              ).forEach((status) => {
                const abilityBid =
                  obj?.[timezone]?.[network]?.[level]?.[currency]?.[bid]?.[
                    status
                  ];
                if (!abilityBid) {
                  console.log([timezone], [network], [level], [currency], [bid], [status])
                  delete obj2[timezone][network][level][currency][bid][status];

                  if (
                    !Object.keys(obj2[timezone][network][level][currency][bid])
                      .length
                  ) {
                    delete obj2[timezone][network][level][currency][bid];
                  }
                }
              });
            }
          );
        });
      });
    });
  });
  await writeFile("src/state/st.json", JSON.stringify(obj2));
};

module.exports = {
  updateStateByLevel,
};
