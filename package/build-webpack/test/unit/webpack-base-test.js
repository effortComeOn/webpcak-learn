const assert = require('assert');

describe('webpack.base.js test case', () => {
  const baseConfig = require('../../lib/webpack.base');
  it('entry', () => {
    assert.equal(
      baseConfig.entry.index,
      '/Users/zhangjiao/前端学习/webpack/webpcak-learn/package/build-webpack/test/smoke/templete/src/index/index.js'
    );
    assert.equal(
      baseConfig.entry.search,
      '/Users/zhangjiao/前端学习/webpack/webpcak-learn/package/build-webpack/test/smoke/templete/src/search/index.js'
    );
  });
});
