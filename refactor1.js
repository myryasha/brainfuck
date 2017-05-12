function drawRating(vote) {
	// if (vote >= 0 && vote <= 20) {
	// 	return '★☆☆☆☆';
	// } else if (vote > 20 && vote <= 40) {
	// 	return '★★☆☆☆';
	// } else if (vote > 40 && vote <= 60) {
	// 	return '★★★☆☆';
	// } else if (vote > 60 && vote <= 80) {
	// 	return '★★★★☆';
	// } else if (vote > 80 && vote <= 100) {
	// 	return '★★★★★';
	// }
	var str = '☆☆☆☆☆',
		str1 = '★★★★★';

	return str1.substr(0, Math.floor(vote / 20) + 1) + str.substr(Math.floor(vote / 20) + 1, str.length);
}

// Проверка работы результата
console.log(drawRating(0)); // ★☆☆☆☆
console.log(drawRating(1)); // ★☆☆☆☆
console.log(drawRating(50)); // ★★★☆☆
console.log(drawRating(99)); // ★★★★★