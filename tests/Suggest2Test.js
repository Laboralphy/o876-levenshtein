const { simplify, distance, suggest } = require('../index.js');
const { inspect } = require('util')

describe("Levenshtein Distance Function", function() {

  it("should return 0 for two empty strings", function() {
    expect(distance("", "")).toBe(0);
  });

  it("should return 0 for identical strings", function() {
    expect(distance("test", "test")).toBe(0);
  });

  it("should return 1 for a single substitution", function() {
    expect(distance("test", "tent")).toBe(1);
  });

  it("should return 1 for a single insertion", function() {
    expect(distance("test", "tests")).toBe(1);
  });

  it("should return 1 for a single deletion", function() {
    expect(distance("test", "tes")).toBe(1);
  });

  it("should return the length of the non-empty string when one string is empty", function() {
    expect(distance("", "test")).toBe(4);
  });

  it("should return 3 for the example 'kitten' -> 'sitting'", function() {
    expect(distance("kitten", "sitting")).toBe(3);
  });

  it("should return 2 for the example 'flaw' -> 'lawn'", function() {
    expect(distance("flaw", "lawn")).toBe(2);
  });

  it("should return 5 for the example 'intention' -> 'execution'", function() {
    expect(distance("intention", "execution")).toBe(5);
  });

})

