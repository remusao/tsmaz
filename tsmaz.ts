interface ITrie {
  [key: string]: ITrie;
}

interface ICode {
  code?: number;
}

function makeTrie(codebook: string[]): ITrie & ICode {
  const node: ITrie & ICode = {};
  for (let i = 0; i < codebook.length; i += 1) {
    const tok = codebook[i];
    let root = node;
    for (let j = 0; j < tok.length; j += 1) {
      const c = tok[j];
      if (root[c] === undefined) {
        root[c] = {};
      }
      root = root[c];
    }
    root.code = i;
  }
  return node;
}

const BUFFER = new Uint8Array(30000);
const VERBATIM = new Uint8Array(255);

function flushVerbatim(verbatimIndex: number, bufferIndex: number): number {
  if (verbatimIndex === 1) {
    BUFFER[bufferIndex++] = 254;
    BUFFER[bufferIndex++] = VERBATIM[0];
  } else {
    BUFFER[bufferIndex++] = 255;
    BUFFER[bufferIndex++] = verbatimIndex;
    for (let k = 0; k < verbatimIndex; k += 1) {
      BUFFER[bufferIndex++] = VERBATIM[k];
    }
  }
  return bufferIndex;
}

export function factory(codebook: string[]) {
  const trie = makeTrie(codebook);

  function compressImpl(str: string): Uint8Array {
    if (str.length === 0) {
      return new Uint8Array(0);
    }
    let bufferIndex = 0;
    let verbatimIndex = 0;
    let inputIndex = 0;
    while (inputIndex < str.length) {
      let indexAfterMatch = -1;
      let code = -1;
      let root = trie;
      for (let j = inputIndex; j < str.length; j += 1) {
        root = root[str[j]];
        if (root === undefined) {
          break;
        }
        if (root.code !== undefined) {
          code = root.code;
          indexAfterMatch = j + 1;
        }
      }
      if (code === -1) {
        VERBATIM[verbatimIndex++] = str.charCodeAt(inputIndex++);
        if (verbatimIndex === 255) {
          bufferIndex = flushVerbatim(verbatimIndex, bufferIndex);
          verbatimIndex = 0;
        }
      } else {
        if (verbatimIndex !== 0) {
          bufferIndex = flushVerbatim(verbatimIndex, bufferIndex);
          verbatimIndex = 0;
        }
        BUFFER[bufferIndex++] = code;
        inputIndex = indexAfterMatch;
      }
    }
    if (verbatimIndex !== 0) {
      bufferIndex = flushVerbatim(verbatimIndex, bufferIndex);
    }
    return BUFFER.subarray(0, bufferIndex);
  }

  function decompressImpl(arr: Uint8Array): string {
    if (arr.byteLength === 0) {
      return '';
    }

    let output = '';
    let i = 0;

    while (i < arr.byteLength) {
      if (arr[i] === 254) {
        output += String.fromCharCode(arr[i + 1]);
        i += 2;
      } else if (arr[i] === 255) {
        output += String.fromCharCode.apply(
          null,
          // @ts-ignore
          arr.subarray(i + 2, i + arr[i + 1] + 2),
        );
        i += arr[i + 1] + 2;
      } else {
        output += codebook[arr[i]];
        i += 1;
      }
    }
    return output;
  }

  return { compress: compressImpl, decompress: decompressImpl };
}

const defaultTsmaz = factory([
  ' ',
  'the',
  'e',
  't',
  'a',
  'of',
  'o',
  'and',
  'i',
  'n',
  's',
  'e ',
  'r',
  ' th',
  ' t',
  'in',
  'he',
  'th',
  'h',
  'he ',
  'to',
  '\r\n',
  'l',
  's ',
  'd',
  ' a',
  'an',
  'er',
  'c',
  ' o',
  'd ',
  'on',
  ' of',
  're',
  'of ',
  't ',
  ', ',
  'is',
  'u',
  'at',
  '   ',
  'n ',
  'or',
  'which',
  'f',
  'm',
  'as',
  'it',
  'that',
  '\n',
  'was',
  'en',
  '  ',
  ' w',
  'es',
  ' an',
  ' i',
  'f ',
  'g',
  'p',
  'nd',
  ' s',
  'nd ',
  'ed ',
  'w',
  'ed',
  'http://',
  'https://',
  'for',
  'te',
  'ing',
  'y ',
  'The',
  ' c',
  'ti',
  'r ',
  'his',
  'st',
  ' in',
  'ar',
  'nt',
  ',',
  ' to',
  'y',
  'ng',
  ' h',
  'with',
  'le',
  'al',
  'to ',
  'b',
  'ou',
  'be',
  'were',
  ' b',
  'se',
  'o ',
  'ent',
  'ha',
  'ng ',
  'their',
  '"',
  'hi',
  'from',
  ' f',
  'in ',
  'de',
  'ion',
  'me',
  'v',
  '.',
  've',
  'all',
  're ',
  'ri',
  'ro',
  'is ',
  'co',
  'f t',
  'are',
  'ea',
  '. ',
  'her',
  ' m',
  'er ',
  ' p',
  'es ',
  'by',
  'they',
  'di',
  'ra',
  'ic',
  'not',
  's, ',
  'd t',
  'at ',
  'ce',
  'la',
  'h ',
  'ne',
  'as ',
  'tio',
  'on ',
  'n t',
  'io',
  'we',
  ' a ',
  'om',
  ', a',
  's o',
  'ur',
  'li',
  'll',
  'ch',
  'had',
  'this',
  'e t',
  'g ',
  ' wh',
  'ere',
  ' co',
  'e o',
  'a ',
  'us',
  ' d',
  'ss',
  ' be',
  ' e',
  's a',
  'ma',
  'one',
  't t',
  'or ',
  'but',
  'el',
  'so',
  'l ',
  'e s',
  's,',
  'no',
  'ter',
  ' wa',
  'iv',
  'ho',
  'e a',
  ' r',
  'hat',
  's t',
  'ns',
  'ch ',
  'wh',
  'tr',
  'ut',
  '/',
  'have',
  'ly ',
  'ta',
  ' ha',
  ' on',
  'tha',
  '-',
  ' l',
  'ati',
  'en ',
  'pe',
  ' re',
  'there',
  'ass',
  'si',
  ' fo',
  'wa',
  'ec',
  'our',
  'who',
  'its',
  'z',
  'fo',
  'rs',
  'ot',
  'un',
  'im',
  'th ',
  'nc',
  'ate',
  'ver',
  'ad',
  ' we',
  'ly',
  'ee',
  ' n',
  'id',
  ' cl',
  'ac',
  'il',
  'rt',
  ' wi',
  'e, ',
  ' it',
  'whi',
  ' ma',
  'ge',
  'x',
  'e c',
  'men',
  '.com',
]);

export const compress = defaultTsmaz.compress;
export const decompress = defaultTsmaz.decompress;
