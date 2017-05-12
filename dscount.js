"use strict";

function dscount(str, s1, s2) {

	if (typeof str !== 'string' || typeof s1 !== 'string' || typeof s2 !== 'string') {
		return 0;
	};

	var start = -1,
		result = -1,
		string = str.toLowerCase(),
		s3 = (s1 + s2).toLowerCase();

	do {
		start = string.indexOf(s3, start + 1);
		result++;
	} while (start !== -1);

	return result;
}
// Для удобства можно использовать эти тесты:
try {
	test(dscount, ['ab___ab__', 'a', 'B'], 2);
	test(dscount, ['___cd____', 'c', 'd'], 1);
	test(dscount, ['de_______', 'd', 'e'], 1);
	test(dscount, ['12_12__12', '1', '2'], 3);
	test(dscount, ['_ba______', 'a', 'b'], 0);
	test(dscount, ['_a__b____', 'a', 'b'], 0);
	test(dscount, ['-ab-аb-ab', 'a', 'b'], 2);
	test(dscount, ['aAa', 'a', 'a'], 2);
	test(dscount, [5, 'a', 'a'], 0);
	test(dscount, [null, 'a', 'a'], 0);
	test(dscount, [undefined, 'd', 'e'], 0);
	console.info("Congratulations! All tests success passed.");
} catch (e) {
	console.error(e);
}

// Простая функция тестирования
function test(call, args, count, n) {
	let r = (call.apply(n, args) === count);
	console.assert(r, `Finded items count: ${count}`);
	if (!r) throw "Test failed!";
}