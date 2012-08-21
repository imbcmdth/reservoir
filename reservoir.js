(function (root, factory) {
		"use strict";

		if (typeof exports === 'object') {
			module.exports = factory();
		} else if (typeof define === 'function' && define.amd) {
			define(factory);
		} else {
			root.Reservoir = factory();
		}
	}(this, function () {
		"use strict";

		// We use the same constant specified in [Vitt85]
		var switchToAlgorithmZConstant = 22;

		function _Reservoir(reservoirSize, randomNumberGen) {
			var targetArray = [];
			var rng = randomNumberGen || Math.random;
			var reservoirSize =
				Math.max(1, Math.floor(reservoirSize) || 1) >> 0;
			var algorithmXCount = 0;
			var totalItemCount = 0;
			var numToSkip = -1;
			var currentAlgorithm = algorithmX;
			var switchThreshold = 
				switchToAlgorithmZConstant * reservoirSize;
			var W = Math.exp(-Math.log(rng()) / reservoirSize);

			targetArray.pushSome = function() {
				this.length = Math.min(this.length, reservoirSize);

				for(var i = 0; i < arguments.length; i++) {
					addSample.call(this, arguments[i]);
				}

				return this.length;
			};

			var addSample = function(sample) {
				// Prefill the reservoir if it isn't full
				if(totalItemCount < reservoirSize) {
					this.push(sample);
				} else {
					if(numToSkip < 0) {
						numToSkip = currentAlgorithm();
					}
					if(numToSkip === 0) {
						replaceRandomSample(sample, this);
					}
					numToSkip--;
				}
				totalItemCount++;
				return this;
			};

			function skipIterations(iterator) {
				var sample;

				do {
					totalItemCount++;
					sample = iterator();
				} while(numToSkip-- > 0);
				return sample;
			}

			function skipIterationsAndReplace(iterator, reservoir) {
				var sample = skipIterations(iterator);
				replaceRandomSample(sample, reservoir);
			}

			function replaceRandomSample(sample, reservoir) {
				// Typically, the new sample replaces the "evicted" sample
				// but below we remove the evicted sample and push the
				// new value to ensure that reservoir is sorted in the
				// same order as the input data (ie. iterator or array).
				var randomIndex = Math.floor(rng() * reservoirSize);
				reservoir.splice(randomIndex, 1);
				reservoir.push(sample);
			}

			// From [Vitt85], "Algorithm X"
			// Selects random elements from an unknown-length input with a
			// time-complexity of:
			//   O(N)
			// Where:
			//   N = the size of the input
			function algorithmX() {
				var localItemCount = totalItemCount,
				    randomValue = rng(),
				    toSkip = 0,
				    quotient;

				if (totalItemCount <= switchThreshold) {
					localItemCount++;
					algorithmXCount++;
					quotient = algorithmXCount / localItemCount;

					while (quotient > randomValue) {
						toSkip++;
						localItemCount++;
						algorithmXCount++;
						quotient = (quotient * algorithmXCount) / localItemCount;
					}
				} else {
					currentAlgorithm = algorithmZ;
					return currentAlgorithm();
				}
				return toSkip;
			}

			// From [Vitt85], "Algorithm Z"
			// Selects random elements from an unknown-length input with a
			// time-complexity of:
			//   O(n(1 + log (N / n)))
			// Where:
			//   n = the size of the reservoir
			//   N = the size of the input
			function algorithmZ() {
				var term = totalItemCount - reservoirSize + 1,
				    denom,
				    numer,
				    numer_lim;

				while(true) {
					var randomValue = rng();
					var x = totalItemCount * (W - 1);
					var toSkip = Math.floor(x);

					var subterm = ((totalItemCount + 1) / term);
					subterm *= subterm;
					var termSkip = term + toSkip;
					var lhs = Math.exp(Math.log(((randomValue * subterm) * termSkip)/ (totalItemCount + x)) / reservoirSize); 
					var rhs = (((totalItemCount + x) / termSkip) * term) / totalItemCount;

					if(lhs <= rhs) {
						W = rhs / lhs;
						break;
					}

					var y = (((randomValue * (totalItemCount + 1)) / term) * (totalItemCount + toSkip + 1)) / (totalItemCount + x);

					if(algorithmXCount < toSkip) {
						denom = totalItemCount;
						numer_lim = term + toSkip;
					} else {
						denom = totalItemCount - algorithmXCount + toSkip;
						numer_lim = totalItemCount + 1;
					}

					for(numer = totalItemCount + toSkip; numer > numer_lim; numer --) {
						y = (y * numer) / denom;
						denom--;
					}

					W = Math.exp(-Math.log(rng()) / reservoirSize);

					if(Math.exp(Math.log(y) / reservoirSize) <= (totalItemCount + toSkip)) {
						break;
					}
				}
				return toSkip;
			}
			return targetArray;
		}

		return _Reservoir;

		// REFERENCES
		// [Vitt85] Vitter, Jeffery S. "Random Sampling with a Reservoir." ACM
		//          Transactions on Mathematical Software, Vol. 11, No. 1, March
		//          1985, pp. 37-57. Retrieved from
		//          http://www.cs.umd.edu/~samir/498/vitter.pdf
}));