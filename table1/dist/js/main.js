class Table {
	constructor(link, container) {

		container.innerHTML = this.renderLayout(); // контейнер

		let block = container.getElementsByClassName('block')[0], // 
			progress = container.getElementsByClassName('progress')[0], // используются только в конструкторе
			request = new XMLHttpRequest(); // используются только в конструкторе

		this.temp = container.getElementsByTagName('tbody');
		this.results = container.getElementsByClassName('results')[0];
		this.pagesNav = container.getElementsByClassName('pages')[0];
		this.navElements = this.pagesNav.getElementsByTagName('li');
		this.activeRow;

		this.pages = [];
		this.firstPage = true;
		this.pageActive = 0;
		this.json = [];
		this.maxElems = 50;

		request.open("GET", link, true);
		request.send();

		request.addEventListener('error', (e) => {
			request.open("GET", "js/test.json", true); // если чудо-сайт не грузится берем локальную копию данных
			request.send();
		});

		request.addEventListener("progress", (e) => {
			if (e.loaded == 0) return;

			try {
				this.json = JSON.parse(request.responseText);
			} catch (e) {
				this.json = this.tryParseJson(request.responseText);
			}

			// как только получаем досточно данных для одной страницы - показываем ее пользователю.
			if (this.firstPage) {
				if (this.json.length >= this.maxElems) {

					this.json.length = this.maxElems;
					this.pages[0] = this.json;
					this.pageActive = 0;
					this.firstPage = false;
					progress.classList.add('hidden');

					this.renderTable(this.json, true)
				};
				progress.innerHTML = Math.round(this.json.length / this.maxElems * 100) + '%';
			};

		}, false);

		request.onreadystatechange = () => {

			if (request.readyState != 4 || request.status != 200) return;

			let pagesCounter = '';
			this.json = JSON.parse(request.responseText);

			if (!this.pages[0]) {
				this.pages[0] = this.json;
				this.results.insertAdjacentHTML('beforeEnd', this.renderPage(this.pages[0], 0, true));
				progress.classList.add('hidden');
				return;
			};

			this.renderTable(this.json, false);



		};

		// про навигацию по страницам
		// 
		this.pagesNav.addEventListener('click', (event) => {

			let pageId = event.target.getAttribute('data-page-link');

			if (event.target.hasAttribute('data-page-link')) {

				this.temp[this.pageActive].classList.add('hidden');
				this.navElements[this.pageActive].classList.remove('nav-active');

				this.navElements[pageId].classList.add('nav-active');
				this.temp[pageId].classList.remove('hidden');
				this.pageActive = pageId;

			};

		});

		// про события в таблице
		// 


		this.results.addEventListener('click', (event) => {

			if (event.target.parentElement.hasAttribute('data-head')) {
				if (this.json.length == 0) {
					return;
				};

				this.json = this.json.sort(this.tableSort.bind({
					type: event.target.getAttribute('data-type'),
					direction: event.target.getAttribute('data-direction')
				}));
				this.toggleDirection(event.target);
				this.renderTable(this.json);

			};

			if (event.target.parentElement.hasAttribute('data-id')) {
				if (this.activeRow) {
					this.activeRow.classList.remove('active');
				};
				event.target.parentElement.classList.add('active');
				this.activeRow = event.target.parentElement;

				block.querySelector('tbody').innerHTML = this.renderBlock(this.json[event.target.parentElement.getAttribute('data-id')]);
				block.classList.remove('hidden');
			};

		});

	}

	// end constructor
	renderLayout() {
		return `
				<table class=" results table table-striped table-bordered table-hover">
					<thead>
						<tr data-head>
							<td data-direction="top" data-type='id'>id</td>
							<td data-direction="top" data-type='firstName'>First Name</td>
							<td data-direction="top" data-type='lastName'>Last Name</td>
							<td data-direction="top" data-type='email'>Email</td>
							<td data-direction="top" data-type='phone'>Phone</td>
						</tr>
					</thead>
				</table>

				<div class="progress">0%</div>
				<div class="pages"></div>
				<table class="block table table-striped table-bordered table-hover hidden">
					<thead>
						<tr>
								<td>id</td>
								<td>First Name</td>
								<td>Last Name</td>
								<td>Email</td>
								<td>Phone</td>
								<td>Adress</td>
								<td>Description</td>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>`
	}

	renderBlock(obj) {
		return `
				<tr>
					<td>${obj.id}</td>
					<td>${obj.firstName}</td>
					<td>${obj.lastName}</td>
					<td>${obj.email}</td>
					<td>${obj.phone}</td>
					<td>${obj.adress.city}, ${obj.adress.city}, ${obj.adress.state}, ${obj.adress.streetAddress}, ${obj.adress.zip} </td>
					<td>${obj.description}</td>
				</tr>`

	}

	renderTable(json, firstRender = false) { // спорное решение, пересмотреть надо.

		if (!firstRender) {
			this.pages = [];
			this.firstPage = true;
			let tbodys = this.results.querySelectorAll('tbody');
			for (var i = 0; i < tbodys.length; i++) {
				tbodys[i].remove();
			};
		};
		let pagesCounter = ''

		for (let i = 0; i < Math.ceil(json.length / 50); i++) {
			this.pages[i] = json.slice(i * this.maxElems, i * this.maxElems + this.maxElems); // собираем массив по стрницам
			pagesCounter += `<li data-page-link=${i}>${i + 1}</li>`;
		};

		for (let i = 0; i <= this.pages.length; i++) {
			if (!this.firstPage && i == 0) { // если первая страница уже создана, тогда пропускаем ее создание. 
				continue;
			}
			this.results.insertAdjacentHTML('beforeEnd', this.renderPage(this.pages[i], i, false));
		};

		this.temp[this.pageActive].classList.remove('hidden');
		this.pagesNav.innerHTML = `<ul>${pagesCounter}</ul>`;
		this.navElements[this.pageActive].classList.add('nav-active');
	}

	renderPage(rows = [], pageId = 0, isActive = false) {
		let result = '';
		if (isActive) {
			isActive = '';

		} else {
			isActive = 'hidden';
		}
		for (let i = 0; i < rows.length; i++) {
			result += `
				<tr data-id='${i}'>
					<td>${rows[i].id}</td>
					<td>${rows[i].firstName}</td>
					<td>${rows[i].lastName}</td>
					<td>${rows[i].email}</td>
					<td>${rows[i].phone}</td>
				</tr>`
		};
		return `<tbody data-page="${pageId}" class="${isActive} "> ${result} </tbody>`;

	}


	tryParseJson(json = '[') {
		try {
			return json = JSON.parse(json + ']');
		} catch (e) {
			return this.tryParseJson(json.slice(0, json.lastIndexOf(',')));
		}
	}



	tableSort(personA, personB) {
		let result = 1;
		if (this.direction == 'top') {
			result = -1
		};

		if (personB[this.type] >= personA[this.type]) {
			return result
		} else {
			return -result
		}
	}

	toggleDirection(element) {
		if (!element.getAttribute('data-direction')) {
			return
		};
		// переводить в один регистр.
		if (element.getAttribute('data-direction') == 'top') {
			element.setAttribute('data-direction', 'bottom')
		} else {
			element.setAttribute('data-direction', 'top')
		};

	}
}



// let table = new Table("http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}", document.querySelector('.container'));
let form = document.querySelector('.form');
let links = document.querySelector('.links');

links.addEventListener('click', (event) => {
	if (event.target.hasAttribute('data-link')) {
		let table = new Table(event.target.getAttribute('data-link'), document.querySelector('.container'));

		form.classList.remove('hidden');
		form.addEventListener('submit', (event) => {
			event.preventDefault()
			if (table.json.length == 0) return;

			let searchString = form.querySelector('[type=text]').value;
			if (searchString == '') table.renderTable(table.json);

			let serachJson = table.json.filter((person) => {
				for (let value in person) {
					if (person[value].toString().toLowerCase().indexOf(searchString.toLowerCase()) != -1) {
						return true;
					};
				}
			});

			if (serachJson.length == 0) return; // сюда навешиваем что делать, если ничего не нашли. В нашем случае ничего не делаем.
			table.renderTable(serachJson);

		})
	};
})