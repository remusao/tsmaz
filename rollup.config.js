import pkg from './package.json';

export default [
  {
    input: './build/tsmaz.js',
    output: {
      file: pkg.browser,
      name: pkg.name,
      format: 'umd',
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
