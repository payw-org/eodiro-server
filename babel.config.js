module.exports = {
  presets: ['@babel/preset-env', '@babel/typescript'],
  plugins: [
    '@babel/proposal-class-properties',
    '@babel/plugin-transform-runtime',
    'transform-html-import-to-string',
    [
      'module-resolver',
      {
        'root': ['./'],
        'alias': {
          '@': './src',
        },
      },
    ],
  ],
  ignore: ['**/*.d.ts', 'node_modules'],
}
