import makeTrie, { ITrie } from './trie';

const EMPTY_STRING = '';
const EMPTY_UINT8_ARRAY = new Uint8Array(0);

export default class Smaz {
  private readonly buffer: Uint8Array = new Uint8Array(30000);
  private readonly verbatim: Uint8Array = new Uint8Array(255);

  private readonly trie: ITrie;
  private readonly codebook: string[];

  constructor(codebook: string[]) {
    this.codebook = codebook;
    this.trie = makeTrie(codebook);
  }

  public compress(str: string): Uint8Array {
    const compressedSize = this.inplaceCompress(str);
    if (compressedSize === 0) {
      return EMPTY_UINT8_ARRAY;
    }

    return this.buffer.slice(0, compressedSize);
  }

  public UNSAFE_compress(str: string): Uint8Array {
    const compressedSize = this.inplaceCompress(str);
    if (compressedSize === 0) {
      return EMPTY_UINT8_ARRAY;
    }

    return this.buffer.subarray(0, compressedSize);
  }

  public decompress(arr: Uint8Array): string {
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
        output += this.codebook[arr[i]];
        i += 1;
      }
    }
    return output;
  }

  public getCompressedSize(str: string): number {
    if (str.length === 0) {
      return 0;
    }

    let bufferIndex = 0;
    let verbatimIndex = 0;
    let inputIndex = 0;

    while (inputIndex < str.length) {
      let indexAfterMatch = -1;
      let code = -1;
      let root = this.trie;

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
        verbatimIndex++;
        inputIndex++;

        if (verbatimIndex === 255) {
          bufferIndex += 2 + verbatimIndex;
          verbatimIndex = 0;
        }
      } else {
        if (verbatimIndex !== 0) {
          bufferIndex += 2 + (verbatimIndex === 1 ? 0 : verbatimIndex);
          verbatimIndex = 0;
        }

        bufferIndex++;
        inputIndex = indexAfterMatch;
      }
    }

    if (verbatimIndex !== 0) {
      bufferIndex += 2 + (verbatimIndex === 1 ? 0 : verbatimIndex);
    }

    return bufferIndex;
  }

  private inplaceCompress(str: string): number {
    if (str.length === 0) {
      return 0;
    }

    let bufferIndex = 0;
    let verbatimIndex = 0;
    let inputIndex = 0;

    while (inputIndex < str.length) {
      let indexAfterMatch = -1;
      let code = -1;
      let root = this.trie;

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
        this.verbatim[verbatimIndex++] = str.charCodeAt(inputIndex++);
        if (verbatimIndex === 255) {
          bufferIndex = this.flushVerbatim(verbatimIndex, bufferIndex);
          verbatimIndex = 0;
        }
      } else {
        if (verbatimIndex !== 0) {
          bufferIndex = this.flushVerbatim(verbatimIndex, bufferIndex);
          verbatimIndex = 0;
        }
        this.buffer[bufferIndex++] = code;
        inputIndex = indexAfterMatch;
      }
    }

    if (verbatimIndex !== 0) {
      bufferIndex = this.flushVerbatim(verbatimIndex, bufferIndex);
    }

    return bufferIndex;
  }

  private flushVerbatim(verbatimIndex: number, bufferIndex: number): number {
    if (verbatimIndex === 1) {
      this.buffer[bufferIndex++] = 254;
      this.buffer[bufferIndex++] = this.verbatim[0];
    } else {
      this.buffer[bufferIndex++] = 255;
      this.buffer[bufferIndex++] = verbatimIndex;
      for (let k = 0; k < verbatimIndex; k += 1) {
        this.buffer[bufferIndex++] = this.verbatim[k];
      }
    }
    return bufferIndex;
  }
}
