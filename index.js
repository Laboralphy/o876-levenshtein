/**
 * compute levenshtein distance between 2 strings.
 * this the number of modifications needed to go from a string to another string
 * @param a {string} string source
 * @param b {string} string cible
 * @returns {number} editing distance
 */
function levenshteinDistance(a, b) {
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
 * Transforms all sequence of contiguous spaces by one space
 * @param sInput {string}
 * @returns {string}
 */
function packSpaces (sInput) {
    return sInput.replace(/\s{2,}/g, ' ')
}

/**
 * Simplify string (strips accents, compact multiple whitespace
 * @param sInput {string}
 * @returns {string}
 */
function simplify (sInput) {
    return packSpaces(stripAccents(sInput)).toLowerCase()
}

const REGEXP_SPACE_SPLITTER = /\s+/

/**
 * Compares a string to all proposal strings and choose the closest proposal string to the input string
 * returns '' if no string was found
 * @param inputString {string}
 * @param proposalStrings {string[]}
 * @returns {string|string[]}
 */
function suggest(inputString, proposalStrings) {
    const inputTokens = simplify(inputString).split(REGEXP_SPACE_SPLITTER);
    let bestMatch = '';
    let minDistance = Infinity;

    for (const proposal of proposalStrings) {
        const proposalTokens = simplify(proposal).split(REGEXP_SPACE_SPLITTER);
        let distance = 0;

        for (const token of inputTokens) {
            let minTokenDistance = Infinity;
            for (const propToken of proposalTokens) {
                const tokenDistance = levenshteinDistance(token, propToken);
                if (tokenDistance < minTokenDistance) {
                    minTokenDistance = tokenDistance;
                }
            }
            distance += minTokenDistance;
        }

        if (distance < minDistance) {
            minDistance = distance;
            bestMatch = proposal;
        }
    }
    return bestMatch;
}

module.exports = {
	levenshteinDistance,
	suggest,
	stripAccents,
}
