var vows = require('vows'),
    assert = require('assert'),
    Reservoir = require('../');

var testElements = [];
for(var i = 0; i < 100; i++) testElements[i] = Math.pow(i, 2);

vows.describe('Reservoir').addBatch({
	'A new Reservoir': {
		topic: Reservoir(3),

		'is an array' : function (reservoir) {
			assert.isArray(reservoir);
		},
		'is empty': function (reservoir) {
			assert.lengthOf(reservoir, 0);
		},
		'has pushSome': function (reservoir) {
			assert.isFunction(reservoir.pushSome);
		}
	},
	'A partially-filled Reservoir': {
		topic: function() {
			var res = Reservoir(3);
			res.pushSome("test1");
			res.pushSome("test2");
			return res;
		},
		'is an array' : function (reservoir) {
			assert.isArray(reservoir);
		},
		'is partially-filled': function (reservoir) {
			assert.lengthOf(reservoir, 2);
		},
		'has exactly the pushSomed items in the order they were inserted': function (reservoir) {
			assert.equal(reservoir[0], "test1");
			assert.equal(reservoir[1], "test2");
		}
	},
	'A fully-filled Reservoir': {
		topic: function() {
			var res = Reservoir(3);
			res.pushSome.apply(res, testElements);
			return res;
		},
		'is an array' : function (reservoir) {
			assert.isArray(reservoir);
		},
		'is fully-filled': function (reservoir) {
			assert.lengthOf(reservoir, 3);
		},
		'has elements in the same order as the original': function (reservoir) {
			var prev = 0;
			reservoir.every(function(e){
				return (e > prev && (prev = e));
			});
		}
	}
}).export(module);
