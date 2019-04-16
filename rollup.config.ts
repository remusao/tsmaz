import pkg from './package.json';

export default [
  {
    input: './build/tsmaz.js',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: pkg.name,
    },
  },
  {
    input: './build/tsmaz.js',
    output: [
      { file: pkg.module, format: 'es' },
      { file: pkg.main, format: 'cjs' },
    ],
  },
];