describe('#suggest - find a word', function() {
  it('should find the word when this word is in list', function() {
    expect(suggest('PARIS', ['PARIS', 'BORDEAUX', 'LILLE'], { limit: 1 })).toEqual(['PARIS']);
  });
  it('should not return any suggestion when list is empty', function() {
    expect(suggest('PARIS', [])).toEqual([]);
  });
  it('displays at most 3 suggestions when not specify limit', function() {
    expect(suggest('PARIS', ['PARIS', 'BORDEAUX', 'LILLE', 'BAYONNE', 'ISSY'], { limit: 3, threshold: 1000 }))
        .toEqual(['PARIS', 'LILLE', 'ISSY']);
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
    ], { threshold: 4, limit: 0 })).toBe('a Wutai ferry ticket to Truce');
    expect(suggest('ticket truce', [
      'a Wutai ferry ticket to Truce',
      'a Wutai ferry ticket to Cinnabar Island',
      'Bye'
    ], { threshold: 4, limit: 0 })).toBe('a Wutai ferry ticket to Truce');
    expect(suggest('ticket truce', [
      'a Wutai ferry ticket to Truce',
      'a Wutai ferry ticket to Cinnabar Island',
      'Bye'
    ], { threshold: 6, limit: 0 })).toEqual('a Wutai ferry ticket to Truce');
    expect(suggest('ferry ticket truce', [
      'a Wutai ferry ticket to Truce',
      'a Wutai ferry ticket to Cinnabar Island',
      'Bye'
    ], { threshold: 6, limit: 0 })).toEqual('a Wutai ferry ticket to Truce');
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
    expect(suggest('vendeur', aList, { limit: 0 })).toBe('Vendeur à la sauvette')
    expect(suggest('vendeur sauvett', aList, { limit: 0 })).toBe('Vendeur à la sauvette')
    expect(suggest('vendeur saucisse', aList, { limit: 0 })).toBe('Vendeur de saucisses')
    expect(suggest('saucisse', aList, { limit: 0 })).toBe('Vendeur de saucisses')
    expect(suggest('sauvete', aList, { limit: 0 })).toBe('Vendeur à la sauvette')
    expect(suggest('sauve', aList, { limit: 0 })).toBe('Vendeur à la sauvette')
    expect(suggest('sauv', aList, { limit: 0 })).toBe('Vendeur à la sauvette')
    expect(suggest('sau', aList, { limit: 0 })).toBe('Vendeur à la sauvette')
    expect(suggest('sauvet', aList, { limit: 0 })).toBe('Vendeur à la sauvette')
    expect(suggest('fleche acide', aSpellList, { limit: 0 })).toBe('flèche acide')
    expect(suggest('truce', aShopList, { limit: 0 })).toBe('a Wutai ferry ticket to Truce')
    expect(suggest('ferry tocket truce', aShopList, { limit: 0 })).toBe('a Wutai ferry ticket to Truce')
    expect(suggest('truc', aShopList, { limit: 0 })).toBe('a Wutai ferry ticket to Truce')
    expect(suggest('tru', aShopList, { limit: 0 })).toBe('a Wutai ferry ticket to Truce')
    expect(suggest('cinnabar', aShopList, { limit: 0 })).toBe('a Wutai ferry ticket to Cinnabar Island')
    expect(suggest('cinnaba', aShopList, { limit: 0 })).toBe('a Wutai ferry ticket to Cinnabar Island')
    expect(suggest('cinnab', aShopList, { limit: 0 })).toBe('a Wutai ferry ticket to Cinnabar Island')
    expect(suggest('cinab', aShopList, { limit: 0 })).toBe('a Wutai ferry ticket to Cinnabar Island')
  })
  it('un seul mot doit quand même etre retrouvé dans la liste', function () {
    const aShopList = [
      'another thing',
      'a Wutai ferry ticket to Truce',
      'a Wutai ferry ticket to Cinnabar Island'
    ]
    expect(suggest('cinnaba', aShopList, { limit: 0 })).toBe('a Wutai ferry ticket to Cinnabar Island')
  })
  it('should answer "a Wutai ferry ticket to Cinnabar Island" when input is "fery tocket cinbra"', function () {
    const aShopList = [
      'another thing',
      'a Wutai ferry ticket to Truce',
      'a Wutai ferry ticket to Cinnabar Island'
    ]
    expect(suggest('cinabar', aShopList, { limit: 0 }))
        .toBe('a Wutai ferry ticket to Cinnabar Island')
    expect(suggest('fery tocket cinabar', aShopList, { limit: 0 }))
        .toBe('a Wutai ferry ticket to Cinnabar Island')
    expect(suggest('fery tocket cinabra', aShopList, { limit: 0, threshold: 6 }))
        .toBe('a Wutai ferry ticket to Cinnabar Island')
    expect(suggest('fer tick cin', aShopList, { limit: 0 }))
        .toBe('a Wutai ferry ticket to Cinnabar Island')
  })
  it('should not return something when word are too small', function () {
    const aShopList = [
      'another thing',
      'a Wutai ferry ticket to Truce',
      'a Wutai ferry ticket to Cinnabar Island'
    ]
    expect(suggest('fe ti ci', aShopList, { limit: 0 }))
        .toBeNull()
  })
  it('should not answer when input is to short', function () {
    const aShopList = [
      'another thing',
      'a Wutai ferry ticket to Truce',
      'a Wutai ferry ticket to Cinnabar Island'
    ]
    expect(suggest('fer tick cinna', aShopList, { limit: 0 }))
        .toBe('a Wutai ferry ticket to Cinnabar Island')
  })
})

describe('bug de la boule de feu', function () {
  it('should return Boule de feu when suggesting somthin for Boule de feu, among "missiles magiques" and "boule de feu"', function () {
    const aSpells = ['Missiles magiques', 'Boule de feu']
    expect(suggest('boule', aSpells, { limit: 0 }))
        .toBe('Boule de feu')
    expect(suggest('Boule', aSpells, { limit: 0 }))
        .toBe('Boule de feu')
    expect(suggest('Boule de', aSpells, { limit: 0 }))
        .toBe('Boule de feu')
    expect(suggest('Boule de feu', aSpells, { limit: 0 }))
        .toBe('Boule de feu')
    expect(suggest('Boul feu', aSpells, { limit: 0 }))
        .toBe('Boule de feu')
    expect(suggest('Boul fe', aSpells, { limit: 0 }))
        .toBe('Boule de feu')
  })
  it('should return Boule de feu when suggesting somthin for Boule de feu, among "Boule de foudre" and "boule de feu"', function () {
    const aSpells = ['Boule de foudre', 'Boule de feu']
    expect(suggest('boule', aSpells, { limit: 0 }))
        .toBe('Boule de foudre')
    expect(suggest('Boule', aSpells, { limit: 0 }))
        .toBe('Boule de foudre')
    expect(suggest('Boule de', aSpells, { limit: 0 }))
        .toBe('Boule de foudre')
    expect(suggest('Boule de feu', aSpells, { limit: 0 }))
        .toBe('Boule de feu')
    expect(suggest('Boul feu', aSpells, { limit: 0 }))
        .toBe('Boule de feu')
    expect(suggest('Boul foud', aSpells, { limit: 0 }))
        .toBe('Boule de foudre')
  })
})

