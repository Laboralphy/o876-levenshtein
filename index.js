/**
 * compute levenshtein distance between 2 strings
 * @param a {string} string source
 * @param b {string} string cible
 * @returns {number}
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

function _recognizeOne (sCommand, aSuggest) {
  // chaque mots de suggest est comparé à command
  // on obtien un tableau de distance
  // on trie le tableau
  return aSuggest
    .map((s, i) => distance(sCommand, s))
    .reduce((prev, curr) => Math.min(prev, curr), Infinity)
}

function _recognizeSev (command, suggest) {
  const aSuggest = Array.isArray(suggest) ? suggest : suggest.split(' ')
  const aCommand = Array.isArray(command) ? command : command.split(' ')
  return aCommand.map(s => _recognizeOne(s, aSuggest))
}

function computeArrayScore (a, n, p) {
  const a2 = a.slice(0, n)
  while (a2.length < n) {
    a2.push(0)
  }
  return a2.reduce((prev, curr) => prev * p + curr, 0)
}

function getScore (sCommand, sSuggest) {
  return computeArrayScore(_recognizeSev(
    stripAccents(sCommand).toLowerCase(),
    stripAccents(sSuggest).toLowerCase()
  ), 3, 10)
}

/**
 * Compare sWords with each string in the aList array.
 * returns the most resembling string
 * @param sWords {string}
 * @param aList {string[]}
 * @returns {string[]}
 */
function suggest (sWords, aList, { count = 0, relevance = Infinity } = {}) {
  const aCommandArray = stripAccents(sWords).toLowerCase().split(' ')
  const aResults =  aList.map(x => ({
    text: x,
    score: computeArrayScore(
      _recognizeSev(
        aCommandArray,
        stripAccents(x).toLowerCase().split(' ')
      ), 3, 10
    )
  }))
    .filter(x => x.score <= relevance)
    .sort((a, b) => a.score - b.score)
  if (aResults.length === 0) {
    return aResults
  }
  // déterminer le top score
  const nTopScore = aResults[0].score
  // filtrer les top scores et les autres
  const aTopScores = aResults.filter(({ score }) => score === nTopScore)
  const aLowerScores = aResults.filter(({ score }) => score !== nTopScore).slice(0, count)
  return aTopScores.concat(aLowerScores)
    .map(({ text }) => text)
}

module.exports = {
	distance,
	suggest,
	stripAccents
}
