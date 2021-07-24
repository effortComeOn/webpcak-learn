"use strict";
const glob = require("glob");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 多页面应用打包通用方案
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugin = [];

  // 动态获取 src 目录下的文件。常见的按文件夹划分
  const entryFiles = glob.sync(path.join(__dirname, "./src/*/index-server.js"));
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    // 获取文件名
    const match = entryFile.match(/src\/(.*)\/index-server.js/);
    const pageName = match && match[1];
    if (pageName) {
      // 动态添加entry
      entry[pageName] = entryFile;
      // 动态添加 htmlWebpackPlugin
      htmlWebpackPlugin.push(
        new HtmlWebpackPlugin({
          template: path.join(__dirname, `src/${pageName}/index.html`),
          filename: `${pageName}.html`,
          chunks: ["venders", pageName],
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
    }
  });

  return {
    entry,
    htmlWebpackPlugin,
  };
};

const { entry, htmlWebpackPlugin } = setMPA();

module.exports = {
  mode: "production",
  entry: entry,
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name]-server.js",
    libraryTarget: "umd",
    publicPath: "./",
    clean: true, // webpack 5,配置此参数，可直接清除打包的 dist 目录，无需使用 clean-webpack-plugin
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: "babel-loader", //转换es6
      },
      {
        test: /.css$/,
        use: [
          // "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "px2rem-loader",
            options: {
              remUni: 75, // rem 相对于 px 的比
              remPrecision: 8, // px 转换成 rem 之后的小数点个数
            },
          },
        ], // 这里需要注意顺序，从右往左执行。
      },
      {
        test: /.less$/,
        use: [
          // "style-loader",
          MiniCssExtractPlugin.loader, // 插件loader和style-loader互斥，功能冲突
          "css-loader",
          "less-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                // postcss-preset-env 中包含 autoprefixer 配置， browerlists 放在了 package.json 中
                plugins: [["postcss-preset-env"]],
              },
            },
          },
          {
            loader: "px2rem-loader",
            // options here
            options: {
              remUni: 75,
              remPrecision: 8,
            },
          },
        ], // 这里需要注意顺序，从右往左执行。
      },
      {
        test: /.(png|svg|jpg|jpeg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]_[hash:8].jpg",
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name]_[contenthash:8].css",
    }),
  ].concat(htmlWebpackPlugin),
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
};
