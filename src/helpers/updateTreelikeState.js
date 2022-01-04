const { readFile, writeFile } = require("../utils/promisify");
const { getRealTime } = require("./getRealTime");

const updateTreelikeState = async () => {
  try {
    const state = JSON.parse(await readFile("src/state/state.json"));
    const obj = {};

    Object.values(state).forEach((tournamentsByDay) => {
      Object.values(tournamentsByDay).forEach((tournament) => {
        const ability = tournament["@avability"];
        const duration = tournament["@duration"];
        const name = tournament["@name"]?.toLowerCase();
        let network = tournament["@network"];
        const stake = Number(tournament["@stake"] ?? 0);
        const rake = Number(tournament["@rake"] ?? 0);
        const bid = (stake + rake).toFixed(2);
        const time = getRealTime(Number(`${tournament["@date"]}000`));

        if (!name || !network || !bid || !time) {
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

        if (!obj[network]) obj[network] = {};
        if (!obj[network][time]) obj[network][time] = {};
        if (!obj[network][time][bid]) obj[network][time][bid] = {};
        if (!obj[network][time][bid][name])
          obj[network][time][bid][name] = { "@avability": [], "@duration": [] };

        const abilities = obj[network][time][bid][name]["@avability"];
        const durations = obj[network][time][bid][name]["@duration"];

        if (ability && abilities.length < 30) abilities.push(ability);
        if (duration && durations.length < 30) durations.push(duration);
      });
    });

    Object.keys(obj).forEach((day) => {
      Object.keys(obj[day]).forEach((time) => {
        Object.keys(obj[day][time]).forEach((bid) => {
          Object.keys(obj[day][time][bid]).forEach((name) => {
            Object.keys(obj[day][time][bid][name]).forEach((info) => {
              const values = obj[day][time][bid][name][info];
              const length = values.length || 1;

              obj[day][time][bid][name][info] = Math.round(
                Number(values.reduce((r, i) => r + Number(i), 0) / length)
              );
            });
          });
        });
      });
    });

    await writeFile("src/state/treelikeState.json", JSON.stringify(obj));
  } catch (error) {
    console.log(error);
  }
};

module.exports = { updateTreelikeState };
