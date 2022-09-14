module.exports = {
  env: {
    commonjs: true,
    node: true,
    browser: true,
    es6: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier'],
  rules: {
    'camelcase': 'error',
    'no-duplicate-imports': 'error',
    'no-unused-vars': 'warn',
    'quotes': ['error', 'single'],
    'react/no-unknown-property': 'warn',
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 'off',
    'spaced-comment': 'error',
  },
  settings: {
    react: {
      version: 'latest', // "detect" automatically picks the version you have installed.
    },
  },
}
