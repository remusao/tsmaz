import Smaz from './factory';

class StringCounter {
  private map: Map<string, number>;

  constructor() {
    this.map = new Map();
  }

  public get(key: string): number {
    const count = this.map.get(key);
    if (count === undefined) {
      return 0;
    }
    return count;
  }

  public incr(key: string): void {
    this.map.set(key, this.get(key) + 1);
  }

  public decr(key: string): void {
    const count = this.get(key);

    if (count === 0) {
      this.map.delete(key);
    } else {
      this.map.set(key, count - 1);
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
  // const maxNgramSize = 200;

  const len = str.length;
  for (let j = 0; j < len - 1; j += 1) {
    const remainingChars = len - j;
    for (let k = 1; k <= remainingChars; k += 1) {
      ngrams.push(str.slice(j, j + k));
    }
  }

  return ngrams;
}

function addCounts(strings: string[], counter: StringCounter): void {
  for (const str of strings) {
    for (const ngram of extractNgrams(str)) {
      counter.incr(ngram);
    }
  }
}

function delCounts(strings: string[], counter: StringCounter): void {
  for (const str of strings) {
    for (const ngram of extractNgrams(str)) {
      counter.decr(ngram);
    }
  }
}

function getNextBestSubstring(counter: StringCounter): string {
  let bestScore = 0;
  let bestSubstring = '';
  for (const [substring, count] of counter.entries()) {
    if (count > 1 && substring.length > 1) {
      // Who does not like a bit of magic?
      const score = count * substring.length ** 2.1;
      if (score > bestScore) {
        bestSubstring = substring;
        bestScore = score;
      }
    }
  }

  return bestSubstring;
}

function getCompressionRatio(codebook: string[], strings: string[]): number {
  const smaz = new Smaz(codebook);
  let totalCompressed = 0;
  let totalUncompressed = 0;

  for (const str of strings) {
    totalCompressed += smaz.getCompressedSize(str);
    totalUncompressed += str.length;
  }

  return 100.0 * (totalCompressed / totalUncompressed);
}

function fineTuneCodebook(
  codebook: string[],
  strings: string[],
  candidates: string[],
): void {
  let bestRatio = getCompressionRatio(codebook, strings);
  let roundsWithNoImprovements = 0;

  // Fine-tune codebook with letters
  for (const candidate of candidates) {
    // If codebook is not full yet, just add the letter at the end
    if (codebook.length < 254) {
      codebook.push(candidate);
      console.log(
        `Codebook not full, adding : ${candidate} = ${getCompressionRatio(
          codebook,
          strings,
        )}`,
      );
      continue;
    }

    if (roundsWithNoImprovements >= 3) {
      console.log('Stopping optimization process after 3 rounds');
      break;
    }

    // Codebook is full, try to find a spot
    let bestR = 100;
    let insertAt = -1;
    console.log('?', candidate);
    for (let j = 0; j < codebook.length; j += 1) {
      const prev = codebook[j];
      codebook[j] = candidate;
      const ratio = getCompressionRatio(codebook, strings);
      codebook[j] = prev;
      if (ratio < bestR) {
        bestR = ratio;
        insertAt = j;
      }
    }

    if (bestR < bestRatio) {
      console.log(
        `replacing ${codebook[insertAt]} with ${candidate} = ${bestR}% (-${(
          bestRatio - bestR
        ).toFixed(3)}%)`,
      );
      codebook[insertAt] = candidate;
      bestRatio = bestR;
      roundsWithNoImprovements = 0;
    } else {
      roundsWithNoImprovements += 1;
    }
  }
}

export default function generate(originalStrings: string[]): string[] {
  const codebook: string[] = [];
  const counter = new StringCounter();

  {
    console.log('Counting substrings.');
    const removedStrings: Set<string> = new Set();
    const strings = [...originalStrings];
    addCounts(strings, counter);

    console.log('Creating codebook.');
    for (let i = 0; i < 254; i += 1) {
      const substring = getNextBestSubstring(counter);
      if (substring.length === 0) {
        console.log('No more strings', i);
        break;
      }

      codebook.push(substring);

      console.log(
        `+ ${substring} = ${getCompressionRatio(codebook, originalStrings)}%`,
      );

      const toAdd: string[] = [];
      const toDel: string[] = [];
      for (const str of strings) {
        if (
          removedStrings.has(str) === false &&
          str.includes(substring) === true
        ) {
          toDel.push(str);
          for (const part of str.split(substring)) {
            if (part.length !== 0) {
              toAdd.push(part);
            }
          }
        }
      }

      // Update by adding new substrings
      // console.log('Add', toAdd.length);
      addCounts(toAdd, counter);
      for (const str of toAdd) {
        strings.push(str);
      }

      // Update by deleting substrings
      // console.log('Del', toDel.length);
      delCounts(toDel, counter);
      for (const str of toDel) {
        removedStrings.add(str);
      }
    }
  }

  // Fine-tune with 3-grams, 2-grams
  for (const { n, candidates } of [
    { n: 6, candidates: 10 },
    { n: 5, candidates: 10 },
    { n: 4, candidates: 10 },
    { n: 3, candidates: 10 },
    { n: 2, candidates: 10 },
  ]) {
    const ngrams: [string, number][] = [];
    for (const [substring, count] of counter.entries()) {
      if (substring.length === n) {
        ngrams.push([substring, count]);
      }
    }

    // Sort ngrams from most popular to least popular
    ngrams.sort((v1, v2) => v2[1] - v1[1]);
    console.log('Fine-tune codebook with ngrams', ngrams);
    fineTuneCodebook(
      codebook,
      originalStrings,
      ngrams.map(([ngram]) => ngram).slice(0, candidates),
    );
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

  console.log('Fine-tune codebook with letters', lettersCodebook);
  fineTuneCodebook(
    codebook,
    originalStrings,
    lettersCodebook.map(([letter]) => letter),
  );

  return codebook;
}
