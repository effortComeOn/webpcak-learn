"use strict";

const glob = require("glob");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 多页面应用打包通用方案
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugin = [];

  // 动态获取 src 目录下的文件。常见的按文件夹划分
  const entryFiles = glob.sync(path.join(__dirname, "./src/*/index.js"));
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    // 获取文件名
    const match = entryFile.match(/src\/(.*)\/index.js/);
    const pageName = match && match[1];
    // 动态添加entry
    entry[pageName] = entryFile;
    // 动态添加 htmlWebpackPlugin
    htmlWebpackPlugin.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [pageName],
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          removeComments: false,
        },
      })
    );
  });

  return {
    entry,
    htmlWebpackPlugin,
  };
};

const { entry, htmlWebpackPlugin } = setMPA();

module.exports = {
  mode: "development",
  entry: entry,
  output: {
    path: path.join(__dirname, "dist"),
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
  plugins: [new webpack.HotModuleReplacementPlugin()].concat(htmlWebpackPlugin), // 热更新
  devServer: {
    contentBase: "./dist",
    hot: true,
    stats: "error-only",
  },
  devtool: "source-map",
};
