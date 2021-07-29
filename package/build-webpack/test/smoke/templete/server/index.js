if (typeof window === "undefined") {
  global.window = {};
}
if (typeof self === "undefined") {
  global.self = {};
}

const fs = require("fs");
const path = require("path");
const express = require("express");
const { renderToString } = require("react-dom/server");
const SSR = require("../dist/search-server");
const templete = fs.readFileSync(
  path.join(__dirname, "../dist/search.html"),
  "utf-8"
);

const server = (port) => {
  const app = express();
  app.use(express.static("dist"));
  app.get("/search", (req, res) => {
    const html = renderMarkUp(renderToString(SSR));
    res.status(200).send(html);
  });

  app.listen(port, () => {
    console.log("server is running port on:", port);
  });
};

server(process.env.PORT || 3000);

const renderMarkUp = (str) => {
  return templete
    .replace("<!--HTML_PLACEHOLDER-->", str)
    .replace(
      "<!--INITIAL_DATA_PLACEHOLDER-->",
      `<script>var data = {a:1}</script>`
    );
};