describe('correction bug trailing spaces', function () {
  it ('should return "épée courte rouillée" when submitting "Épée courte", "Epée courte rouillée", "Epée courte rouillée" with input : "épée rouillée " (with a trailing space)', function () {
    const x = suggest('épée rouillée ', ['Épée courte', 'Épée courte rouillée', 'Épée courte rouillée'], { limit: 0})
    expect(x).toBe('Épée courte rouillée')
  })
})

//
// function getRelevanceMatrix (sWord, sLong) {
//   const aLong = sLong.split(' ').map(l => simplify(l))
//   const aWords = sWord.split(' ').map(w => simplify(w))
//   return aLong.map(longItem => aWords
//         .map(wordItem => ({
//           long: longItem,
//           word: wordItem,
//           distance: distance(wordItem, longItem)
//         })))
// }
//
// function buildRelevanceStruct (sInput, aList, { limit = 3, threshold = 5 } = {}) {
//   const aResult = aList
//     .map(l => {
//       const aRelevanceMatrix = getRelevanceMatrix(sInput, l)
//       const matrix = aRelevanceMatrix
//         .flat()
//         .sort((a, b) => a.distance - b.distance)
//       const inputScore = {}
//       const suggestScore = {}
//       matrix.forEach(w => {
//         if (!(w.long in inputScore)) {
//           inputScore[w.long] = w.distance
//         }
//         inputScore[w.long] = Math.min(inputScore[w.long], w.distance)
//         if (!(w.word in suggestScore)) {
//           suggestScore[w.word] = w.distance
//         }
//         suggestScore[w.word] = Math.min(suggestScore[w.word], w.distance)
//       })
//       const suggestDistances = Object.values(suggestScore).sort((a, b) => a - b)
//       const score = suggestDistances.reduce((prev, curr, i) => prev + curr / Math.pow(2, i), 0)
//       return {
//         suggest: l,
//         input: sInput,
//         matrix,
//         inputScore,
//         suggestScore,
//         suggestDistances,
//         score
//       }
//     })
//     .sort((a, b) => a.score - b.score)
//     .filter(({ score }) => score <= threshold)
//   return limit === 0
//       ? aResult.shift()?.suggest || ''
//       : aResult.slice(0, limit)
// }
//
// function betterSuggest (sInput, aList, options = {}) {
//   return buildRelevanceStruct(sInput, aList, options)
// }
//



describe('correction bug, long word sequence vs. one word', function () {
  it('should return Malédiction when inputing exact match', function () {
    const x = suggest('Malédiction', ['Grande Malédiction', 'Malédiction', 'Identification'], { limit: 0 })
    expect(x).toBe('Malédiction')
  })
  it('should return Malédiction when inputing exact match', function () {
    expect(suggest('Malédictio', ['Malédiction', 'Grande Malédiction'], { limit: 1, threshold: 4 })).toEqual(['Malédiction'])
    expect(suggest('Malédiction', ['Malédiction', 'Grande Malédiction'], { limit: 1, threshold: 4 })).toEqual(['Malédiction'])
  })
  it('x1', function () {
    expect(suggest(
        'déliv',
        ['Délivrance des malédictions', 'Malédiction', 'identification'],
        { limit: 0, threshold: 5 }
    )).toBe('Délivrance des malédictions')
  })
})


