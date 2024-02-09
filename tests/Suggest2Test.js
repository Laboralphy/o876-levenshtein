const { distance, suggest } = require('../index.js');

describe('#suggest - find a word', function() {
  it('should find the word when this word is in list', function() {
    expect(suggest('PARIS', ['PARIS', 'BORDEAUX', 'LILLE'])).toEqual(['PARIS']);
  });
  it('should not return any suggestion when list is empty', function() {
    expect(suggest('PARIS', [])).toEqual([]);
  });
  it('displays at most 3 suggestions when not specify limit', function() {
    expect(suggest('PARIS', ['PARIS', 'BORDEAUX', 'LILLE', 'BAYONNE', 'ISSY'], { limit: 3, threshold: 1000 }))
        .toEqual(['PARIS', 'BAYONNE', 'BORDEAUX']);
  });
  it('test 111', function() {
    expect(suggest('PARIS', ['PARIS', 'PARISIEN', 'PARISIENNE', 'PARIS-SUR-SEINE'], { limit: 3, threshold: 1000 }))
        .toEqual(['PARIS', 'PARISIEN', 'PARISIENNE']);
  });
  it('should display "a Wutai ferry ticket to Truce" when specifying only "truce"', function() {
    expect(suggest('truce', [
      'a Wutai ferry ticket to Truce',
      'a Wutai ferry ticket to Cinnabar Island',
      'Bye'
    ], { threshold: Infinity, limit: 1 })).toEqual(['a Wutai ferry ticket to Truce']);
  });
});

describe('#distance', function() {
  it('should return 0 when string are same', function() {
    expect(distance('PARIS', 'PARIS')).toBe(0);
  });
  it('should return 1 when one more letter', function() {
    expect(distance('PARIS', 'PARISA')).toBe(1);
  });
  it('should return 1 when one letter is missing', function() {
    expect(distance('PARIS', 'PARI')).toBe(1);
  });
  it('should return 2 when two letters are swapped', function() {
    expect(distance('PARIS', 'PIRAS')).toBe(2);
  });
})
