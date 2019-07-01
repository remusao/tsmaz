import defaultDictionary from './dictionary';
import factory from './factory';

let DEFLATE: null | ((_: string) => Uint8Array) = null;
let INFLATE: null | ((_: Uint8Array) => string) = null;

export function decompress(array: Uint8Array): string {
  if (INFLATE === null) {
    const defaultSmaz = factory(defaultDictionary);
    DEFLATE = defaultSmaz[0];
    INFLATE = defaultSmaz[1];
  }

  return INFLATE(array);
}

export function compress(str: string): Uint8Array {
  if (DEFLATE === null) {
    const defaultSmaz = factory(defaultDictionary);
    DEFLATE = defaultSmaz[0];
    INFLATE = defaultSmaz[1];
  }

  return DEFLATE(str);
}
