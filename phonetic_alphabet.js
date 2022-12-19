"use strict";

// Costanti
const MATCHES = 6;		// numero di coppie per round
const DELAY = 500;


// Funzioni ausiliarie

function pickN(array, n) {
	// Sceglie casualmente cinque elementi da un array
	var result = [];
	for (var i = 0; i < n; i++) {
		do {
			var index = Math.trunc(Math.random() * array.length);
		} while (result.includes(array[index]));
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
	if (selectedSymbolNode) {
		selectedSymbolNode.setAttribute("selected", "false");
		selectedSymbolNode = null;

	}
	if (selectedDescriptionNode) {
		selectedDescriptionNode.setAttribute("selected", "false");
		selectedDescriptionNode = null;
	}
}

function signalError() {
	selectedSymbolNode.setAttribute("error", "true");
	selectedDescriptionNode.setAttribute("error", "true");
}

function resetError() {
	selectedSymbolNode.setAttribute("error", "false");
	selectedDescriptionNode.setAttribute("error", "false");
	deselectAll();
}

function resetCardAttributes(cardNode) {
	cardNode.setAttribute("selected", "false");
	cardNode.setAttribute("matched", "false");
	cardNode.setAttribute("error", "false");
	cardNode.setAttribute("active", "true");
}

function compare(a, b) {
	if (a.penalties == b.penalties) {
		return a.time - b.time;
	} else {
		return a.penalties - b.penalties;
	}
}

function displayHighScores() {
	// Genera dinamicamente la tabella degli highscores
	var tableBody = highScoresNode.lastElementChild;

	while (tableBody.childNodes.length > 0) {
		tableBody.removeChild(tableBody.firstChild);
	}

	for (var i = 0; i < highScores.length; i++) {
		var tablerow = document.createElement("tr");

		var nameCell = document.createElement("td"); 
		var penaltiesCell = document.createElement("td"); 
		var timeCell = document.createElement("td"); 

		addText(nameCell, highScores[i].name);
		addText(penaltiesCell, highScores[i].penalties);
		addText(timeCell, highScores[i].time);

		tablerow.appendChild(nameCell);
		tablerow.appendChild(penaltiesCell);
		tablerow.appendChild(timeCell);

		tableBody.appendChild(tablerow);
	}
}


function endGame() {
		addText(messageNode, "Vittoria! Premi sul pulsante nuova partita per giocare ancora");
		clearInterval(timer);

		// Aggiunge il risultato del giocatore agli highscores
		highScores.push({name: player, penalties: penalties, time: time/10});
		highScores.sort(compare);
		// Tiene solo i 3 risultati migliori
		if (highScores.length > 3) {
					highScores = highScores.slice(0, 3);
		}

		displayHighScores();
}

function checkMatch() {
	var selectedSymbol = selectedSymbolNode.textContent;
	var selectedDescription = selectedDescriptionNode.textContent;

	if (IPA_VOWELS[selectedSymbol] == selectedDescription) {
		selectedSymbolNode.setAttribute("matched", "true");
		selectedDescriptionNode.setAttribute("matched", "true");

		selectedSymbolNode.setAttribute("active", "false");
		selectedDescriptionNode.setAttribute("active", "false");

		matched++;
		if (matched == MATCHES) {
			endGame();
		}

		deselectAll();

	} else {
		penalties++;
		updateScore();

		signalError();
		setTimeout(resetError, DELAY);
	}
}

function updateScore() {
	var s = "Penalità: " + String(penalties);

	addText(scoreNode, s);
}

function displaTimer() {
	var s = "Tempo: " + String(time/10) + "s";

	addText(timerNode, s);
}

function updateTimer() {
	time += 1;
	displaTimer();
}

// Gestori di eventi

function handlerNewGame() {
	try {
		player = playerNode.value;

		if (!player) {
			addText(messageNode, "Specificare un nome giocatore!");
			return;
		}

		// Azzera successi, penalità e tempo
		matched = 0;
		penalties = 0;
		time = 0;

		// Toglie il messaggio
		addText(messageNode, "");

		// Sceglie le tessere per il round corrente
		var currentSymbols = pickN(Object.keys(IPA_VOWELS), MATCHES);
		var currentDescriptions = pickN(currentSymbols, MATCHES);

		// Associa i simboli alle tessere
		for (var i = 0; i < MATCHES; i++) {
			var symbolNode = symbolNodes[i];
			var currentSymbol = currentSymbols[i];

			// Scrive il simbolo sulla tessera
			addText(symbolNode, currentSymbol);
			// Resetta gli attributi selected, matched e error della tessera a false
			resetCardAttributes(symbolNode);
		}

		// Associa le descrizioni alle tessere
		for (var i = 0; i < MATCHES; i++) {
			var descriptionNode = descriptionNodes[i];
			var currentDescription = currentDescriptions[i];

			// Scrive la descrizione sulla tessera
			addText(descriptionNode, IPA_VOWELS[currentDescription]);
			// Resetta gli attributi selected, matched e error della tessera a false
			resetCardAttributes(descriptionNode);
		}

		updateScore();

		if (timer) {
			clearInterval(timer);
		}

		displaTimer();
		timer = setInterval(updateTimer, 100);

	} catch (e) {
		alert("handlerNewGame " + e);
	}
}

function handlerSymbolSelection() {
	try {
		// Non è possibile selezionare tessere inattive
		if (this.getAttribute("active") == "false")
		{
			return;
		}

		if (selectedSymbolNode) {
			// Cliccare su una tessera già selezionata la deseleziona
			if (selectedSymbolNode == this) {
				selectedSymbolNode.setAttribute("selected", "false");
				selectedSymbolNode = null;
				return; 
			}
			selectedSymbolNode.setAttribute("selected", "false");
		}

		selectedSymbolNode = this;
		selectedSymbolNode.setAttribute("selected", "true");

		// Se sono stati selezionati un simbolo e una descrizione
		if (selectedSymbolNode && selectedDescriptionNode){
			checkMatch();
		}

	} catch (e) {
		alert("handlerSymbolSelection " + e);
	}
}

function handlerDescriptionSelection() {
	try {
		// Non è possibile selezionare tessere inattive
		if (this.getAttribute("active") == "false") {
			return;
		}

		if (selectedDescriptionNode) {
			if (selectedDescriptionNode == this) {
				// Cliccare su una tessera già selezionata la deseleziona
				selectedDescriptionNode.setAttribute("selected", "false");
				selectedDescriptionNode = null;
				return;
			}
			selectedDescriptionNode.setAttribute("selected", "false");
		}
			selectedDescriptionNode = this;
			selectedDescriptionNode.setAttribute("selected", "true");


		if (selectedSymbolNode && selectedDescriptionNode){
			checkMatch();
		}

	} catch (e) {
		alert("handlerDescriptionSelection " + e);
	}
}

var newGameNode;
var cardGridNode;
var scoreNode;
var timerNode;
var messageNode;
var playerNode;
var highScoresNode;
var symbolNodes = [];
var descriptionNodes = [];

var matched;
var penalties;
var time;
var timer;
var player;
var highScores = [];

var selectedSymbolNode;
var selectedDescriptionNode;

function handlerLoad() {
	try {

		newGameNode = document.getElementById("new_game");
		cardGridNode = document.getElementById("card_grid");
		scoreNode = document.getElementById("score");
		timerNode = document.getElementById("timer");
		messageNode = document.getElementById("message");
		playerNode = document.getElementById("player");
		highScoresNode = document.getElementById('highscores');

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

			symbolNode.setAttribute("active", "false");
			descriptionNode.setAttribute("active", "false");

			cardGridNode.insertBefore(symbolNode, scoreNode);
			cardGridNode.insertBefore(descriptionNode, scoreNode);

			symbolNodes.push(symbolNode);
			descriptionNodes.push(descriptionNode);
		}

		playerNode.value = "";

		selectedSymbolNode = null;
		selectedDescriptionNode = null;

		// Gestisce i click sul pulsante Nuova partita
		newGameNode.onclick = handlerNewGame;

		// Gestisce i click sulle tessere che rappresentano simboli
		for (var i = 0; i < symbolNodes.length; i++) {
			symbolNodes[i].onclick = handlerSymbolSelection;
		}

		// Gestisce i click sulle tessere che rappresentano descrizioni
		for (var i = 0; i < descriptionNodes.length; i++) {
			descriptionNodes[i].onclick = handlerDescriptionSelection;
		}

	} catch (e) {
		alert("handlerLoad " + e);
	}
}


