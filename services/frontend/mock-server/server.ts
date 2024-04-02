import express from "express";
import webpack from "webpack";
import path from "path";
import fs from "fs";
import config from "../config/webpack.dev.config.js";
import setupMockServer from "./setupMockServer";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

const app = express();
const compiler = webpack(config);

//Enable "webpack-dev-middleware"
const devMiddleWare = webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    chunks: false,
    hash: false,
    modules: false,
    version: false,
    assets: false,
    entrypoints: false,
    builtAt: false,
  },
});

app.use(devMiddleWare);

//Enable "webpack-hot-middleware"
app.use(webpackHotMiddleware(compiler));

app.use(express.static("./build"));

// set up mock api
setupMockServer(app);

//serve the routes
app.get("*", (req, res, next) => {
  fs.readFile(
    path.join(compiler.outputPath, "./build/index.html"),
    (err, file) => {
      if (err) {
        res.sendStatus(404);
      } else {
        res.send(file.toString());
      }
    }
  );
});

app.listen(8000, () => console.log("server listening on port 8000\n"));
