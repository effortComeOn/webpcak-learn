const glob = require('glob-all');

describe('checking generated css js files', () => {
  it('shuild grnerate css js files', (done) => {
    const files = glob.sync([
      './dist/search_*.css',
      './dist/search_*.js',
      './dist/index_*.js',
    ]);

    if (files.length > 0) {
      done();
    } else {
      throw new Error('no css js files generated');
    }
  });
});
