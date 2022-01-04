const { api } = require("../api");
const { writeFile, readFile } = require("../utils/promisify");
const { filterLevelByWord } = require("./filterLevelByWord");

async function updateState() {
  try {
    const prevState = JSON.parse(await readFile("src/state/state.json"));
    const currentState = {};
    const currentTime = new Date(Date.now() - 2 * 86400000);
    const year = currentTime.getFullYear();
    const month = currentTime.getMonth() + 1;
    const day = currentTime.getDate();
    const date = `${year}-${month}-${day}`;

    if (prevState[date]) return;
    console.log("Новый день - новый запрос");
    const tournaments = (
      await api.get(
        `https://www.sharkscope.com/api/pocarrleaderboard/reports/dailyscheduledtournaments/networks/888Poker,GGNetwork,PartyPoker,PokerStars,WPN,PokerStars(FR-ES-PT),Winamax.fr?date=${date}`
      )
    )?.DailyScheduledTournamentResponse?.ScheduledTournament;

    currentState[date] = tournaments;

    await writeFile(
      "src/state/state.json",
      JSON.stringify(Object.assign(currentState, prevState))
    );

    console.log(`День ${date} успешно добавлен в state.json`);

    const filtredState = {};

    Object.keys(Object.assign(currentState, prevState)).forEach((el) => {
      if (!filtredState[el]) filtredState[el] = {};
      filtredState[el] = Object.assign(currentState, prevState)[el].filter(
        (item) => {
          const od = item["@flags"]?.includes("OD"),
            sng = item["@gameClass"]?.includes("sng"),
            isNL = item["@structure"] === "NL",
            isH = item["@game"] === "H" || item["@game"] === "H6",
            name = item["@name"],
            sat = item["@flags"]?.includes("SAT");

          let network = item["@network"];

          const rebuy =
            network === "888Poker"
              ? name?.includes("R&A")
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

          if(!name) return false

          if (filterLevelByWord(network, name?.toLowerCase())) return false;

          const superturbo =
            network === "WNMX" ? false : item["@flags"]?.includes("ST");

          if (isNL && isH && !rebuy && !od && !sng && !sat && !superturbo) {
            return true;
          }
          return false;
        }
      );
    });

    await writeFile(
      "src/state/filtredState.json",
      JSON.stringify(filtredState)
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = { updateState };
