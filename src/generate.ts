import Smaz from './factory';

class StringCounter {
  private map: Map<string, number>;

  constructor() {
    this.map = new Map();
  }

  public incr(key: string): void {
    this.map.set(key, (this.map.get(key) || 0) + 1);
  }

  public decr(key: string): void {
    this.map.set(key, (this.map.get(key) || 1) - 1);
  }

  public delete(key: string): void {
    this.map.delete(key);
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

function extractNgrams(str: string): string[] {
  if (str.length === 0) {
    return [];
  }

  const ngrams: string[] = [];
  const maxNgramSize = 70;

  // Generate n-grams
  const len = str.length;
  for (let j = 0; j < str.length - 1; j += 1) {
    const remainingChars = len - j;
    for (let k = 2; k <= maxNgramSize && k <= remainingChars; k += 1) {
      ngrams.push(str.slice(j, j + k));
    }
  }

  return ngrams;
}

function addCounts(strings: string[], counter: StringCounter): void {
  for (let i = 0; i < strings.length; i += 1) {
    counter.update(extractNgrams(strings[i]));
  }
}

function delCounts(strings: string[], counter: StringCounter): void {
  for (let i = 0; i < strings.length; i += 1) {
    const str = strings[i];
    const ngrams = extractNgrams(str);
    for (let j = 0; j < ngrams.length; j += 1) {
      counter.decr(ngrams[j]);
    }
  }
}

function getNextBestSubstring(substrings: StringCounter): string {
  // Get best substring based on length and number of occurrences
  let bestScore = 0;
  let bestSubstring = '';
  for (const [substring, count] of substrings.entries()) {
    // const score = count * substring.length * Math.log(substring.length);
    const score = count * substring.length ** 2.2;
    if (score > bestScore) {
      bestSubstring = substring;
      bestScore = score;
    }
  }

  return bestSubstring;
}

function getCompressionRatio(codebook: string[], strings: string[]): number {
  const smaz = new Smaz(codebook);
  let totalCompressed = 0;
  let totalUncompressed = 0;

  for (let i = 0; i < strings.length; i += 1) {
    const str = strings[i];
    totalCompressed += smaz.getCompressedSize(str);
    totalUncompressed += str.length;
  }

  return 100.0 * (totalCompressed / totalUncompressed);
}

export default function generate(originalStrings: string[]): string[] {
  let strings = originalStrings;
  const codebook: string[] = [];
  const counter = new StringCounter();
  addCounts(strings, counter);

  for (let i = 0; i < 254; i += 1) {
    const substring = getNextBestSubstring(counter);
    if (!substring) {
      console.log('No more strings', i);
      break;
    }

    codebook.push(substring);
    counter.delete(substring);

    console.log(
      `+ ${substring} = ${getCompressionRatio(codebook, originalStrings)}%`,
    );

    const newStrings = [];
    for (let j = 0; j < strings.length; j += 1) {
      const str = strings[j];
      if (str.indexOf(substring) !== -1) {
        const parts = str.split(substring);

        // Update count of all substrings
        delCounts([str], counter);
        addCounts(parts, counter);

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
  const letters = new StringCounter();
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
