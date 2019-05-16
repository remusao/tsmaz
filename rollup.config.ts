import compiler from '@ampproject/rollup-plugin-closure-compiler';

export default [
  // CommonJS + ES6 + UMD
  {
    input: './build/tsmaz.js',
    output: [
      { file: './dist/tsmaz.esm.js', format: 'es' },
      { file: './dist/tsmaz.cjs.js', format: 'cjs' },
      {
        file: './dist/tsmaz.umd.js',
        format: 'umd',
        name: 'tsmaz',
      },
    ],
  },
  // ES6 minified
  {
    input: './build/tsmaz.js',
    output: {
      file: './dist/tsmaz.esm.min.js',
      format: 'es',
    },
    plugins: [
      compiler({
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
      }),
    ],
  },
  // CommonJS minified
  {
    input: './dist/tsmaz.esm.min.js',
    output: {
      file: './dist/tsmaz.cjs.min.js',
      format: 'cjs',
    },
  },
  // UMD minified
  {
    input: './dist/tsmaz.esm.min.js',
    output: {
      file: './dist/tsmaz.umd.min.js',
      format: 'umd',
      name: 'tsmaz',
    },
  },
];
