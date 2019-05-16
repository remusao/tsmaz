import compiler from '@ampproject/rollup-plugin-closure-compiler';

function tasks(bundleName) {
  return [
    // CommonJS + ES6 + UMD
    {
      input: `./build/${bundleName}.js`,
      output: [
        { file: `./dist/${bundleName}.esm.js`, format: 'es' },
        { file: `./dist/${bundleName}.cjs.js`, format: 'cjs' },
        {
          file: `./dist/${bundleName}.umd.js`,
          format: 'umd',
          name: 'tsmaz',
        },
      ],
    },
    // ES6 minified
    {
      input: `./build/${bundleName}.js`,
      output: {
        file: `./dist/${bundleName}.esm.min.js`,
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
