const Benchmark = require('benchmark');
const { compress, decompress, Smaz, getCompressedSize } = require('.');

(function main() {
  const suite = new Benchmark.Suite;

  suite
    .add('#factory', function() {
      return new Smaz([
        ' ',
        'the',
        'e',
        't',
        'a',
        'of',
        'o',
        'and',
        'i',
        'n',
        's',
        'e ',
        'r',
        ' th',
        ' t',
        'in',
        'he',
        'th',
        'h',
        'he ',
        'to',
        '\r\n',
        'l',
        's ',
        'd',
        ' a',
        'an',
        'er',
        'c',
        ' o',
        'd ',
        'on',
        ' of',
        're',
        'of ',
        't ',
        ', ',
        'is',
        'u',
        'at',
        '   ',
        'n ',
        'or',
        'which',
        'f',
        'm',
        'as',
        'it',
        'that',
        '\n',
        'was',
        'en',
        '  ',
        ' w',
        'es',
        ' an',
        ' i',
        'f ',
        'g',
        'p',
        'nd',
        ' s',
        'nd ',
        'ed ',
        'w',
        'ed',
        'http://',
        'https://',
        'for',
        'te',
        'ing',
        'y ',
        'The',
        ' c',
        'ti',
        'r ',
        'his',
        'st',
        ' in',
        'ar',
        'nt',
        ',',
        ' to',
        'y',
        'ng',
        ' h',
        'with',
        'le',
        'al',
        'to ',
        'b',
        'ou',
        'be',
        'were',
        ' b',
        'se',
        'o ',
        'ent',
        'ha',
        'ng ',
        'their',
        '"',
        'hi',
        'from',
        ' f',
        'in ',
        'de',
        'ion',
        'me',
        'v',
        '.',
        've',
        'all',
        're ',
        'ri',
        'ro',
        'is ',
        'co',
        'f t',
        'are',
        'ea',
        '. ',
        'her',
        ' m',
        'er ',
        ' p',
        'es ',
        'by',
        'they',
        'di',
        'ra',
        'ic',
        'not',
        's, ',
        'd t',
        'at ',
        'ce',
        'la',
        'h ',
        'ne',
        'as ',
        'tio',
        'on ',
        'n t',
        'io',
        'we',
        ' a ',
        'om',
        ', a',
        's o',
        'ur',
        'li',
        'll',
        'ch',
        'had',
        'this',
        'e t',
        'g ',
        ' wh',
        'ere',
        ' co',
        'e o',
        'a ',
        'us',
        ' d',
        'ss',
        ' be',
        ' e',
        's a',
        'ma',
        'one',
        't t',
        'or ',
        'but',
        'el',
        'so',
        'l ',
        'e s',
        's,',
        'no',
        'ter',
        ' wa',
        'iv',
        'ho',
        'e a',
        ' r',
        'hat',
        's t',
        'ns',
        'ch ',
        'wh',
        'tr',
        'ut',
        '/',
        'have',
        'ly ',
        'ta',
        ' ha',
        ' on',
        'tha',
        '-',
        ' l',
        'ati',
        'en ',
        'pe',
        ' re',
        'there',
        'ass',
        'si',
        ' fo',
        'wa',
        'ec',
        'our',
        'who',
        'its',
        'z',
        'fo',
        'rs',
        'ot',
        'un',
        'im',
        'th ',
        'nc',
        'ate',
        'ver',
        'ad',
        ' we',
        'ly',
        'ee',
        ' n',
        'id',
        ' cl',
        'ac',
        'il',
        'rt',
        ' wi',
        'e, ',
        ' it',
        'whi',
        ' ma',
        'ge',
        'x',
        'e c',
        'men',
        '.com',
      ]);
    })
    .add('#compress', function() {
      compress('');
      compress('This is a small string');
      compress('foobar');
      compress('the end');
      compress('not-a-g00d-Exampl333');
      compress('Smaz is a simple compression library');
      compress('Nothing is more difficult, and therefore more precious, than to be able to decide');
      compress('this is an example of what works very well with smaz');
      compress('1000 numbers 2000 will 10 20 30 compress very little');
      compress('Nel mezzo del cammin di nostra vita, mi ritrovai in una selva oscura');
      compress('Mi illumino di immenso');
      compress("L'autore di questa libreria vive in Sicilia");
      compress('http://google.com');
      compress('http://programming.reddit.com');
      compress('http://github.com/antirez/smaz/tree/master');
    })
    .add('#getCompressedSize', function() {
      getCompressedSize('');
      getCompressedSize('This is a small string');
      getCompressedSize('foobar');
      getCompressedSize('the end');
      getCompressedSize('not-a-g00d-Exampl333');
      getCompressedSize('Smaz is a simple compression library');
      getCompressedSize('Nothing is more difficult, and therefore more precious, than to be able to decide');
      getCompressedSize('this is an example of what works very well with smaz');
      getCompressedSize('1000 numbers 2000 will 10 20 30 compress very little');
      getCompressedSize('Nel mezzo del cammin di nostra vita, mi ritrovai in una selva oscura');
      getCompressedSize('Mi illumino di immenso');
      getCompressedSize("L'autore di questa libreria vive in Sicilia");
      getCompressedSize('http://google.com');
      getCompressedSize('http://programming.reddit.com');
      getCompressedSize('http://github.com/antirez/smaz/tree/master');
    })
    .add('#decompress', function() {
      decompress(new Uint8Array([]));
      decompress(new Uint8Array([254, 84, 76, 56, 168, 61, 169, 152, 61, 191, 70]));
      decompress(new Uint8Array([216, 6, 90, 79]));
      decompress(new Uint8Array([1, 167, 60]));
      decompress(new Uint8Array([132, 200, 4, 200, 58, 255, 2, 48, 48, 24, 200, 254, 69, 241, 4, 45, 59, 22, 255, 3, 51, 51, 51]));
      decompress(new Uint8Array([254, 83, 169, 215, 56, 168, 61, 220, 59, 87, 160, 45, 59, 33, 165, 107, 201, 8, 90, 130, 12, 83]));
      decompress(new Uint8Array([254, 78, 218, 102, 99, 116, 45, 42, 11, 129, 44, 44, 131, 38, 22, 3, 148, 62, 206, 68, 11, 45, 42, 11, 59, 33, 28, 144, 163, 36, 199, 143, 96, 92, 25, 90, 87, 82, 164, 211, 230, 2]));
      decompress(new Uint8Array([155, 56, 168, 41, 2, 241, 4, 45, 59, 87, 32, 158, 135, 64, 42, 254, 107, 23, 224, 71, 145, 152, 235, 221, 10, 169, 215]));
      decompress(new Uint8Array([255, 4, 49, 48, 48, 48, 229, 38, 45, 92, 217, 0, 255, 4, 50, 48, 48, 48, 235, 152, 0, 255, 2, 49, 48, 0, 255, 2, 50, 48, 0, 255, 2, 51, 48, 160, 45, 59, 33, 165, 0, 224, 71, 151, 3, 3, 87]));
      decompress(new Uint8Array([254, 78, 174, 123, 2, 215, 215, 96, 106, 176, 28, 4, 45, 45, 105, 129, 229, 6, 77, 130, 0, 109, 47, 4, 36, 45, 8, 185, 47, 115, 109, 4, 8, 78, 0, 219, 162, 95, 22, 109, 162, 6, 10, 28, 150, 4]));
      decompress(new Uint8Array([254, 77, 8, 56, 152, 38, 45, 15, 96, 129, 56, 45, 243, 175]));
      decompress(new Uint8Array([255, 2, 76, 39, 4, 192, 42, 11, 129, 0, 254, 113, 38, 54, 196, 201, 8, 90, 33, 114, 162, 109, 182, 11, 105, 254, 83, 131, 233, 8, 4]));
      decompress(new Uint8Array([66, 58, 6, 6, 58, 87, 244]));
      decompress(new Uint8Array([66, 59, 115, 58, 130, 45, 45, 70, 110, 33, 24, 129, 3, 244]));
      decompress(new Uint8Array([66, 58, 47, 18, 38, 90, 244, 193, 26, 74, 33, 215, 193, 10, 169, 215, 193, 191, 228, 193, 169, 77, 27]));
    })
    .on('cycle', function(event) {
      console.log(String(event.target));
    })
    .on('complete', function() {
      console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({ 'async': false });
})();
