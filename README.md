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
```
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

