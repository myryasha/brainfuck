"use strict";

function checkSyntax(str) {
	if (typeof str !== 'string') {
		return 1;
	};

	str = str.replace(/[^\[\]\(\)\{\}\<\>]/g, '');
	while (~str.indexOf('()') || ~str.indexOf('{}') || ~str.indexOf('[]') || ~str.indexOf('<>')) {
		str = str.replace('()', '');
		str = str.replace('{}', '');
		str = str.replace('[]', '');
		str = str.replace('<>', '');
	}

	if (str.length != 0) {
		return 1;
	};
	return 0;
}
// Для удобства можно использовать эти тесты:
try {
	test(checkSyntax, ["---(++++)----"], 0);
	test(checkSyntax, [""], 0);
	test(checkSyntax, ["before ( middle []) after "], 0);
	test(checkSyntax, [") ("], 1);
	test(checkSyntax, ["} {"], 1);
	test(checkSyntax, ["<(   >)"], 1);
	test(checkSyntax, ["(  [  <>  ()  ]  <>  )"], 0);
	test(checkSyntax, ["   (      [)"], 1);
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