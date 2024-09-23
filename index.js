/**
 * compute levenshtein distance between 2 strings.
 * this the number of modifications needed to go from a string to another string
 * @param a {string} string source
 * @param b {string} string cible
 * @returns {number} editing distance
 */
function distance(a, b) {
    if (a.length === 0) {
        return b.length;
    }
    if (b.length === 0) {
        return a.length;
    }

    let al = a.length;
    let bl = b.length;
    let i, j;

    let matrix = [];

    // increment along the first column of each row
    for (i = 0; i <= bl; ++i) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    for (j = 0; j <= al; ++j) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= bl; ++i) {
        for (j = 1; j <= al; ++j) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(
                        matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1
                    )
                ); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
}

/**
 * Delete all diacritic characters : replace with ascii7bits characters : é -> e
 * @param sText {string}
 * @returns {string}
 */
function stripAccents (sText) {
  return sText.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function packSpaces (sInput) {
    return sInput.replace(/\s{2,}/g, ' ').trim()
}


/**
 * Simplify string (strips accents, compact multiple whitespace
 * @param sInput {string}
 * @returns {string}
 */
function simplify (sInput) {
    return packSpaces(stripAccents(sInput)).toLowerCase()
}

/**
 * Will suggest one or more items from the list, sorted by levenshteing distance with the input
 * @param sInput {string} searched string
 * @param aList {string[]} potential suggestions
 * @param exact {boolean} if true, do not simplified strings before computing levenshtein distance
 * @param full {boolean} if true, returns a structure, instead of mere strings
 * @param threshold {number} the lower the stricter
 * @param limit {number} limits results
 * @param multiterm {boolean} uses multi term search, more efficient to suggest when suggestion is full of multiterm strings
 * @returns {null, string | string[] | {value: string, distance: number, score: number, index: number}[]}
 */
function suggest (sInput, aList, {
    exact = false,
    full = false,
    threshold = 0.4,
    limit = 3,
    multiterm = false
} = {}) {
    sInput = exact ? sInput : simplify(sInput)
    const aSimplifiedList = exact ? aList : aList.map(s => packSpaces(s))
    const r = aSimplifiedList
        .map((sugg, isugg) => {
            const d = multiterm ? 1 : distance(sInput, simplify(sugg))
            const score = multiterm ? getMultiTermScore(sInput, sugg, { threshold }) : d / sugg.length
            return {
                input: sInput,
                value: sugg,
                distance: d,
                score,
                index: isugg
            }
        })
        .filter(({ score }) => score <= threshold)
        .sort((a, b) => {
            let r = a.score - b.score
            if (r !== 0) {
                return r
            }
            r = a.distance - b.distance
            if (r !== 0) {
                return r
            }
            r = a.index - b.index
            if (r !== 0) {
                return r
            }
            return a.value.localeCompare(b.value)
        })
        .slice(0, Math.max(1, limit))
        .map(x => (limit === 0 || full) ? x : x.value )
    if (limit === 0) {
        return r.length > 0 ? r[0].value : null
    } else {
        return r
    }
}

function getMultiTermScore (sInput, sLongItem, { exact = false, threshold = Infinity } = {}) {
    const a = []
    const aLongItems = sLongItem.split(' ')
    const aTerms = sInput.split(' ')
    for (let iTerm = 0, l = aTerms.length; iTerm < l; ++iTerm) {
        const term = aTerms[iTerm]
        const r = suggest(term, aLongItems, { exact, threshold, full: true, limit: 1 })
        if (r && r.length > 0) {
            a.push(r[0])
            aLongItems.splice(0, r[0].index + 1)
        } else {
            return Infinity
        }
    }
    return a.reduce((prev, curr) => prev * curr.score, 1)
}

function prefDistance (a, b) {
    let d = distance(a, b)
    for (let i = 0, l = Math.min(a.length, b.length); i < l; ++i) {
        if (a.charAt(i) === b.charAt(i)) {
            --d
        } else {
            break
        }
    }
    return Math.max(0, d)
}


function getRelevanceMatrix (aWords, aLong) {
    return aLong.map(longItem => aWords
        .map(wordItem => ({
            long: longItem,
            word: wordItem,
            distance: prefDistance(wordItem, longItem)
        })))
}

function filterWords (sWords) {
    return simplify(sWords)
        .split(' ')
        .filter(l => l.length > 2)
}

function buildRelevanceStruct (sInput, aList, { full = false, limit = 3, threshold = 5 } = {}) {
    const sortDiff = (a, b) => a - b
    const computeScore = (prev, curr, i) => prev + curr / Math.pow(2, i)
    const aInputWords = filterWords(sInput)
    const aResult = aList
        .map(l => {
            const aEntryWords = filterWords(l)
            const aRelevanceMatrix = getRelevanceMatrix(aInputWords, aEntryWords)
            const matrix = aRelevanceMatrix
                .flat()
                .sort((a, b) => a.distance - b.distance)
            const inputScore = {}
            const suggestScore = {}
            matrix.forEach(w => {
                if (!(w.long in inputScore)) {
                    inputScore[w.long] = w.distance
                }
                inputScore[w.long] = Math.min(inputScore[w.long], w.distance)
                if (!(w.word in suggestScore)) {
                    suggestScore[w.word] = w.distance
                }
                suggestScore[w.word] = Math.min(suggestScore[w.word], w.distance)
            })
            const suggestDistances = Object.values(suggestScore).sort(sortDiff)
            const inputDistances = Object.values(inputScore).sort(sortDiff)
            const computedSuggestedScore = suggestDistances.reduce(computeScore, 0)
            const computedInputScore = inputDistances.reduce(computeScore, 0)
            const score = matrix.length > 0
                ? (computedSuggestedScore + computedInputScore) / 2
                : Infinity
            return {
                suggest: l,
                input: sInput,
                matrix,
                inputScore,
                suggestScore,
                suggestDistances,
                inputDistances,
                score
            }
        })
        .sort((a, b) => a.score - b.score)
        .filter(({ score }) => score <= threshold)
    return limit === 0
        ? aResult.shift()?.suggest || null
        : aResult.slice(0, limit).map(x => full ? x : x.suggest)
}


module.exports = {
	distance,
	suggest: buildRelevanceStruct,
    simplify
}
