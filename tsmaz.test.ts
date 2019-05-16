import { compress, decompress, factory, generate } from '.';

describe('tsmaz', () => {
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
      expect(decompress(compress(str))).toEqual(str);
    });
  });

  it('fills verbatim buffer', () => {
    const custom = factory(['foo']);

    let str = '';
    for (let i = 0; i <= 256; i += 1) {
      str += 'b';
    }

    expect(custom[1](custom[0](str))).toBe(str);
  });

  describe('#generate', () => {
    it('has perfect compression on small input', () => {
      const custom = factory(generate(['foo', 'bar', 'baz']));

      // Compression is one byte for seen strings
      for (const str of ['foo', 'bar', 'baz']) {
        const compressed = custom[0](str);
        expect(compressed).toHaveLength(1);
        expect(custom[1](compressed)).toBe(str);
      }

      // No overhead for letters in a different order
      for (const str of ['fof', 'zar', 'boz']) {
        const compressed = custom[0](str);
        expect(compressed).toHaveLength(3);
        expect(custom[1](compressed)).toBe(str);
      }
    });
  });
});
