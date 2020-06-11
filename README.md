# O876 Levenshtein

## Description
Did you encounter this situation ?
```
Enter a city name > PARSI
Invalid name. Did you mean "PARIS" ?
```
When a user is excepted to input a name which must be part of a set of entities, it's often a good idea to display a
list of suggested valid entity names so should the user make a mistype, they may efficiently correct themselves.

This is what this library does.

## Example
```js
console.log(suggest("PARSI", ["PARIS", "BORDEAUX", "LILLE", .... ]));
console.log(suggest("BRDEAUX", ["PARIS", "BORDEAUX", "LILLE", .... ]));
console.log(suggest("LILE", ["PARIS", "BORDEAUX", "LILLE", .... ]));
```
Will display :
```
["PARIS"]

["BORDEAUX"]

["LILLE"]
```


## Usage

```
npm install @laboralphy/did-you-mean
```
In code :
```
const {suggest} = require('@laboralphy/did-you-mean'};

console.log(suggest("PARSI", ["PARIS", "BORDEAUX", "LILLE", .... ]));
// prints ["PARIS"]
```

## Options

The third (optionnal) parameters is a configuration object that holds two elements : count and relevance
- count : is a number that limits the maximum number of suggested words. Default value is 1.
- relevance : is a number that limits the maximum number of character differences between types word and suggested words.
Default value is Infinity

### Getting more than one suggestion
```
// this will returns the three closest words
suggest("...typed word...", [...list of valid words...], {count: 3});

// this will returns the three closest words that have at most a character-relevance of 2
suggest("...typed word...", [...list of valid words...], {count: 3, relevance: 2});

// this will returns all words the have a character-relevance of 2 or less
suggest("...typed word...", [...list of valid words...], {count: Infinity, relevance: 2});
```
