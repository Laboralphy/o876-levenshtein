const {distance, suggest} = require('../index.js');

describe('#suggest - find a word', function() {
  it('word correctly type, so it should find it', function() {
    expect(suggest('PARIS', ['PARIS', 'BORDEAUX', 'LILLE'])).toEqual(['PARIS']);
  });
  it('should not return any suggestion', function() {
    expect(suggest('PARIS', [])).toEqual([]);
  });
  it('displays at most 3 suggestions but if word is to different (2 char operations or more)', function() {
    expect(suggest('PARIS', ['PARIS', 'BORDEAUX', 'LILLE'], {count: 3, relevance: 2})).toEqual(['PARIS']);
  });
  it('displays at most 2 suggestions', function() {
    expect(suggest('PARIS', ['PARIS', 'BORDEAUX', 'LILLE'], {count: 2})).toEqual(['PARIS', 'LILLE']);
  });
});



describe('#distance', function() {
  it('should return 0', function() {
    expect(distance('PARIS', 'PARIS')).toBe(0);
  });
  it('should return 0', function() {
    expect(distance('PARIS', 'PARISA')).toBe(1);
  });
  it('should return 0', function() {
    expect(distance('PARIS', 'PARI')).toBe(1);
  });
  it('should return 0', function() {
    expect(distance('PARIS', 'PIRAS')).toBe(2);
  });
})

describe('#suggest', function () {
  it('long phrase', function () {
    expect(suggest(
      'fery tocket truc',
      [
        'a Wutai ferry ticket to Truce',
        'a Wutai ferry ticket to Cinnabar Island',
        'another thing'
      ], {relevance: 234}
    )).toEqual([
      'a Wutai ferry ticket to Truce'
    ])
  })
})
