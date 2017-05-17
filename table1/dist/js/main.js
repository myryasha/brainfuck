'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Table = function () {
	function Table(link, container) {
		var _this = this;

		_classCallCheck(this, Table);

		container.innerHTML = this.renderLayout(); // контейнер

		var block = container.getElementsByClassName('block')[0],
		    // 
		progress = container.getElementsByClassName('progress')[0],
		    // используются только в конструкторе
		request = new XMLHttpRequest(); // используются только в конструкторе

		this.temp = container.getElementsByTagName('tbody');
		this.results = container.getElementsByClassName('results')[0];
		this.pagesNav = container.getElementsByClassName('pages')[0];
		this.navElements = this.pagesNav.getElementsByTagName('li');
		this.activeRow;

		this.pages = [];
		this.tempJson = [];
		this.firstPage = true;
		this.pageActive = 0;
		this.json = [];
		this.maxElems = 50;

		request.open("GET", link, true);
		request.send();

		request.addEventListener('error', function (e) {
			request.open("GET", "js/test.json", true); // если чудо-сайт не грузится берем локальную копию данных
			request.send();
		});

		request.addEventListener("progress", function (e) {
			if (e.loaded == 0) return;

			try {
				_this.json = JSON.parse(request.responseText);
			} catch (e) {
				_this.json = _this.tryParseJson(request.responseText);
			}

			// как только получаем досточно данных для одной страницы - показываем ее пользователю.
			if (_this.firstPage) {
				if (_this.json.length >= _this.maxElems) {

					_this.json.length = _this.maxElems;
					_this.pages[0] = _this.json;
					_this.pageActive = 0;
					_this.firstPage = false;
					progress.classList.add('hidden');
					_this.renderTable(_this.json, 0);
				};
				progress.innerHTML = Math.round(_this.json.length / _this.maxElems * 100) + '%';
			};
		}, false);

		request.onreadystatechange = function () {

			if (request.readyState != 4 || request.status != 200) return;

			var pagesCounter = '';
			_this.json = JSON.parse(request.responseText);

			if (!_this.pages[0]) {
				_this.pages[0] = _this.json;
				_this.results.insertAdjacentHTML('beforeEnd', _this.renderPage(_this.pages[0], 0, true));
				progress.classList.add('hidden');
				return;
			};
			_this.clearTable();
			_this.renderTable(_this.json, 0);
		};

		// про навигацию по страницам
		// 
		this.pagesNav.addEventListener('click', function (event) {

			var pageId = event.target.getAttribute('data-page-link');

			if (event.target.hasAttribute('data-page-link')) {

				_this.temp[_this.pageActive].classList.add('hidden');
				_this.navElements[_this.pageActive].classList.remove('nav-active');

				_this.navElements[pageId].classList.add('nav-active');
				_this.temp[pageId].classList.remove('hidden');
				_this.pageActive = pageId;
			};
		});

		// про события в таблице
		// 

		// сортировка по столбцам
		this.results.addEventListener('click', function (event) {

			if (event.target.parentElement.hasAttribute('data-head')) {
				if (_this.json.length == 0) {
					return;
				};

				_this.clearTable();
				_this.renderTable(_this.tempJson.sort(_this.tableSort.bind({
					type: event.target.getAttribute('data-type'),
					direction: event.target.getAttribute('data-direction')
				})), _this.pageActive);

				_this.toggleDirection(event.target);
			};

			if (event.target.parentElement.hasAttribute('data-id')) {
				if (_this.activeRow) {
					_this.activeRow.classList.remove('active');
				};
				event.target.parentElement.classList.add('active');
				_this.activeRow = event.target.parentElement;

				block.querySelector('tbody').innerHTML = _this.renderBlock(_this.json[event.target.parentElement.getAttribute('data-id')]);
				block.classList.remove('hidden');
			};
		});
	}

	// end constructor

	//


	_createClass(Table, [{
		key: 'clearTable',
		value: function clearTable() {
			var tbodys = this.results.querySelectorAll('tbody');
			for (var i = 0; i < tbodys.length; i++) {
				this.results.removeChild(tbodys[i]);
			};
		}
	}, {
		key: 'renderTable',
		value: function renderTable(json, activePage) {

			this.pageActive = activePage;
			this.pages = [];
			this.tempJson = json; // сохраняем массив элементов выведенных на страницу
			for (var i = 0; i < Math.ceil(json.length / 50); i++) {
				this.pages[i] = json.slice(i * this.maxElems, i * this.maxElems + this.maxElems); // собираем массив по стрницам
				this.results.insertAdjacentHTML('beforeEnd', this.renderPage(this.pages[i], i, false));
			};

			this.temp[activePage].classList.remove('hidden');
			this.pagesNav.innerHTML = this.renderPagination(this.pages.length, activePage);
		}
	}, {
		key: 'renderPagination',
		value: function renderPagination(quan) {
			var active = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

			var pagesCounter = '';
			for (var i = 0; i < quan; i++) {
				if (i == active) {
					pagesCounter += '<li class=\'nav-active\' data-page-link=' + i + '>' + (i + 1) + '</li>';
				} else {
					pagesCounter += '<li data-page-link=' + i + '>' + (i + 1) + '</li>';
				}
			};
			return '<ul>' + pagesCounter + '</ul>';
		}
		//
		//

	}, {
		key: 'renderPage',
		value: function renderPage() {
			var rows = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var pageId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
			var isActive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			var result = '';
			if (isActive) {
				isActive = '';
			} else {
				isActive = 'hidden';
			}
			for (var i = 0; i < rows.length; i++) {
				result += '\n\t\t\t\t<tr data-id=\'' + i + '\'>\n\t\t\t\t\t<td>' + rows[i].id + '</td>\n\t\t\t\t\t<td>' + rows[i].firstName + '</td>\n\t\t\t\t\t<td>' + rows[i].lastName + '</td>\n\t\t\t\t\t<td>' + rows[i].email + '</td>\n\t\t\t\t\t<td>' + rows[i].phone + '</td>\n\t\t\t\t</tr>';
			};
			return '<tbody data-page="' + pageId + '" class="' + isActive + ' "> ' + result + ' </tbody>';
		}
	}, {
		key: 'renderLayout',
		value: function renderLayout() {
			return '\n\t\t\t\t<table class=" results table table-striped table-bordered table-hover">\n\t\t\t\t\t<thead>\n\t\t\t\t\t\t<tr data-head>\n\t\t\t\t\t\t\t<td data-direction="top" data-type=\'id\'>id</td>\n\t\t\t\t\t\t\t<td data-direction="top" data-type=\'firstName\'>First Name</td>\n\t\t\t\t\t\t\t<td data-direction="top" data-type=\'lastName\'>Last Name</td>\n\t\t\t\t\t\t\t<td data-direction="top" data-type=\'email\'>Email</td>\n\t\t\t\t\t\t\t<td data-direction="top" data-type=\'phone\'>Phone</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</thead>\n\t\t\t\t</table>\n\n\t\t\t\t<div class="progress">0%</div>\n\t\t\t\t<div class="pages"></div>\n\t\t\t\t<table class="block table table-striped table-bordered table-hover hidden">\n\t\t\t\t\t<thead>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<td>id</td>\n\t\t\t\t\t\t\t\t<td>First Name</td>\n\t\t\t\t\t\t\t\t<td>Last Name</td>\n\t\t\t\t\t\t\t\t<td>Email</td>\n\t\t\t\t\t\t\t\t<td>Phone</td>\n\t\t\t\t\t\t\t\t<td>Adress</td>\n\t\t\t\t\t\t\t\t<td>Description</td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</thead>\n\t\t\t\t\t<tbody>\n\t\t\t\t\t</tbody>\n\t\t\t\t</table>';
		}
	}, {
		key: 'renderBlock',
		value: function renderBlock(obj) {
			return '\n\t\t\t\t<tr>\n\t\t\t\t\t<td>' + obj.id + '</td>\n\t\t\t\t\t<td>' + obj.firstName + '</td>\n\t\t\t\t\t<td>' + obj.lastName + '</td>\n\t\t\t\t\t<td>' + obj.email + '</td>\n\t\t\t\t\t<td>' + obj.phone + '</td>\n\t\t\t\t\t<td>' + obj.adress.city + ', ' + obj.adress.city + ', ' + obj.adress.state + ', ' + obj.adress.streetAddress + ', ' + obj.adress.zip + ' </td>\n\t\t\t\t\t<td>' + obj.description + '</td>\n\t\t\t\t</tr>';
		}
	}, {
		key: 'tryParseJson',
		value: function tryParseJson() {
			var json = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[';

			try {
				return json = JSON.parse(json + ']');
			} catch (e) {
				return this.tryParseJson(json.slice(0, json.lastIndexOf(',')));
			}
		}
	}, {
		key: 'tableSort',
		value: function tableSort(personA, personB) {
			var result = 1;
			if (this.direction == 'top') {
				result = -1;
			};

			if (personB[this.type] >= personA[this.type]) {
				return result;
			} else {
				return -result;
			}
		}
	}, {
		key: 'toggleDirection',
		value: function toggleDirection(element) {
			if (!element.getAttribute('data-direction')) {
				return;
			};
			// переводить в один регистр.
			if (element.getAttribute('data-direction') == 'top') {
				element.setAttribute('data-direction', 'bottom');
			} else {
				element.setAttribute('data-direction', 'top');
			};
		}
	}, {
		key: 'search',
		value: function search(searchString) {
			if (this.json.length == 0) return;

			if (searchString == '') {
				this.pageActive = 0;
				this.clearTable();
				this.renderTable(this.json, 0);
			}

			var serachJson = this.json.filter(function (person) {
				for (var value in person) {
					if (person[value].toString().toLowerCase().indexOf(searchString.toLowerCase()) != -1) {
						return true;
					};
				}
			});

			if (serachJson.length == 0) return; // сюда навешиваем что делать, если ничего не нашли. В нашем случае ничего не делаем.
			this.clearTable();
			this.renderTable(serachJson, 0);
		}
	}]);

	return Table;
}();

var find = document.querySelector('.find'),
    links = document.querySelector('.links'),
    table = void 0;

links.addEventListener('click', function (event) {
	if (event.target.hasAttribute('data-link')) {
		table = new Table(event.target.getAttribute('data-link'), document.querySelector('.container'));

		find.classList.remove('hidden');
		find.addEventListener('submit', function (event) {
			event.preventDefault();

			table.search(find.querySelector('[type=text]').value);
		});
	};
});