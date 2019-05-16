import factory from './factory';

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
  const maxNgramSize = 200;
  const substrings = new Counter();

  const alphaTokens = new RegExp(`[a-z0-9]{${maxNgramSize + 1},}`, 'gi');
  const alphaDashTokens = new RegExp(`[a-z0-9_-]{${maxNgramSize + 1},}`, 'gi');
  const alphaDashDotTokens = new RegExp(
    `[a-z0-9_.-]{${maxNgramSize + 1},}`,
    'gi',
  );
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
      for (let k = 2; k <= maxNgramSize && k <= remainingChars; k += 1) {
        substrings.incr(str.slice(j, j + k));
      }
    }
  }

  // Get best substring based on length and number of occurrences
  let bestScore = 0;
  let bestSubstring = '';
  const counts: Array<[string, number]> = Array.from(substrings.entries());
  for (let i = 0; i < counts.length; i += 1) {
    const substring = counts[i][0];
    const count = counts[i][1];
    const score = count * substring.length ** 2.2;
    if (score > bestScore) {
      bestSubstring = substring;
      bestScore = score;
    }
  }

  return bestSubstring;
}

function getCompressionRatio(codebook: string[], strings: string[]): number {
  const { totalCompressed, totalUncompressed } = run(
    factory(codebook)[0],
    strings,
  );
  return 100.0 * (totalCompressed / totalUncompressed);
}

export default function generate(originalStrings: string[]): string[] {
  let strings = originalStrings;
  const codebook: string[] = [];

  for (let i = 0; i < 254; i += 1) {
    const substring = getNextBestSubstring(strings);
    if (!substring) {
      console.log('No more strings', i);
      break;
    }

    codebook.push(substring);
    console.log(
      `+ ${substring} = ${getCompressionRatio(codebook, originalStrings)}%`,
    );

    const newStrings = [];
    for (let j = 0; j < strings.length; j += 1) {
      const str = strings[j];
      if (str.indexOf(substring) !== -1) {
        const parts = str.split(substring);
        for (let k = 0; k < parts.length; k += 1) {
          newStrings.push(parts[k]);
        }
      } else {
        newStrings.push(str);
      }
    }

    strings = newStrings;
  }

  // Count remaining occurrences of letters in strings
  const letters = new Counter();
  for (let i = 0; i < originalStrings.length; i += 1) {
    const str = originalStrings[i];
    for (let j = 0; j < str.length; j += 1) {
      letters.incr(str[j]);
    }
  }

  // Sort letters from most popular to least popular
  const lettersCodebook = Array.from(letters.entries()).sort(
    (v1, v2) => v2[1] - v1[1],
  );
  console.log(lettersCodebook);

  let bestRatio = getCompressionRatio(codebook, originalStrings);

  // Fine-tune codebook with letters
  for (let i = 0; i < lettersCodebook.length; i += 1) {
    const letter = lettersCodebook[i][0];

    // If codebook is not full yet, just add the letter at the end
    if (codebook.length < 254) {
      codebook.push(letter);
      console.log(
        `Codebook not full, adding letter: ${letter} = ${getCompressionRatio(
          codebook,
          originalStrings,
        )}`,
      );
      continue;
    }

    // Codebook is full, try to find a spot
    let bestR = 100;
    let insertAt = -1;
    console.log('> letter', letter);
    for (let j = 0; j < codebook.length; j += 1) {
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
