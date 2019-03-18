import { readFileSync } from 'fs';
import { factory } from './tsmaz';

class Counter {
  private map: Map<string, number>;

  constructor() {
    this.map = new Map();
  }

  public incr(key: string): void {
    this.map.set(key, (this.map.get(key) || 0) + 1);
  }

  public update(keys: string[]): void {
    for (let i = 0; i < keys.length; i += 1) {
      this.incr(keys[i]);
    }
  }

  public entries() {
    return this.map.entries();
  }
}

function run(
  compress: (str: string) => Uint8Array,
  strings: string[],
): { totalCompressed: number; totalUncompressed: number } {
  let totalCompressed = 0;
  let totalUncompressed = 0;

  for (let i = 0; i < strings.length; i += 1) {
    const str = strings[i];
    const compressed = compress(str);
    totalCompressed += compressed.length;
    totalUncompressed += str.length;
  }

  return { totalCompressed, totalUncompressed };
}

function getNextBestSubstring(strings: string[]): string {
  const substrings = new Counter();

  const alphaTokens = /[a-zA-Z0-9]{11,}/g;
  const alphaDashTokens = /[a-zA-Z0-9_-]{11,}/g;
  const alphaDashDotTokens = /a-zA-Z0-9_.-]{11,}/g;
  for (let i = 0; i < strings.length; i += 1) {
    const str = strings[i];
    if (str.length === 0) {
      continue;
    }

    substrings.update(str.match(alphaTokens) || []);
    substrings.update(
      (str.match(alphaDashTokens) || []).filter(
        t => t.indexOf('-') !== -1 || t.indexOf('_') !== -1,
      ),
    );
    substrings.update(
      (str.match(alphaDashDotTokens) || []).filter(t => t.indexOf('.')),
    );

    // Generate n-grams
    const len = str.length;
    for (let j = 0; j < len - 1; j += 1) {
      const remainingChars = len - j;
      for (let k = 2; k <= 10 && k <= remainingChars; k += 1) {
        substrings.incr(str.slice(j, j + k));
      }
    }
  }

  // Get best substring based on length and number of occurrences
  let bestScore = 0;
  let bestSubstring = '';
  for (const [substring, count] of substrings.entries()) {
    if (count >= 5) {
      const score = count * substring.length ** 2.2;
      if (score > bestScore) {
        bestSubstring = substring;
        bestScore = score;
      }
    }
  }

  return bestSubstring;
}

function getCompressionRatio(codebook: string[], strings: string[]): number {
  const { totalCompressed, totalUncompressed } = run(
    factory(codebook).compress,
    strings,
  );
  return 100.0 * (totalCompressed / totalUncompressed);
}

function generateCodebook(originalStrings: string[]): string[] {
  let strings = originalStrings;
  const codebook: string[] = [];

  for (let i = 0; i < 254; i += 1) {
    const substring = getNextBestSubstring(strings);
    codebook.push(substring);
    console.log(
      `+ ${substring} = ${getCompressionRatio(codebook, originalStrings)}%`,
    );

    const newStrings = [];
    for (const str of strings) {
      if (str.indexOf(substring) !== -1) {
        newStrings.push(...str.split(substring));
      } else {
        newStrings.push(str);
      }
    }

    strings = newStrings;
  }

  // Count remaining occurrences of letters in strings
  const letters = new Counter();
  for (let i = 0; i < strings.length; i += 1) {
    const str = strings[i];
    for (let j = 0; j < str.length; j += 1) {
      letters.incr(str[j]);
    }
  }

  // Sort letters from most popular to least popular
  const lettersCodebook = [...letters.entries()].sort(
    ([, c1], [, c2]) => c2 - c1,
  );

  let bestRatio = getCompressionRatio(codebook, originalStrings);

  // Fine-tune codebook with letters
  for (let i = 0; i < lettersCodebook.length; i += 1) {
    let bestR = 100;
    let insertAt = -1;
    const letter = lettersCodebook[i][0];
    console.log('> letter', letter);
    for (let j = 0; j < 254; j += 1) {
      const prev = codebook[j];
      codebook[j] = letter;
      const ratio = getCompressionRatio(codebook, originalStrings);
      codebook[j] = prev;
      if (ratio < bestR) {
        bestR = ratio;
        insertAt = j;
      }
    }

    if (bestR < bestRatio) {
      console.log(`replacing ${codebook[insertAt]} with ${letter} = ${bestR}%`);
      codebook[insertAt] = letter;
      bestRatio = bestR;
    }
  }

  return codebook;
}

function main() {
  console.log('Generating optimized codebook from ./strings.txt');
  const codebook = generateCodebook(
    readFileSync('strings.txt', {
      encoding: 'utf-8',
    }).split(/[\n\r]+/g),
  );
  console.log('Best codebook', JSON.stringify(codebook, null, 2));
}

main();
