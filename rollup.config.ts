import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';

export default [
  {
    input: './build/tsmaz.js',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: pkg.name,
    },
    plugins: [
      resolve({
        preferBuiltins: false,
      }),
      commonjs(),
    ],
  },
  {
    external: ['tslib'],
    input: './build/tsmaz.js',
    output: [
      { file: pkg.module, format: 'es' },
      { file: pkg.main, format: 'cjs' },
    ],
  },
];
