import compiler from '@ampproject/rollup-plugin-closure-compiler';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

const plugins = [resolve(), commonjs()];

function tasks(bundleName) {
  return [
    // UMD
    {
      input: `./build/${bundleName}.js`,
      output: {
        file: `./dist/${bundleName}.umd.js`,
        format: 'umd',
        name: 'tsmaz',
      },
      plugins,
    },
    // CommonJS + ES6
    {
      input: `./build/${bundleName}.js`,
      output: [
        { file: `./dist/${bundleName}.esm.js`, format: 'es' },
        { file: `./dist/${bundleName}.cjs.js`, format: 'cjs' },
      ],
      plugins,
    },
    // ES6 minified
    {
      input: `./build/${bundleName}.js`,
      output: {
        file: `./dist/${bundleName}.esm.min.js`,
        format: 'es',
      },
      plugins: [
        ...plugins,
        compiler({
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
        }),
      ],
    },
    // CommonJS minified
    {
      input: `./dist/${bundleName}.esm.min.js`,
      output: {
        file: `./dist/${bundleName}.cjs.min.js`,
        format: 'cjs',
      },
    },
    // UMD minified
    {
      input: `./dist/${bundleName}.esm.min.js`,
      output: {
        file: `./dist/${bundleName}.umd.min.js`,
        format: 'umd',
        name: 'tsmaz',
      },
    },
  ];
}

export default tasks('tsmaz');
