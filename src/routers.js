const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");
const api = require("./controllers/api");

// routes for /api
const apiRouter = new express.Router();

apiRouter.get("/tour", api.getTournaments);
apiRouter.get("/info", api.getInfoTournament);
apiRouter.get("/state", api.getStateByLevel);
apiRouter.get("/settings", api.getSettings);
apiRouter.post("/settings", api.postSettings);

// routes for /
const mainRouter = new express.Router();
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === "production") {
  mainRouter.use(express.static("client/build"));
  mainRouter.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "..", "client", "build", "index.html")
    );
  });
} else {
  mainRouter.use(
    createProxyMiddleware({
      target: "http://localhost:3001",
      changeOrigin: true,
    })
  );
}

exports.apiRouter = apiRouter;
exports.mainRouter = mainRouter;
