import compiler from '@ampproject/rollup-plugin-closure-compiler';

export default [
  // ES6 + UMD + CommonJS minified
  {
    input: './build/es6/tsmaz.js',
    output: [
      {
        file: './dist/tsmaz.esm.min.js',
        format: 'es',
        sourcemap: true,
      },
      {
        file: './dist/tsmaz.cjs.min.js',
        format: 'cjs',
      },
      {
        file: './dist/tsmaz.umd.min.js',
        format: 'umd',
        name: 'tsmaz',
      },
    ],
    plugins: [
      compiler({
        language_out: 'NO_TRANSPILE',
        warning_level: 'DEFAULT',
      }),
    ],
  },
];
