module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  extends: [
    'airbnb-base',
    'prettier',
  ],
  plugins: [
    'prettier',
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-param-reassign': 'off'
  },
  env: {
    node: true
  },
  overrides: [
    {
      files: ['lib/__tests__/*.js'],
      env: {
        jest: true,
      }
    }
  ]
};
