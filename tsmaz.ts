import defaultDictionary from './src/dictionary';
import factory from './src/factory';
import generate from './src/generate';

const defaultSmaz = factory(defaultDictionary);
const compress = defaultSmaz[0];
const decompress = defaultSmaz[1];

export { compress, decompress, factory, generate };
