var Reservoir = require("../"),
    fs = require('fs'),
    readLines = require('./lib/readlines.js');

var numberOfWords = 30,
    maxWordLength = 37,
    maxPOSLength = 35,
    maxNumberLength = 8;

var lineReservoir = Reservoir(numberOfWords);

var partsOfSpeech = {
	"N" : "Noun",
	"p" : "Plural",
	"h" : "Noun Phrase",
	"V" : "Verb (usu participle)",
	"t" : "Verb (transitive)",
	"i" : "Verb (intransitive)",
	"A" : "Adjective",
	"v" : "Adverb",
	"C" : "Conjunction",
	"P" : "Preposition",
	"!" : "Interjection",
	"r" : "Pronoun",
	"D" : "Definite Article",
	"I" : "Indefinite Article",
	"o" : "Nominative"
};

function makeWordObject(lineData) {
	var a = lineData[0].split("\t"); // split into [word, part_of_speech];
	var b = a[1].split("|"); // split part of speech into old and new
	var c = b[b.length-1].split(''); // split into letters
	var word = {
		'lineNumber' : lineData[1],
		'word': a[0]
	};

	word['parts of speech'] = c.map(function(e){ return partsOfSpeech[e]; });

	return word;
}

function formatAndOutput(e, i) {
	var lineNumber = e.lineNumber;
	var partsOfSpeech =  e["parts of speech"].join(', ');

	lineNumber < 10
		? lineNumber = "  " + lineNumber
		: lineNumber = " " + lineNumber;

	if(e.word.length > maxWordLength - 1)
		e.word = e.word.substr(0, maxWordLength - 4) + "...";

	if(partsOfSpeech.length > maxPOSLength - 1)
		partsOfSpeech = partsOfSpeech.substr(0, maxPOSLength - 4) + "...";

	var lineNumberPadding = new Array(maxNumberLength - lineNumber.length).join(" ");
	var wordPadding = new Array(maxWordLength - e.word.length + 1).join(" ");

	console.log(lineNumberPadding + lineNumber + " " + e.word + wordPadding + partsOfSpeech);
}

function consoleHeading() {
	console.log("\n   Line Word                                 Part(s) of Speech");
	console.log("--------------------------------------------------------------------------------");
}

openFile('pos/part-of-speech.txt');

function openFile(filename) {
	var posFile = fs.createReadStream(filename);

	posFile.on('error', function(err) {
		var slash = filename.indexOf('/');
		// Try to read the file from the local directory if it wasn't found
		if(slash > 0) {
			process.nextTick(function() {
				openFile(filename.substr(slash + 1));
			});
		} else {
			console.log("\nAn error occured trying to open `parts-of-speech.txt`.\n\nSee `partsofspeech.README` for information about aquiring this file.");
		}
	});

	posFile.on("open", function(fd){
		console.log("\nSelecting " + numberOfWords + " words at random from a list of 295,172 words..");

		var startTime = Date.now();
		readLines(
			posFile,
			function(line, lineNumber) {
				lineReservoir.pushSome([line, lineNumber]);
			},
			function(){
				var timeTaken = Date.now() - startTime;
				var wordObjects = lineReservoir.map(makeWordObject);

				consoleHeading();
				wordObjects.forEach(formatAndOutput);
				console.log("\nFinished in " + timeTaken + "ms.");
			});
	});
}

