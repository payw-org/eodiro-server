module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'no-extra-semi': [0],
    'no-async-promise-executor': [0],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': [0],
    '@typescript-eslint/explicit-function-return-type': [0],
    '@typescript-eslint/no-var-requires': [0],
    '@typescript-eslint/no-namespace': [0],
    '@typescript-eslint/no-empty-function': [0],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: false,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/no-explicit-any': [0],
    // Remove the rule after completely migrated to Prisma
    '@typescript-eslint/camelcase': [0],
    '@typescript-eslint/no-extra-semi': [0],
  },
}
