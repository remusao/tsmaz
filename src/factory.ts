import makeTrie from './trie';

const EMPTY_STRING = '';
const EMPTY_UINT8_ARRAY = new Uint8Array(0);

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

export default function factory(
  codebook: string[],
): [(str: string) => Uint8Array, (arr: Uint8Array) => string] {
  const trie = makeTrie(codebook);

  return [
    (str: string): Uint8Array => {
      if (str.length === 0) {
        return EMPTY_UINT8_ARRAY;
      }

      let bufferIndex = 0;
      let verbatimIndex = 0;
      let inputIndex = 0;

      while (inputIndex < str.length) {
        let indexAfterMatch = -1;
        let code = -1;
        let root = trie;

        for (let j = inputIndex; j < str.length; j += 1) {
          root = root.chars[str[j]];
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
    },
    (arr: Uint8Array): string => {
      if (arr.byteLength === 0) {
        return EMPTY_STRING;
      }

      let output = EMPTY_STRING;
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
    },
  ];
}
