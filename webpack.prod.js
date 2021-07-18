"use strict";

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.js",
    search: "./src/search.js",
  },
  output: {
    path: path.join(__dirname, "dist "),
    filename: "[name]_[chunkhash:8].js",
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
        // use: ["file-loader"],
        use: [
          {
            // loader: "url-loader",
            loader: "file-loader",
            options: {
              // limit: 10240,
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

    // webpack 4
    // new OptimizeCssAssetsPlugin({
    //   assetNameRegExp: /\.css$/g,
    //   cssProcessor: require("cssnano"),
    // }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/search.html"),
      filename: "search.html",
      chunks: ["search"],
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        removeComments: false,
      },
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/index.html"),
      filename: "index.html",
      chunks: ["index"],
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        removeComments: false,
      },
    }),
  ],
  optimization: {
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      // `...`,
      new CssMinimizerPlugin(),
    ],
  },
};