export interface ITrie {
  chars: {
    [key: string]: ITrie;
  };
  code: number | undefined;
}

export default function makeTrie(codebook: string[]): ITrie {
  const node: ITrie = { chars: {}, code: undefined };
  for (let i = 0; i < codebook.length; i += 1) {
    const tok = codebook[i];
    let root = node;
    for (let j = 0; j < tok.length; j += 1) {
      const c = tok[j];
      if (root.chars[c] === undefined) {
        root.chars[c] = { chars: {}, code: undefined };
      }
      root = root.chars[c];
    }
    root.code = i;
  }
  return node;
}
