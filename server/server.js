const express = require("express");
const open = require("open");
const path = require("path");

import config from "../webpack.config.dev.js";
import webpack from "webpack";

const app = express();
const compiler = webpack(config);
const port = 8001;

app.use(
  require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  })
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/src/app/index.html"));
});

app.listen(port, err => {
  if (err) {
    console.log(err);
  } else {
    open(`http://localhost:${port}`);
  }
});
