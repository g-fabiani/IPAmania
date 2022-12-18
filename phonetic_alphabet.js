"use strict"

// Costanti
const MATCHES = 5;		// numero di coppie per round
const DELAY = 500;


// Funzioni ausiliarie

function pickN(array, n) {
	// Sceglie casualmente cinque elementi da un array
	var result = [];
	for (var i = 0; i < n; i++) {
		do {
			var index = Math.trunc(Math.random() * array.length);
		} while (result.includes(array[index]))
		result.push(array[index]);
	}
	return result;
}

function addText(node, text) {
	var textNode = document.createTextNode(text);
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

function signalError() {
	selectedSymbol.setAttribute("error", "true");
	selectedDescription.setAttribute("error", "true");
}

function resetError() {
	selectedSymbol.setAttribute("error", "false");
	selectedDescription.setAttribute("error", "false");
	deselectAll();
}

function resetCardAttributes(cardNode) {
	cardNode.setAttribute("selected", "false");
	cardNode.setAttribute("matched", "false");
	cardNode.setAttribute("error", "false");
}

function checkMatch() {
	if (keySymbols[selectedSymbol.id] == keyDescriptions[selectedDescription.id]) {
		selectedSymbol.setAttribute("matched", "true");
		selectedDescription.setAttribute("matched", "true");

		matched++;
		console.log(matched);
		if (matched == MATCHES) {
			console.log("hai vinto");
		}

		deselectAll();

	} else {
		penalities++;
		console.log(penalities);
		signalError();
		setTimeout(resetError, DELAY);
	}
}

// Gestori di eventi

function handlerNewGame() {
	try {
		// Azzera successi e penalità
		matched = 0;
		penalities = 0;

		// Azzera le associazioni tra id delle tessere e chiavi dell'array IPA_VOWELS
		keySymbols = {};
		keyDescriptions = {};

		// Sceglie le tessere per il round corrente
		var currentSymbols = pickN(Object.keys(IPA_VOWELS), MATCHES);
		var currentDescriptions = pickN(currentSymbols, MATCHES);

		// Associa i simboli alle tessere
		for (var i = 0; i < MATCHES; i++) {
			var symbolNode = symbolNodes[i];
			var currentSymbol = currentSymbols[i];

			// Scrive il simbolo sulla tessera
			addText(symbolNode, IPA_VOWELS[currentSymbol].symbol);
			// Resetta gli attributi selected, matched e error della tessera a false
			resetCardAttributes(symbolNode);

			// Ricorda l'associazioe tra la tessera simbolo e la chiave che identifica la vocale
			keySymbols[symbolNode.id] = currentSymbol;
		}

		// Associa le descrizioni alle tessere
		for (var i = 0; i < MATCHES; i++) {
			var descriptionNode = descriptionNodes[i];
			var currentDescription = currentDescriptions[i];

			// Scrive la descrizione sulla tessera
			addText(descriptionNode, IPA_VOWELS[currentDescription].description);
			// Resetta gli attributi selected, matched e error della tessera a false
			resetCardAttributes(descriptionNode);

			// Ricorda l'associazione tra la tessera descrizione e la chiave che identifica la vocale
			keyDescriptions[descriptionNode.id] = currentDescription;
		}

	} catch (e) {
		alert("handlerNewGame " + e);
	}
}

function handlerSymbolSelection() {
	try {
		// Non è possibile selezionare tessere che sono già state accoppiate
		if (this.getAttribute("matched") == "true")
		{
			return;
		}

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
		// Non è possibile selezionare tessere che sono già state accoppiate
		if (this.getAttribute("matched") == "true") {
			return;
		}

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

var newGameNode;
var cardGridNode;

var symbolNodes = [];
var descriptionNodes = [];


var keySymbols;
var keyDescriptions;
var matched;
var penalities;

var selectedSymbol;
var selectedDescription;

function handlerLoad() {
	try {

		newGameNode = document.getElementById("new_game");
		cardGridNode = document.getElementById("card_grid");
		newGameNode.onclick = handlerNewGame;

		selectedSymbol = null;
		selectedDescription = null;

		for (var i = 0; i < MATCHES; i++) {

			// Genera dinamicamente le tessere simbolo e descrizione

			var symbolId = "s" + String(i);
			var descriptionId = "d" + String(i);

			var symbolNode = document.createElement("div");
			var descriptionNode = document.createElement("div");

			symbolNode.setAttribute("class", "card symbol");
			symbolNode.id = symbolId;
			descriptionNode.setAttribute("class", "card description");
			descriptionNode.id = descriptionId;

			cardGridNode.appendChild(symbolNode);
			cardGridNode.appendChild(descriptionNode);

			symbolNodes.push(symbolNode);
			descriptionNodes.push(descriptionNode);
		}

		handlerNewGame();

		// Gestisce i click sulle tessere che rappresentano simboli
		for (symbolNode of symbolNodes) {
			symbolNode.onclick = handlerSymbolSelection;
		}

		// Gestisce i click sulle tessere che rappresentano descrizioni
		for (descriptionNode of descriptionNodes) {
			descriptionNode.onclick = handlerDescriptionSelection;
		}

	} catch (e) {
		alert("handlerLoad " + e);
	}
}


window.onload = handlerLoad;

/*
Ogni vocale dell'alfabeto fonetico internazionale è identificata univocamente
da un id numerico associato al suo simbolo e alla sua descrizione
*/
const IPA_VOWELS = {
	0 : {symbol: "\u0069", description: "Vocale anteriore chiusa non arrotondata"},
	1 : {symbol: "\u0079", description:"Vocale anteriore chiusa arrotondata"},
	2 : {symbol: "\u0268", description: "Vocale centrale chiusa non arrotondata"},
	3 : {symbol: "\u0289", description: "Vocale centrale chiusa arrotondata"},
	4 : {symbol: "\u026f", description: "Vocale posteriore chiusa non arrotondata"},
	5 : {symbol: "\u0075", description: "Vocale posteriore chiusa arrotondata"},
	6 : {symbol: "\u026a", description: "Vocale quasi anteriore quasi chiusa non arrotondata"},
	7 : {symbol: "\u028f", description: "Vocale quasi anteriore quasi chiusa arrotondata"},
	8 : {symbol: "\u028a", description: "Vocale quasi posteriore quasi chiusa arrotondata"},
	9 : {symbol: "\u0065", description: "Vocale anteriore semichiusa non arrotondata"},
	10 : {symbol: "\u00f8", description: "Vocale anteriore semichiusa arrotondata"},
	11 : {symbol: "\u0258", description: "Vocale centrale semichiusa non arrotondata"},
	12 : {symbol: "\u0275", description: "Vocale centrale semichiusa arrotondata"},
	13 : {symbol: "\u0264", description: "Vocale posteriore semichiusa non arrotondata"},
	14 : {symbol: "\u006f", description: "Vocale posteriore semichiusa arrotondata"},
	15 : {symbol: "\u025b", description: "Vocale anteriore semiaperta non arrotondata"},
	16 : {symbol: "\u0153", description: "Vocale anteriore semiaperta arrotondata"},
	17 : {symbol: "\u025c", description: "Vocale centrale semiaperta non arrotondata"},
	18 : {symbol: "\u025e", description: "Vocale centrale semiaperta arrotondata"},
	19 : {symbol: "\u0254", description: "Vocale posteriore semiaperta arrotondata"},
	20 : {symbol: "\u00e6", description: "Vocale anteriore quasi aperta non arrotondata"},	
	21 : {symbol: "\u0250", description: "Vocale centrale quasi aperta"},
	22 : {symbol: "\u0061", description: "Vocale anteriore aperta non arrotondata"},
	23 : {symbol: "\u0276", description: "Vocale anteriore aperta arrotondata"},
	24 : {symbol: "\u0251", description: "Vocale posteriore aperta non arrotondata"},
	25 : {symbol: "\u0252", description: "Vocale posteriore aperta arrotondata"},
}
