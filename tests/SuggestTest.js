const { suggest } = require('../index');

describe('when having one word for each proposal', function () {
    it('should return key when input is key', function () {
        expect(suggest('key', ['koy', 'key', 'kye', 'kay'])).toEqual('key');
    })
})

describe('when having several-word proposal', function () {
    it('should return "cible d\'entrainement au tir" when typing "cible"', function () {
        const proposals = [
            'Cible d\'entrainement au tir',
            'Clé de bronze 1'
        ]
        const input = 'cible'
        expect(suggest(input, proposals)).toEqual('Cible d\'entrainement au tir');
    })
})

describe('when choosing one ticket among several', function () {
    it('should choose right ticket when only inputing destination', function () {
        const proposals = [
            'a Wutai ferry ticket to Truce',
            'a Wutai ferry ticket to Cinnabar Island',
            'Bye'
        ]
        expect(suggest('truce', proposals)).toEqual('a Wutai ferry ticket to Truce');
        expect(suggest('cinnabar', proposals)).toEqual('a Wutai ferry ticket to Cinnabar Island');
        // now with typos
        expect(suggest('cinabar', proposals)).toEqual('a Wutai ferry ticket to Cinnabar Island');
        expect(suggest('cinabr', proposals)).toEqual('a Wutai ferry ticket to Cinnabar Island');
        expect(suggest('wtai', proposals)).toEqual('a Wutai ferry ticket to Truce');
    })
    it('should return "a Wutai ferry ticket to Cinnabar Island" when inputing shambalar', function () {
        const proposals = [
            'a Wutai ferry ticket to Truce',
            'a Wutai ferry ticket to Cinnabar Island',
            'Bye'
        ]
        expect(suggest('shambalar', proposals)).toEqual('');
    })
})

describe('problem with short words', function () {
    it('should choose "Epee du chaos" when input is "épée de chaos"', function () {
        const proposals = [
            'Epée de feu',
            'Epée du chaos'
        ]
        expect(suggest('épée de chaos', proposals)).toEqual('Epée du chaos');
        expect(suggest('épée de chzos', proposals)).toEqual('Epée du chaos');
        expect(suggest('pée de chzos', proposals)).toEqual('Epée du chaos');
    })
    it('should choose "Epee du chaos" when input is "épée de chaos" and proposal is "chaos", "feu"', function () {
        const proposals = [
            'Epée du chaos',
            'Epée de feu'
        ]
        expect(suggest('épée de chaos', proposals)).toEqual('Epée du chaos');
        expect(suggest('épée de chzos', proposals)).toEqual('Epée du chaos');
        expect(suggest('pée de chzos', proposals)).toEqual('Epée du chaos');
    })
    it('should choose "Epee du feu" when input is "épée du feu"', function () {
        const proposals = [
            'Epée de feu',
            'Epée du chaos'
        ]
        expect(suggest('épée du feu', proposals)).toEqual('Epée de feu');
        expect(suggest('épée du fei', proposals)).toEqual('Epée de feu');
        expect(suggest('pée du fei', proposals)).toEqual('Epée de feu');
    })
})

describe('chaines trop distantes', function () {
    it('should not return any string when input has too much distance', function () {
        const proposals = [
            'Flêche acide de Melf',
            'Flétrissure horrible d\'Abi-Dalsim',
            'Sphère résiliente d\'Otiluke',
            'Main impérieuse de Bigby',
            'Coffre en bois ouvragé',
            'Chest you can open with a key',
            'Coffre en métal rouillé',
            'Sacoche en cuir véritable',
            'Potion de rapidité'
        ]
        expect(suggest('main imperieuse de bigby', proposals, {
            full: true,
            count: Infinity,
            maxDistance: Infinity
        })).toEqual([
            { distance: 0, proposal: 'Main impérieuse de Bigby' },
            { distance: 16, proposal: 'Flêche acide de Melf' },
            { distance: 16, proposal: 'Chest you can open with a key' },
            { distance: 16, proposal: 'Potion de rapidité' },
            { distance: 17, proposal: 'Coffre en bois ouvragé' },
            { distance: 17, proposal: 'Sacoche en cuir véritable' },
            { distance: 18, proposal: 'Coffre en métal rouillé' },
            { distance: 24, proposal: "Sphère résiliente d'Otiluke" },
            { distance: 28, proposal: "Flétrissure horrible d'Abi-Dalsim" }
        ])
        expect(suggest('main imperieuse de bigby', proposals)).toBe('Main impérieuse de Bigby')
        expect(suggest('maix imperieuxx de bigbx', proposals)).toBe('Main impérieuse de Bigby')
        expect(suggest('maxx ixxeriexxx de bigxx', proposals)).toBe('')
        expect(suggest('tarte tatin', proposals)).toBe('')
        expect(suggest('tarte tatinxx', proposals)).toBe('')
    })
})