window.onload = handlerLoad;

/*
Per ogni vocale dell'Alfabeto Fonetico Internazionale associamo simbolo e descrizione
*/
const IPA_VOWELS = {
	"\u0069" : "Vocale anteriore chiusa non arrotondata",
	"\u0079" :"Vocale anteriore chiusa arrotondata",
	"\u0268" : "Vocale centrale chiusa non arrotondata",
	"\u0289" : "Vocale centrale chiusa arrotondata",
	"\u026f" : "Vocale posteriore chiusa non arrotondata",
	"\u0075" : "Vocale posteriore chiusa arrotondata",
	"\u026a" : "Vocale quasi anteriore quasi chiusa non arrotondata",
	"\u028f" : "Vocale quasi anteriore quasi chiusa arrotondata",
	"\u028a" : "Vocale quasi posteriore quasi chiusa arrotondata",
	"\u0065" : "Vocale anteriore semichiusa non arrotondata",
	"\u00f8" : "Vocale anteriore semichiusa arrotondata",
	"\u0258" : "Vocale centrale semichiusa non arrotondata",
	"\u0275" : "Vocale centrale semichiusa arrotondata",
	"\u0264" : "Vocale posteriore semichiusa non arrotondata",
	"\u006f" : "Vocale posteriore semichiusa arrotondata",
	"\u0259" : "Vocale centrale media",
	"\u025b" : "Vocale anteriore semiaperta non arrotondata",
	"\u0153" : "Vocale anteriore semiaperta arrotondata",
	"\u025c" : "Vocale centrale semiaperta non arrotondata",
	"\u025e" : "Vocale centrale semiaperta arrotondata",
	"\u028c" : "Vocale posteriore semiaperta non arrotondata",
	"\u0254" : "Vocale posteriore semiaperta arrotondata",
	"\u00e6" : "Vocale anteriore quasi aperta non arrotondata",	
	"\u0250" : "Vocale centrale quasi aperta",
	"\u0061" : "Vocale anteriore aperta non arrotondata",
	"\u0276" : "Vocale anteriore aperta arrotondata",
	"\u0251" : "Vocale posteriore aperta non arrotondata",
	"\u0252" : "Vocale posteriore aperta arrotondata",
};
