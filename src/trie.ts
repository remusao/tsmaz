interface ITrie {
  [key: string]: ITrie;
}

interface ICode {
  code?: number;
}

export default function makeTrie(codebook: string[]): ITrie & ICode {
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
