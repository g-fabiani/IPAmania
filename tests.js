"use strict";

var highScores = [
	{name: "Giocatore 2", penalities:3, time: 35.5},
	{name: "Giocatore 1", penalities: 3, time: 30},
	{name: "Giocatore 3", penalities: 0, time: 20},
	{name: "Giocatore 4", penalities: 0, time: 22.2}
	];

console.log(highScores);

function compare(a, b) {
	if (a.penalities == b.penalities) {
		return a.time - b.time;
	} else {
		return a.penalities - b.penalities;
	}
}

highScores.sort(compare);
//highScores = highScores.slice(0, 3);
console.log("Sorted");
console.log(highScores);