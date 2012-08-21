# Reservoir.js
Quickly generate a random subset of arrays, iterators, or streams with [reservoir sampling](http://en.wikipedia.org/wiki/Reservoir_sampling).

## Installation

For *Node.js*, use `npm`:

````
npm install reservoir
````

For the *browser*, add the following to your pages:

````
<script src="reservoir.js"></script>
````

## Usage

A reservoir is just an array with one very special function added - `pushSome`.

### Basic

To create an empty reservoir that will contain a *maximum* of 3 randomly-chosen items:

Within *Node.js*:

````
var Reservoir = require('reservoir');

var myReservoir = Reservoir(3);
````

Within a *browser*:
````
var myReservour = Reservoir(3); 
````

Now, using that new reservoir we begin to add items into it:

````
var myData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

myData.forEach(function(e){
	myReservoir.pushSome(e);
});
````

At this point, `myReservoir` will contain example 3 randomly-chosen values from the array `myData`:

````
myReservour => [2, 4, 7] // This can be any random subset of myData
````

### Intermediate

Since, `Reservoir.pushSome` operates much like the real `Array.push` we can pass `pushSome` more than one parameter and each one will be pushed in order. That means we can make the previous example more succinct by using `Function.apply`:

````
myReservoir.pushSome.apply(myReservoir, myData);
````

As we said before, the object returned from Reservoir() is just an array *decorated* with a `pushSome` function. That means that all normal array functions are available. Particually valuable are the iterator functions `forEach`, `map`, 

### Advanced


## API

### `Reservoir( reservoirSize = 1 [, randomNumberGenerator = Math.random] )`

Parameters:
`reservoirSize` is the maximum size of the reservoir. This is the number of elements to be randomly chosen from the input provided to it using `pushSome`.

`randomNumberGenerator` is an optional random number generating function to use in place of the default `Math.random`. 

Returns:
An empty Reservoir (an Array with the function `pushSome` added to it).

### `reservoir.pushSome( datum[, datum...])`

Parameters:
`datum` one or more elements to consider for inclusion into the reservoir.

Returns: 
A number representing the current length of the reservoir.