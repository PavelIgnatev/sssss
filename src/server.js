const express = require("express");
const { PORT } = require("./config");
const { updateState } = require("./helpers/updateState");
const setupMiddlewares = require("./middlewares");
const { apiRouter, mainRouter } = require("./routers");
const { updateTreelikeState } = require("./helpers/updateTreelikeState");
const { updateStateByLevel } = require("./helpers/updateStateByLevel");
const app = express();
const { createdGap } = require("./helpers/createdGap");

// setup other
setupMiddlewares(app);

// api routes
app.use("/api", apiRouter);

// main routes
app.use("/", mainRouter);

app.listen(process.env.PORT || PORT, async () => {
  async function refreshCyclically() {
    while (true) {
      await updateState();
      console.log("Создаю объект промежутков");
      await createdGap();
      console.log("Объект промежутков созданн");
      console.log(`Начал обновление древовидного стейта по турнирам`);
      await updateTreelikeState();
      console.log(`Обновил древовидный стейт по турнирам`);
      console.log(`Начал обновление стейта по уровням`);
      await updateStateByLevel()
      console.log(`Завершил обновление стейта по уровням`);
      await new Promise((res, rej) => setTimeout(res, 21600000));
    }
  }

  refreshCyclically();
});
