const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");
const api = require("./controllers/api");

// routes for /api
const apiRouter = new express.Router();

apiRouter.get("/tour", api.getTournaments);
apiRouter.get("/preview", api.getPreview  );
apiRouter.get("/info", api.getFormingAbility2);
apiRouter.get("/state", api.getAbility2);
apiRouter.get("/settings", api.getPreviewRules);
apiRouter.post("/settings", api.updateSettings);

// routes for /
const mainRouter = new express.Router();

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
