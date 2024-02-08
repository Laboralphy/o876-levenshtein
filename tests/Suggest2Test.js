const {distance, suggest2} = require('../index.js');

describe('#suggest - find a word', function() {
  it('should find the word when in input is in list', function() {
    expect(suggest2('PARIS', ['PARIS', 'BORDEAUX', 'LILLE'])).toEqual(['PARIS']);
  });
  it('should not return any suggestion when list is empty', function() {
    expect(suggest2('PARIS', [])).toEqual([]);
  });
  it('displays at most 3 suggestions when not specify limit', function() {
    expect(suggest2('PARIS', ['PARIS', 'BORDEAUX', 'LILLE'], { limit: 3 })).toEqual(['PARIS']);
  });
  it('displays one more suggestion thant the exact same', function() {
    expect(suggest2('wutai ferry ticket truce', [
      'a Wutai ferry ticket to Truce',
      'a Wutai ferry ticket to Cinnabar Island',
      'Bye'
    ])).toEqual(['a Wutai ferry ticket to Truce']);
    expect(suggest2('wutai ferry ticket to', [
      'a Wutai ferry ticket to Truce',
      'a Wutai ferry ticket to Cinnabar Island',
      'Bye'
    ], { threshold: 0.5 })).toEqual(['a Wutai ferry ticket to Truce', 'a Wutai ferry ticket to Cinnabar Island']);
  });
});
