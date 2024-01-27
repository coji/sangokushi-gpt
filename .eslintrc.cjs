/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    '@remix-run/eslint-config/jest-testing-library',
    'prettier',
  ],
  plugins: ['jest-dom'],
  rules: {
    semi: ['error', 'never'],
  },
  settings: {
    jest: {
      version: 28,
    },
  },
}
