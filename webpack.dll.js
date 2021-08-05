'use strict';
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    library: ['react', 'react-dom'],
  },
  output: {
    clear: true,
    filename: '[name]_[hash:8].dll.js',
    path: path.join(__dirname, 'build/library'),
    library: '[name]',
  },
  plugins: [
    // 提取公共模块
    new webpack.DllPlugin({
      context: __dirname,
      name: '[name]_[hash:8]',
      path: path.join(__dirname, 'build/library/[name].json'),
    }),
  ],
};
