import compiler from '@ampproject/rollup-plugin-closure-compiler';
import typescript from 'rollup-plugin-typescript';

export default [
  // CommonJS + ES6 + UMD
  {
    input: './tsmaz.ts',
    output: [
      { file: './dist/tsmaz.esm.js', format: 'es', sourcemap: true },
      { file: './dist/tsmaz.cjs.js', format: 'cjs', sourcemap: true },
      {
        file: './dist/tsmaz.umd.js',
        format: 'umd',
        name: 'tsmaz',
        sourcemap: true,
      },
    ],
    plugins: [typescript()],
  },
  // ES6 minified
  {
    input: './tsmaz.ts',
    output: {
      file: './dist/tsmaz.esm.min.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      typescript(),
      compiler({
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        language_out: 'NO_TRANSPILE',
        warning_level: 'DEFAULT',
      }),
    ],
  },
  // UMD + CommonJS minified
  {
    input: './dist/tsmaz.esm.min.js',
    output: [
      {
        file: './dist/tsmaz.cjs.min.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: './dist/tsmaz.umd.min.js',
        format: 'umd',
        name: 'tsmaz',
        sourcemap: true,
      },
    ],
  },
];
