// Задание 10.
//Арифметический квадрат. Заполнить квадратную матрицу n x n так,
//чтобы все числа первого столбца и первой строки равны 1, 
//а каждое из оставшихся чисел  равно сумме верхнего и левого соседей. 
//Вывести на экран матрицу данного размера.


class Matrix {
	constructor() {
		this.result = [];

	}

	createColumn(number) {


	}

	get(n) {

		for (let i = 0; i < n; i++) {
			this.result[i] = new Array(n);
			this.result[i][0] = i;
			this.result[0][i] = i;
		};

		for (let i = 1; i < n; i++) {
			for (let j = 1; j < n; j++) {
				this.result[i][j] = this.result[i - 1][j] + this.result[i][j - 1]
			}
		}

		return this.result;

	}
}

let matrix = new Matrix();

let length = matrix.get(10);