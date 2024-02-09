const { getMultiTermScore, distance, suggest } = require('../index.js');

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
  it('should return "a Wutai ferry ticket to Truce" when specifying only "truce" and limit 0', function() {
    expect(suggest('truce', [
      'a Wutai ferry ticket to Truce',
      'a Wutai ferry ticket to Cinnabar Island',
      'Bye'
    ], { threshold: Infinity, limit: 0 })).toEqual('a Wutai ferry ticket to Truce');
  });
  it('should return "" when specifying only "Shambalar" and limit 0', function() {
    expect(suggest('truce', [
      'a Wutai ferry ticket to Truce',
      'a Wutai ferry ticket to Cinnabar Island',
      'Bye'
    ], { threshold: 0.4, limit: 0 })).toBeNull();
    expect(suggest('ticket truce', [
      'a Wutai ferry ticket to Truce',
      'a Wutai ferry ticket to Cinnabar Island',
      'Bye'
    ], { threshold: 0.4, limit: 0 })).toBeNull();
    expect(suggest('ticket truce', [
      'a Wutai ferry ticket to Truce',
      'a Wutai ferry ticket to Cinnabar Island',
      'Bye'
    ], { threshold: 0.6, limit: 0 })).toEqual('a Wutai ferry ticket to Truce');
    expect(suggest('ferry ticket truce', [
      'a Wutai ferry ticket to Truce',
      'a Wutai ferry ticket to Cinnabar Island',
      'Bye'
    ], { threshold: 0.4, limit: 0 })).toEqual('a Wutai ferry ticket to Truce');
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

describe('autoriser recherche avec un input de peu de mot', function () {
  it('should return "Vendeur à la sauvette" when inputing "vendeur"', function () {
    const aList = [
        'Gobelin',
        'Personne du peuple',
        'Vendeur de saucisses',
        'Vendeur à la sauvette'
    ]
    const aSpellList = [
        'projectiles magiques',
        'projection d\'acide',
        'flèche acide',
        'flèche enflammée',
        'invisibilité',
        'peau de pierre'
    ]
    const aShopList = [
      'another thing',
      'a Wutai ferry ticket to Truce',
      'a Wutai ferry ticket to Cinnabar Island'
    ]
    expect(suggest('vendeur', aList, { multiterm: true, limit: 0 })).toBe('Vendeur de saucisses')
    expect(suggest('vendeur sauvett', aList, { multiterm: true, limit: 0 })).toBe('Vendeur à la sauvette')
    expect(suggest('vendeur saucisse', aList, { multiterm: true, limit: 0 })).toBe('Vendeur de saucisses')
    expect(suggest('saucisse', aList, { multiterm: true, limit: 0 })).toBe('Vendeur de saucisses')
    expect(suggest('sauvete', aList, { multiterm: true, limit: 0 })).toBe('Vendeur à la sauvette')
    expect(suggest('sauve', aList, { multiterm: true, limit: 0 })).toBe('Vendeur à la sauvette')
    expect(suggest('sauv', aList, { multiterm: true, limit: 0 })).toBeNull()
    expect(suggest('sauvet', aList, { multiterm: true, limit: 0 })).toBe('Vendeur à la sauvette')
    expect(suggest('fleche acide', aSpellList, { multiterm: true, limit: 0 })).toBe('flèche acide')
    expect(suggest('truce', aShopList, { multiterm: true, limit: 0 })).toBe('a Wutai ferry ticket to Truce')
    expect(suggest('ferry tocket truce', aShopList, { multiterm: true, limit: 0 })).toBe('a Wutai ferry ticket to Truce')
    expect(suggest('truc', aShopList, { multiterm: true, limit: 0 })).toBe('a Wutai ferry ticket to Truce')
    expect(suggest('tru', aShopList, { multiterm: true, limit: 0 })).toBeNull()
    expect(suggest('cinnabar', aShopList, { multiterm: true, limit: 0 })).toBe('a Wutai ferry ticket to Cinnabar Island')
    expect(suggest('cinnaba', aShopList, { multiterm: true, limit: 0 })).toBe('a Wutai ferry ticket to Cinnabar Island')
    expect(suggest('cinnab', aShopList, { multiterm: true, limit: 0 })).toBe('a Wutai ferry ticket to Cinnabar Island')
    expect(suggest('cinab', aShopList, { multiterm: true, limit: 0 })).toBeNull()
  })
  it('should answer "a Wutai ferry ticket to Cinnabar Island" when input is "fery tocket cinbra"', function () {
    const aShopList = [
      'another thing',
      'a Wutai ferry ticket to Truce',
      'a Wutai ferry ticket to Cinnabar Island'
    ]
    expect(suggest('fery tocket cinbra', aShopList, { multiterm: true, limit: 0 }))
        .toBe('a Wutai ferry ticket to Cinnabar Island')
    expect(suggest('fery tocket cinabra', aShopList, { multiterm: true, limit: 0 }))
        .toBe('a Wutai ferry ticket to Cinnabar Island')
    expect(suggest('fer tick cin', aShopList, { multiterm: true, limit: 0 }))
        .toBe('a Wutai ferry ticket to Cinnabar Island')
    expect(suggest('fe ti ci', aShopList, { multiterm: true, limit: 0 }))
        .toBeNull()
  })
  it('should not answer when input is to short', function () {
    const aShopList = [
      'another thing',
      'a Wutai ferry ticket to Truce',
      'a Wutai ferry ticket to Cinnabar Island'
    ]
    expect(suggest('fer tick cin', aShopList, { multiterm: true, limit: 0 }))
        .toBeNull()
  })
})
