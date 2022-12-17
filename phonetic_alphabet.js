// Funzioni ausiliarie

function addText(node, text) {
	textNode = document.createTextNode(text);
	if (node.childNodes.length > 0){
		node.replaceChild(textNode, node.firstChild);
	} else {
		node.appendChild(textNode);
	}
}

function deselectAll() {
	if (selectedSymbol) {
		selectedSymbol.setAttribute("selected", "false");
		selectedSymbol = null;

	}
	if (selectedDescription) {
		selectedDescription.setAttribute("selected", "false");
		selectedDescription = null;
	}
}

function checkMatch() {

	if (keySymbols[selectedSymbol.id] == keyDescriptions[selectedDescription.id]) {
		console.log("It's a match");
	} else {
		console.log("Sorry, it's not a match");
	}

	// Al termine deseleziona simbolo e descrizione
	setTimeout(deselectAll, DELAY);
}

// Handler di eventi

function handlerSymbolSelection() {
	try {
		if (selectedSymbol) {
			selectedSymbol.setAttribute("selected", "false");
		}

		selectedSymbol = this;
		selectedSymbol.setAttribute("selected", "true");

		// Se sono stati selezionati un simbolo e una descrizione
		if (selectedSymbol && selectedDescription){
			checkMatch();
		}

	} catch (e) {
		alert("handlerSymbolSelection " + e);
	}
}

function handlerDescriptionSelection() {
	try {

		if (selectedDescription) {
			selectedDescription.setAttribute("selected", "false");
		}
			selectedDescription = this;
			selectedDescription.setAttribute("selected", "true");


		if (selectedSymbol && selectedDescription){
			checkMatch();
		}

	} catch (e) {
		alert("handlerDescriptionSelection " + e);
	}
}

// Il numero di coppie per ogni round
const MATCHES = 5;
// Stabilisce un ritardo in numero di millisecondi
const DELAY = 400;

var gridNode;
var symbols = [];
var descriptions = [];
var keySymbols = {};
var keyDescriptions = {};


var selectedSymbol = null;
var selectedDescription = null;

function handlerLoad() {
	try {

		// Genera dinamicamente le tessere simbolo e descrizione
		for (var i = 0; i < MATCHES; i++) {
			var symbolId = "s" + String(i);
			var descriptionId = "d" + String(i);

			var symbolNode = document.getElementById(symbolId);
			var descriptionNode =document.getElementById(descriptionId);

			console.log(symbolNode);

			addText(symbolNode, IPA_VOWELS[i].symbol);
			addText(descriptionNode, IPA_VOWELS[i].description);

			keySymbols[symbolId] = i;
			keyDescriptions[descriptionId] = i;

			symbols.push(symbolNode);
			descriptions.push(descriptionNode);
		}

		// Gestisce i click sulle tessere che rappresentano simboli
		for (symbolNode of symbols) {
			symbolNode.onclick = handlerSymbolSelection;
		}

		// Gestisce i click sulle tessere che rappresentano descrizioni
		for (descriptionNode of descriptions) {
			descriptionNode.onclick = handlerDescriptionSelection;
		}

	} catch (e) {
		alert("handlerLoad " + e);
	}
}


window.onload = handlerLoad;


const IPA_VOWELS = {
	0 : {symbol: "\u0069", description: "Vocale anteriore chiusa non arrotondata"},
	1 : {symbol: "\u0079", description:"Vocale anteriore chiusa arrotondata"},
	2 : {symbol: "\u0268", description: "Vocale centrale chiusa non arrotondata"},
	3 : {symbol: "\u0289", description: "Vocale centrale chiusa arrotondata"},
	4 : {symbol: "\u026f", description: "Vocale posteriore chiusa non arrotondata"},
}
