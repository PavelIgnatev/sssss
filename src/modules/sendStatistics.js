const { api } = require("../api");
const { increaseProperties } = require("../helpers/increaseProperties");
const { readFile } = require("../utils/promisify");
const { filterLevelByAbility } = require("./filterLevelByAbility");
const { filterLevelByRules } = require("./filterLevelByRules");

const sendStatistics = async () => {
  const state = JSON.parse(await readFile("src/store/alias/alias.json"));
  const errorAlias = [];
  const errorTournaments = {};

  Object.keys(state).forEach(async (alias) => {
    const level = state[alias].level;

    let result;

    try {
      result = await api.get(
        `https://www.sharkscope.com/api/pocarrleaderboard/networks/Player Group/players/${alias}/completedTournaments?Order=Last,99&filter=Class:SCHEDULED;`
      );
    } catch {}


    const tournaments =
      result?.PlayerResponse?.PlayerView?.PlayerGroup?.CompletedTournaments
        ?.Tournament;

    if (!tournaments) {
      errorAlias.push(alias);
    } else {
      tournaments.forEach((ft) => {
        const t = increaseProperties(ft);

        if (
          !filterLevelByRules(level, t)
        ) {
          if (!errorTournaments[alias]) errorTournaments[alias] = [];

          console.log(t)
          errorTournaments[alias].push(t);
        }
      });
    }

    const errorNameHTML = errorAlias
      .map((alias) => `<div>${alias}</div>`)
      .join("");
    const errorTournamentsHTML = Object.keys(errorTournaments)
      .map((alias) => {
        const level = state[alias].level;
        const aliases = `<div style="display: flex"><div>${alias}</div><div style"margin-left: 6px">${level}</div></div>`;

        const tournaments = errorTournaments[alias]
          .map((tournament) => `<div>${tournament["@name"]}</div>`)
          .join("");
        return aliases + tournaments;
      })
      .join("");

    console.log(errorNameHTML);
    console.log(errorTournamentsHTML);

    const nodemailer = require("nodemailer");
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      type: "oauth2",
      auth: {
        user: "palllkaignatev@gmail.com", // generated ethereal user
        pass: "pikcelxxx", // generated ethereal password
      },
    });

    transporter.verify(async function (error, success) {
      if (error) {
        console.log(error);
      } else {
        let info = await transporter.sendMail({
          from: '"Fred Foo 👻" <foo@example.com>', // sender address
          to: "palllkaignatev@yandex.ru", // list of receivers
          subject: "Hello ✔", // Subject line
          text: "Hello world?", // plain text body
          html:
            "<h3>Undefined aliases: </h3>" +
            errorNameHTML +
            "<h3>Deviations from the rules: </h3>" +
            errorTournamentsHTML, // html body
        });
        // console.log(info);
        // console.log("Server is ready to take our messages");
      }
    });
  });
};

module.exports = { sendStatistics };
