module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'object-curly-spacing': ['error', 'always'],
    'no-var': 'error',
    'no-tabs': 2,
    'max-len': ['error', {
      'code': 80,
      'ignoreUrls': true,
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true,
      'ignoreComments': true,
    }],
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-debugger': 1,
    'no-warning-comments': [1, {
      'terms': ['hardcoded'], location: 'anywhere',
    }],
    'comma-dangle': [1, 'always-multiline'],
    'eol-last': [1, 'always'],
    'semi': [1, 'never'],
    'indent': [1, 2],
    'no-multi-spaces': 1,
    'no-trailing-spaces': 1,
    'space-in-parens': 1,
  },
}
