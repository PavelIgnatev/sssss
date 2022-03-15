const express = require("express");
const { PORT } = require("./config");
const {
  updateFiltredTournaments,
} = require("./modules/updateFiltredTournaments");
const setupMiddlewares = require("./middlewares");
const { apiRouter, mainRouter } = require("./routers");
const { updateAbility1 } = require("./modules/updateAbility1");
const { updateAbility2 } = require("./modules/updateAbility2");
const app = express();
const { createdGap } = require("./modules/createdGap");
const { sendStatistics } = require("./modules/sendStatistics");
// setup other
setupMiddlewares(app);

// api routes
app.use("/api", apiRouter);

// main routes
app.use("/", mainRouter);

app.listen(process.env.PORT || PORT, async () => {
  console.log("Сервер запущен", new Date());
  async function refreshCyclically() {
    while (true) {
      await sendStatistics();  
      await updateFiltredTournaments();
      console.log("Создаю объект промежутков");
      await createdGap();
      console.log("Объект промежутков созданн");
      console.log(`Начал обновление древовидного стейта по турнирам`);
      // await updateAbility1();
      console.log(`Обновил древовидный стейт по турнирам`);
      console.log(`Начал обновление стейта по уровням`);
      // await updateAbility2();
      console.log(`Завершил обновление стейта по уровням`);
      await new Promise((res, rej) => setTimeout(res, 21600000));
    }
  }

  refreshCyclically();
});
