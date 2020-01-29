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
    const count: number | undefined = this.map.get(key);

    if (count === undefined) {
      return;
    }

    if (count <= 1) {
      this.map.delete(key);
      return;
    }

    this.map.set(key, count - 1);
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

function addCounts(strings: Set<string>, counter: StringCounter): void {
  for (const str of strings) {
    counter.update(extractNgrams(str));
  }
}

function delCounts(strings: Set<string>, counter: StringCounter): void {
  for (const str of strings) {
    for (const ngram of extractNgrams(str)) {
      counter.decr(ngram);
    }
  }
}

function getNextBestSubstring(substrings: StringCounter): string {
  // Get best substring based on length and number of occurrences
  let bestScore = 0;
  let bestSubstring = '';
  for (const [substring, count] of substrings.entries()) {
    // Who does not like a bit of magic?
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
  const codebook: string[] = [];
  const counter = new StringCounter();
  {
    console.log('Reticulating splines...');
    const strings = new Set(originalStrings);

    console.log('Counting substrings.');
    addCounts(strings, counter);

    // Only keep up to 10000 top substrings
    // counter.trim(new Set(Array.from(counter.entries()).sort(
    //   (v1, v2) => (v2[1] * v2[0].length ** 2.2) - (v1[1] * v1[0].length ** 2.2),
    // ).slice(0, 10000).map(([substring]) => substring)));

    console.log('Creating codebook.');
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

      // TODO - does not seem to work? Some counts become zero at some point
      // TODO - do we need to keep `strings` around if we have `counter`?
      const toAdd: Set<string> = new Set();
      const toDel: Set<string> = new Set();
      for (const str of strings) {
        if (str.includes(substring)) {
          toDel.add(str);
          for (const part of str.split(substring)) {
            toAdd.add(part);
          }
        }
      }

      // Update by adding new substrings
      console.log('Add', toAdd.size);
      addCounts(toAdd, counter);
      for (const str of toAdd) {
        strings.add(str);
      }

      // Update by deleting substrings
      console.log('Del', toDel.size);
      delCounts(toDel, counter);
      for (const str of toDel) {
        strings.delete(str);
      }
    }
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
  let roundsWithNoImprovements = 0;

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

    if (roundsWithNoImprovements > 3) {
      console.log('Stopping optimization process after 3 rounds');
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
    } else {
      roundsWithNoImprovements += 1;
    }
  }

  return codebook;
}
