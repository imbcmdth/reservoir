# Reservoir.js
Quickly generate a random subset of arrays, iterators, or streams with [reservoir sampling](http://en.wikipedia.org/wiki/Reservoir_sampling).

## Installation

For Node.js, use `npm`:

````
npm install reservoir
````

For the browser, add the following to the page you wish to use Reservoir:

````
<script src="reservoir.js"></script>
````

## Simple Usage

A reservoir is just an array with one special function added, `pushSome`.

To create an empty reservoir that will contain a *maximum* of 3 randomly-chosen items:

Within `Node.js`:

````
var Reservoir = require('reservoir');

var myReservoir = Reservoir(10);
````

Within the browser:
````
var myReservour = Reservoir(10); 
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
myReservour => [2, 4, 7]
````

## More Usage

Since, `Reservoir.pushSome` operates much like `push` we can actually pass `pushSome` more than one parameter. That means we can make the previous example more succinct by using `Function.apply`:

````
myReservoir.pushSome.apply(myReservoir, myData);
````