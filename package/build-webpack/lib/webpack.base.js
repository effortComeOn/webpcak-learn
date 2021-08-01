const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const projectRoot = process.cwd();

// 多页面应用打包通用方案
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugin = [];

  // 动态获取 src 目录下的文件。常见的按文件夹划分
  const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'));
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    // 获取文件名
    const match = entryFile.match(/src\/(.*)\/index.js/);
    const pageName = match && match[1];
    // 动态添加entry
    entry[pageName] = entryFile;
    // 动态添加 htmlWebpackPlugin
    return htmlWebpackPlugin.push(
      new HtmlWebpackPlugin({
        template: path.join(projectRoot, `src/${pageName}/index.html`),
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
  entry,
  output: {
    clean: true, // webpack 5,配置此参数，可直接清除打包的 dist 目录，无需使用 clean-webpack-plugin
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: 'babel-loader', // 转换es6
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
          // "style-loader",
          MiniCssExtractPlugin.loader, // 插件loader和style-loader互斥，功能冲突
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
  ].concat(htmlWebpackPlugin),
  stats: 'error-only',
};
