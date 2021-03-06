var Reservoir = require("../");

var source = [];
var counts = [];

var totalSetSize = 100;
var subSetSize = 5;
var totalRuns = 10000;

while(totalSetSize--) {
	source.push(totalSetSize);
}

totalSetSize = 100;

var run = totalRuns;

while(run--) {
	var res = Reservoir(subSetSize);
	res.pushSome.apply(res, source);
	res.forEach(function(e, i) {
		counts[e] = ++counts[e] || 1;
	});
}

// mean: new_mean = old_mean + (value - old_mean) / samples
// sumofsquares: new_sum = old_sum + (value - old_mean) * (value - new_mean)
// variance = sumofsquares / number_of_samples
// standard deviation = sqrt( variance )
var runningStats = function(p, c, i) {
	var old_mean = p.mean;
	var diff = c - old_mean;
	p.samples = i + 1; // + 1 since arrays are 0-based
	p.mean = old_mean + diff / p.samples;
	p.sumofsq = p.sumofsq + diff * (c - p.mean);
	p.samples = i + 1;
	return p;
};

var prob = counts.map(function(e){ return e / (subSetSize * totalRuns); });
var stats = prob.reduce(runningStats, {mean: 0, sumofsq: 0, samples: 0});
stats.variance = stats.sumofsq / stats.samples;
stats.stdDev = Math.sqrt(stats.variance);

var PDF = counts.sort(function(a, b) { return a - b; });
PDF = PDF.map(function(e){ return e / (subSetSize * totalRuns); });

var CDF = PDF.map(function(e){ return (this[0] += e); }, [0]);

console.log("PDF:")
console.log(PDF.map(function(e){ return e.toFixed(5); }).join(", ").replace(/((\d+.\d+,\s+){10})/g, "$1\n"));

console.log("\nCDF:");
console.log(CDF.map(function(e){ return e.toFixed(5); }).join(", ").replace(/((\d+.\d+,\s+){10})/g, "$1\n"));

console.log("\nMean: ", stats.mean);
console.log("Variance: ", stats.variance);
console.log("StdDev: ", stats.stdDev);
