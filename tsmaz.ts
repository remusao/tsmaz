import defaultDictionary from './src/dictionary';
import factory from './src/factory';
import generate from './src/generate';

const { compress, decompress } = factory(defaultDictionary);
export { compress, decompress, factory, generate };
