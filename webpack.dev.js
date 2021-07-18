"use strict";

const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
    search: "./src/search.js",
  },
  output: {
    path: path.join(__dirname, "dist "),
    filename: "[name].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: "babel-loader", //转换es6
      },
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"], // 这里需要注意顺序，从右往左执行。
      },
      {
        test: /.less$/,
        use: ["style-loader", "css-loader", "less-loader"], // 这里需要注意顺序，从右往左执行。
      },
      {
        test: /.(png|svg|jpg|jpeg|gif)$/,
        // use: ["file-loader"],
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
            },
          },
        ],
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: ["file-loader"],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()], // 热更新
  devServer: {
    contentBase: "./dist",
    hot: true,
  },
};
