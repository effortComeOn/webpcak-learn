module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb-base',
  env: {
    browser: true,
    node: true,
  },
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'no-undef': 0,
    'comma-dangle': 0,
    'no-console': 0,
    'global-require': 0,
    'operator-linebreak': 0,
  },
};
