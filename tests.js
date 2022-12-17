function pickN(array, n) {
	result = [];
	for (var i = 0; i < n; i++) {
		do {
			var index = Math.trunc(Math.random() * array.length);
		} while (result.includes(array[index]))
		result.push(array[index]);
	}
	return result;
}


a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
b = pickN(a, 5);
c = pickN(b, 5);
console.log(b);
console.log(c);