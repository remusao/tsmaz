# tsmaz

A port of the [smaz](https://github.com/antirez/smaz) small string compression library.

From the original library:

> Smaz is a simple compression library suitable for compressing very short
> strings. General purpose compression libraries will build the state needed
> for compressing data dynamically, in order to be able to compress every kind
> of data. This is a very good idea, but not for a specific problem: compressing
> small strings will not work.
>
> Smaz instead is not good for compressing general purpose data, but can compress
> text by 40-50% in the average case (works better with English), and is able to
> perform a bit of compression for HTML and urls as well. The important point is
> that Smaz is able to compress even strings of two or three bytes!
>
> For example the string "the" is compressed into a single byte.
>
> To compare this with other libraries, think that like zlib will usually not be able to compress text shorter than 100 bytes.

## Usage

Install,
```sh
npm install tsmaz
```

then,
```javascript
const { compress, decompress } = require('tsmaz');

const compressed = compress('foobar');
console.log(decompress(compressed));
```

It is also possible to use a custom codebook:
```javascript
const { Smaz } = require('tsmaz');

// NOTE: this array needs to have a maximum length of 254!
const smaz = new Smaz([
  'foo',
  'bar',
  'foobar',
  'er',
  'ab',
  'aa',
];

smaz.decompress(smaz.compress('foo'));
```

## Generating Codebooks

The library exports a `generate` function, which accepts a list of strings which
you would like to compress, then learns a dictionary which works well with the
kind of data given as input.

```javascript
const { generate, Smaz } = require('tsmaz');

// Generate codebook
const codebook = generate([
  'foo',
  'foobar',
  'bar',
  'baz-bar',
]);

// Use custom codebook
const smaz = new Smaz(codebook);

const compressed = smaz.compress('foo-barbaz');
console.log(compressed);
const original = smaz.decompress(compressed);
console.log(original);
```

## Performance

`tsmaz` makes use of a trie data-structure for look-up (whereas the original
implementation used a hashtable). Apart from that the behavior should be the
same, and performance is pretty good (around 32k bytes per millisecond for
compression and 70k bytes per millisecond for decompression).
