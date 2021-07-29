const webpack = require('webpack');
const path = require('path');
const rimraf = require('rimraf');
const Mocha = require('mocha');
const prodConfig = require('../../lib/webpack.prod');

const mochaObj = new Mocha({
  timeout: '10000ms',
});

process.chdir(path.join(__dirname, 'templete'));

rimraf('./dist', () => {
  webpack(prodConfig, (err, stats) => {
    if (err) {
      console.error(err);
      process.exit(2);
    }
    console.log(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
      })
    );

    console.log('webpack build success, begin run test');

    mochaObj.addFile(path.join(__dirname, 'html-test.js'));
    mochaObj.addFile(path.join(__dirname, 'css-js-test.js'));

    mochaObj.run();
  });
});
