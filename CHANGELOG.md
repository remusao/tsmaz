# Changelog

### 1.2.0

*2019-05-16*

  - Use optimized bundle in tests + fixes [d253233](https://github.com/remusao/tsmaz/commit/d253233a9db418ee4c88df8aef8dfc95ca73735d)
    * Import optimized cjs bundle + type definitions for tests
    * Change API of factory to not rely on named attributes


### 1.1.0

*2019-05-16*

  - Produce optimized and minified bundles [#1](https://github.com/remusao/tsmaz/pull/1)
    * Add closure compiler plugin to rollup
    * Remove dependency to tslib
    * Produce minified bundles
    * Produce optimized bundles
    * Change default entrypoints in package.json
    * Simplify rollup config
    * Remove un-needed dependencies + update other ones

### 1.0.3

*2019-04-17*

  - Improve codebook generation [26fc0ad](https://github.com/remusao/tsmaz/commit/26fc0addcfebd95ab68afdcb1934e30fb56c847d)
  - Update dev dependencies [e5bdbc9](https://github.com/remusao/tsmaz/commit/e5bdbc9809dadea67c5f430253e54429e22b8974)
  - Harden tsconfig.json [8393224](https://github.com/remusao/tsmaz/commit/8393224f9bf4b69d04ab61f49c5775e691e6f0b4)
  - Restructure code and expose codebook generation from bundle [726e2bb](https://github.com/remusao/tsmaz/commit/726e2bbc1576f2c6122ae7d26f5a9298e513f344)
  - Remove dependency to ts-node [96fc207](https://github.com/remusao/tsmaz/commit/96fc2073dc953453b314442854cab3d531bb246e)
  - Target ES3 instead of ES2018 [bb05d27](https://github.com/remusao/tsmaz/commit/bb05d2774c1adc9d5ea542d13aa84b9297fd58b8)
  - Fix tests warning [799c494](https://github.com/remusao/tsmaz/commit/799c49495d54b9637fd059ae4df0550d24d4d48c)
  - Add more tests [5d2e656](https://github.com/remusao/tsmaz/commit/5d2e656f233a907cb685a1d42e8068219b89491a)

### 1.0.2

*2019-03-18*

  - Add script to generate optimized codebooks

### 1.0.1

*2019-03-17*

  - Initial release
