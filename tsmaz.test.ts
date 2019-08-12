// @ts-ignore
import * as minifiedTsmaz from './dist/tsmaz.cjs.min.js';
import * as tsmaz from './tsmaz';

function tests(
  name: string,
  {
    Smaz,
    compress,
    decompress,
    generate,
    getCompressedSize,
  }: {
    Smaz: any;
    compress: (str: string) => Uint8Array;
    decompress: (arr: Uint8Array) => string;
    generate: (strings: string[]) => string[];
    getCompressedSize: (str: string) => number;
  },
) {
  describe(`tsmaz (${name})`, () => {
    [
      '',
      'This is a small string',
      'foobar',
      'the end',
      'not-a-g00d-Exampl333',
      'Smaz is a simple compression library',
      'Nothing is more difficult, and therefore more precious, than to be able to decide',
      'this is an example of what works very well with smaz',
      '1000 numbers 2000 will 10 20 30 compress very little',
      'Nel mezzo del cammin di nostra vita, mi ritrovai in una selva oscura',
      'Mi illumino di immenso',
      "L'autore di questa libreria vive in Sicilia",
      'http://google.com',
      'http://programming.reddit.com',
      'http://github.com/antirez/smaz/tree/master',
    ].forEach(str => {
      it(str, () => {
        const compressed = compress(str);
        expect(compressed.length).toEqual(getCompressedSize(str));
        expect(decompress(compressed)).toEqual(str);
      });
    });

    it('fills verbatim buffer', () => {
      const custom = new Smaz(['foo']);

      let str = '';
      for (let i = 0; i <= 256; i += 1) {
        str += 'b';
      }

      const compressed = custom.compress(str);
      expect(compressed.length).toEqual(custom.getCompressedSize(str));
      expect(custom.decompress(compressed)).toEqual(str);
    });

    describe('#generate', () => {
      it('has perfect compression on small input', () => {
        const custom = new Smaz(generate(['foo', 'bar', 'baz']));

        // Compression is one byte for seen strings
        for (const str of ['foo', 'bar', 'baz']) {
          const compressed = custom.compress(str);
          expect(compressed).toHaveLength(1);
          expect(custom.decompress(compressed)).toBe(str);
        }

        // No overhead for letters in a different order
        for (const str of ['fof', 'zar', 'boz']) {
          const compressed = custom.compress(str);
          expect(compressed).toHaveLength(3);
          expect(custom.decompress(compressed)).toBe(str);
        }
      });
    });
  });
}

// @ts-ignore
tests('minified', minifiedTsmaz);
tests('ts', tsmaz);
