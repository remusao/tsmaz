import defaultDictionary from './dictionary';
import Smaz from './factory';

let SMAZ: null | Smaz = null;

export function decompress(array: Uint8Array): string {
  if (SMAZ === null) {
    SMAZ = new Smaz(defaultDictionary);
  }

  return SMAZ.decompress(array);
}

export function compress(str: string): Uint8Array {
  if (SMAZ === null) {
    SMAZ = new Smaz(defaultDictionary);
  }

  return SMAZ.compress(str);
}

export function getCompressedSize(str: string): number {
  if (SMAZ === null) {
    SMAZ = new Smaz(defaultDictionary);
  }

  return SMAZ.getCompressedSize(str);
}
