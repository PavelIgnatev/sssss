const { readFile, writeFile } = require("../utils/promisify");
const {
  filterLevelByRulesWithoutBrown,
} = require("./filterLevelByRulesWithoutBrown");
const { bidDefinition } = require("../helpers/bidDefinition");
const { statusDefinition } = require("../helpers/statusDefinition");
const {
  scheduledStartDateDifinition,
} = require("../helpers/scheduledStartDateDifinition");
const { increaseProperties } = require("../helpers/increaseProperties");

const updateAbility2 = async () => {
  const levels = ["7A", "7B"];
  const state = JSON.parse(
    await readFile("src/store/tournaments/filtredTournaments.json")
  );
  const gaps = JSON.parse(await readFile("src/store/gaps/gap.json"));

  const timezones = ["0", "-28800000"];

  const obj = {};

  timezones.forEach((ti) => {
    levels.forEach((l) => {
      Object.values(state).forEach((tournaments) => {
        Object.values(tournaments).forEach((ft) => {
          const t = increaseProperties(ft); //add properties for filter
          const s = statusDefinition(t); //status
          const b = bidDefinition(l, t, gaps); //bid
          const r = t["@network"]; //network - room
          const n = t["@name"]?.toLowerCase(); //name
          const c = t["@currency"]; //currency

          if (!b || !r || !n || !c || !filterLevelByRulesWithoutBrown(l, t)) {
            return;
          }

          if (!obj[ti]) obj[ti] = {};
          if (!obj[ti][r]) obj[ti][r] = {};
          if (!obj[ti][r][l]) obj[ti][r][l] = {};
          if (!obj[ti][r][l][c]) obj[ti][r][l][c] = {};
          if (!obj[ti][r][l][c][b]) obj[ti][r][l][c][b] = {};
          if (!obj[ti][r][l][c][b][s]) obj[ti][r][l][c][b][s] = {};
          if (!obj[ti][r][l][c][b][s][n]) obj[ti][r][l][c][b][s][n] = [];

          const result = {};

          result["a"] = t["@avability"];
          result["d"] = t["@duration"];
          result["g"] = t["@guarantee"];
          result["n"] = t["@name"];
          result["b"] = t["@bid"];
          result["p"] = t["@prizepool"];
          result["s"] = scheduledStartDateDifinition(t, ti);

          obj[ti][r][l][c][b][s][n].push(result);
        });
      });
    });
  });

  Object.keys(obj).forEach((ti) => {
    Object.keys(obj[ti]).forEach((r) => {
      Object.keys(obj[ti][r]).forEach((l) => {
        Object.keys(obj[ti][r][l]).forEach((c) => {
          Object.keys(obj[ti][r][l][c]).forEach((b) => {
            Object.keys(obj[ti][r][l][c][b]).forEach((s) => {
              let result = [];

              Object.keys(obj[ti][r][l][c][b][s]).forEach((n) => {
                const values = obj[ti][r][l][c][b][s][n];
                if (values?.length >= 3) {
                  result.push(...values);
                }
              });

              if (result.length) {
                obj[ti][r][l][c][b][s] = result;
              } else {
                delete obj[ti][r][l][c][b][s];
                if (!Object.keys(obj[ti][r][l][c][b]).length) {
                  delete obj[ti][r][l][c][b];
                  if (!Object.keys(obj[ti][r][l][c]).length) {
                    delete obj[ti][r][l][c];
                  }
                }
              }
            });
          });
        });
      });
    });
  });

  await writeFile(
    "src/store/ability2/formingAbility2.json",
    JSON.stringify(obj)
  );

  Object.keys(obj).forEach((ti) => {
    Object.keys(obj[ti]).forEach((r) => {
      Object.keys(obj[ti][r]).forEach((l) => {
        Object.keys(obj[ti][r][l]).forEach((c) => {
          if (!Object.keys(obj[ti][r][l][c]).length) {
            delete obj[ti][r][l][c];
          } else {
            Object.keys(obj[ti][r][l][c]).forEach((b) => {
              if (!Object.keys(obj[ti][r][l][c][b]).length) {
                delete obj[ti][r][l][c][b];
              } else {
                Object.keys(obj[ti][r][l][c][b]).forEach((s) => {
                  const v = obj[ti][r][l][c][b][s];
                  const length = v.length;

                  const a = Math.round(
                    v.reduce((r, i) => r + +i["a"], 0) / length
                  );
                  if (a) {
                    obj[ti][r][l][c][b][s] = a;
                  }
                });
              }
            });
          }
        });
      });
    });
  });

  await writeFile(
    "src/store/ability2/ability2WithoutName.json",
    JSON.stringify(obj)
  );

  const obj2 = {};

  timezones.forEach((ti) => {
    levels.forEach((l) => {
      Object.values(state).forEach((tournaments) => {
        Object.values(tournaments).forEach((ft) => {
          const t = increaseProperties(ft); //add properties for filter
          const s = statusDefinition(t); //status
          const b = bidDefinition(l, t, gaps); //bid
          const r = t["@network"]; //network - room
          const n = t["@name"]?.toLowerCase(); //name
          const c = t["@currency"]; //currency

          if (obj2?.[ti]?.[r]?.[l]?.[c]?.[b]?.[s]?.[t["@name"]]) {
            return;
          }

          const ability2 = obj?.[ti]?.[r]?.[l]?.[c]?.[b]?.[s];

          if (!b || !r || !n || !c || !ability2) {
            return;
          }
          
          if (!obj2[ti]) obj2[ti] = {};
          if (!obj2[ti][r]) obj2[ti][r] = {};
          if (!obj2[ti][r][l]) obj2[ti][r][l] = {};
          if (!obj2[ti][r][l][c]) obj2[ti][r][l][c] = {};
          if (!obj2[ti][r][l][c][b]) obj2[ti][r][l][c][b] = {};
          if (!obj2[ti][r][l][c][b][s]) obj2[ti][r][l][c][b][s] = {};
          obj2[ti][r][l][c][b][s][t["@name"]] = ability2;
        });
      });
    });
  });

  await writeFile("src/store/ability2/ability2.json", JSON.stringify(obj2));
};

module.exports = {
  updateAbility2,
};
