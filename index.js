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

/**
 * Simplify string (strips accents, compact multiple whitespace
 * @param sInput {string}
 * @returns {string}
 */
function simplify (sInput) {
    return sInput
        .split(' ')
        .filter(s => s.trim().length > 0)
        .map(s => stripAccents(s).trim())
        .join(' ')
}

/**
 * Will suggest one or more items from the list, sorted by levenshteing distance with the input
 * @param sInput {string} searched string
 * @param aList {string[]} potential suggestions
 * @param exact {boolean} if true, do not simplified strings before computing levenshtein distance
 * @param full {boolean} if true, returns a structure, instead of mere strings
 * @param threshold {number} the lower the stricter
 * @param limit {number} limits results
 * @returns {string | string[] | any[]}
 */
function suggest (sInput, aList, { exact = false, full = false, threshold = 0.4, limit = 3 } = {}) {
    sInput = exact ? sInput : simplify(sInput)
    const aSimplifiedList = exact ? aList : aList.map(s => simplify(s))
    const r = aSimplifiedList
        .map((sugg, isugg) => {
            const d = distance(sInput, sugg)
            const score = d / sugg.length
            return {
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
        return r.length > 0 ? r[0].value : sInput
    } else {
        return r
    }
}

module.exports = {
	distance,
	suggest,
	stripAccents
}
