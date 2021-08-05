'use strict';
const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasurePlugin();

// 多页面应用打包通用方案
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugin = [];

  // 动态获取 src 目录下的文件。常见的按文件夹划分
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
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
        chunks: ['venders', pageName],
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
  // 速度插件
  // module.exports = smp.wrap({
  mode: 'production',
  entry: entry,
  cache: true, /// 开启缓存， 二次构建速度会有所提升
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js',
    clean: true, // webpack 5,配置此参数，可直接清除打包的 dist 目录，无需使用 clean-webpack-plugin
  },
  module: {
    rules: [
      // {
      //   test: /.js$/,
      //   use: "eslint-loader", //转换es6
      // },
      {
        test: /.js$/,
        include: path.resolve(__dirname,'src'), //只解析 src 目录下的文件
        use: [
          // {
          //   loader: 'thread-loader', // 多进程压缩
          //   options: {
          //     workers: 3,
          //   },
          // },
          'babel-loader', //转换es6
        ],
      },
      {
        test: /.css$/,
        use: [
          // "style-loader",
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'px2rem-loader',
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
          'style-loader',
          // MiniCssExtractPlugin.loader, // 插件loader和style-loader互斥，功能冲突
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                // postcss-preset-env 中包含 autoprefixer 配置， browerlists 放在了 package.json 中
                plugins: [['postcss-preset-env']],
              },
            },
          },
          {
            loader: 'px2rem-loader',
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
            loader: 'file-loader',
            options: {
              // limit: 10240,
              name: '[name]_[hash:8].jpg',
            },
          },
        ],
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    new FriendlyErrorsPlugin(),
    function statusErrorFun() {
      this.hooks.done.tap('done', (stats) => {
        if (
          stats.compilation.errors &&
          stats.compilation.errors.length &&
          process.argv.indexOf('--watch') === -1
        ) {
          //   console.log("build error");
          process.exit(1);
        }
      });
    },
    // 提取公共模块
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: 'https://unpkg.com/react@17/umd/react.development.js',
    //       global: 'React',
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://unpkg.com/react-dom@17/umd/react-dom.development.js',
    //       global: 'ReactDOM',
    //     },
    //   ],
    // }),

    // 引用打包后的公共模块js
    new webpack.DllReferencePlugin({
      manifest: require('./build/library/library.json'),
    }),

    // webpack 4
    // new OptimizeCssAssetsPlugin({
    //   assetNameRegExp: /\.css$/g,
    //   cssProcessor: require("cssnano"),
    // }),

    // 在上方的函数中，已动态的实现了
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, "src/index.html"),
    //   filename: "index.html",
    //   chunks: ["index"],
    //   inject: true,
    //   minify: {
    //     html5: true,
    //     collapseWhitespace: true,
    //     preserveLineBreaks: false,
    //     minifyCSS: true,
    //     removeComments: false,
    //   },
    // }),

    // 分析包的大小
    // new BundleAnalyzerPlugin(),
  ].concat(htmlWebpackPlugin),
  stats: 'error-only',
  optimization: {
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      // `...`,
      new CssMinimizerPlugin(),
    ],

    // 代码压缩
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],

    //   // 提取公共模块
    //   // splitChunks: {
    //   //   cacheGroups: {
    //   //     // 提取公共模块为 vendors
    //   //     commons: {
    //   //       test: /(react|react-dom)/,
    //   //       name: "vendors",
    //   //       chunks: "all",
    //   //     },
    //   //   },
    //   // },

    //   // 提取公共文件
    //   // splitChunks: {
    //   //   minSize: 0,
    //   //   cacheGroups: {
    //   //     commons: {
    //   //       name: "commons",
    //   //       chunks: "all",
    //   //       minChunks: 1,
    //   //     },
    //   //   },
    //   // },
  },
  resolve: {
    alias: {
      react: path.resolve(
        __dirname,
        './node_modules/react/umd/react.production.min.js'
      ),
      'react-dom': path.resolve(
        __dirname,
        './node_modules/react-dom/umd/react-dom.production.min.js'
      ),
    },
    extensions: ['.js'],
    mainFiles: ['main'],
  },
};
// });
