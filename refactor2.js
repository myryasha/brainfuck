function func(string, a, b) {
	if (string == '' || (a.length !== 1 && b.length !== 1)) {
		return -1;
	}

	for (var i = string.length - 1; i > 0; i--) {
		if (string[i] == a || string[i] == b) {
			return i;
		};
	};

	return -1;

}