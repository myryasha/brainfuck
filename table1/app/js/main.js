let results = document.getElementById('results'),
	pagesNav = document.getElementById('pages'), // навигачия по страницам таблицы
	pagesActive, // активная страница в данный момент времени
	pages = [],
	progress = document.getElementById('progress'),
	json = [],
	firstPage = true,
	temp = results.getElementsByTagName('tbody'),
	maxElems = 50;

var request = new XMLHttpRequest();
request.open("GET", "http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}", true);
// request.open("GET", "js/test.json", true);
request.send();

request.addEventListener('error', function (e) {
	// console.log('error ' + e);
	request.open("GET", "js/test.json", true);
	request.send();
});

request.addEventListener("progress", function (e) {
	// console.log(e);
	try {
		json = JSON.parse(request.responseText);
	} catch (e) {
		json = getJson(request.responseText);
	}

	// как только получаем досточно данных для одной страницы - показываем ее пользователю.
	if (firstPage) {
		if (json.length >= maxElems) {
			json.length = maxElems;
			pages[0] = json;
			results.insertAdjacentHTML('beforeEnd', renderPage(pages[0], 0, true));
			pagesActive = temp[0];
			firstPage = false;
			progress.classList.add('hidden');
		};
		progress.innerHTML = Math.round(json.length / maxElems * 100) + '%';
	};

}, false);

request.onreadystatechange = function () {
	let pagesCounter = '';
	if (request.readyState != 4 || request.status != 200) return;
	// console.log('final');

	if (!pages[0]) {
		pages[0] = json;
		results.insertAdjacentHTML('beforeEnd', renderPage(pages[0], 0, true));
		progress.classList.add('hidden');
		return;
	};

	for (let i = 0; i < Math.ceil(json.length / 50); i++) {
		pages[i] = json.slice(i * maxElems, i * maxElems + maxElems); // собираем массив по стрницам
		pagesCounter += `<li data-page-link=${i}>${i + 1}</li>`;
	};

	for (let i = 0; i < pages.length; i++) {
		if (!firstPage && i == 0) { // если первая страница уже создана, тогда пропускаем ее создание. 
			continue;
		};

		results.insertAdjacentHTML('beforeEnd', renderPage(pages[i], i, false));
	};



	pagesNav.innerHTML = `<ul>${pagesCounter}</ul>`


};

function renderTable(firstRender = false) {

	if (!firstRender) {
		pages = [];
		firstPage = true;
		let tbodys = results.querySelectorAll('tbody');
		for (var i = 0; i < tbodys.length; i++) {
			tbodys[i].remove();
		};
	};

	for (let i = 0; i < Math.ceil(json.length / 50); i++) {
		pages[i] = json.slice(i * maxElems, i * maxElems + maxElems); // собираем массив по стрницам
		// pagesCounter += `<li data-page-link=${i}>${i + 1}</li>`;
	};

	for (let i = 0; i < pages.length; i++) {
		if (!firstPage && i == 0) { // если первая страница уже создана, тогда пропускаем ее создание. 
			continue;
		}
		results.insertAdjacentHTML('beforeEnd', renderPage(pages[i], i, false));
	};
	temp[0].classList.add('page-active');
	pagesActive = temp[0];

}

function renderPage(rows, number, isActive = false) {
	let result = '';
	if (isActive) {
		isActive = 'page-active';

	} else {
		isActive = '';
	}
	for (i = 0; i < rows.length; i++) {
		result += renderRow(rows[i]);
	};
	return `<tbody data-page="${number}" class="${isActive} "> ${result} </tbody>`;

}

function renderRow({
	id,
	firstName,
	lastName,
	email,
	phone
}) {
	return `<tr><td>${id}</td><td>${firstName}</td><td>${lastName}</td><td>${email}</td><td>${phone}</td></tr>`
};



function getJson(json) {
	try {
		return json = JSON.parse(json + ']');
	} catch (e) {
		return getJson(json.slice(0, json.lastIndexOf(',')));
	}
}

pagesNav.addEventListener('click', function (event) {

	if (event.target.hasAttribute('data-page-link')) {
		pagesActive.classList.remove('page-active');
		temp[event.target.getAttribute('data-page-link')].classList.add('page-active');
		pagesActive = temp[event.target.getAttribute('data-page-link')];
	};

});

document.querySelector('.results>thead').addEventListener('click', function (event) {

	if (json.length == 0) {
		return
	};

	switch (event.target.getAttribute('data-type')) {
	case "id":
		{

			if (event.target.getAttribute('data-direction') == 'top') {
				json = json.sort(function (personA, personB) {
					return personB.id - personA.id;
				});
				event.target.setAttribute('data-direction', 'bottom');

			} else {

				json = json.sort(function (personA, personB) {
					return personA.id - personB.id;
				});
				event.target.setAttribute('data-direction', 'top');
			}


			break;
		}
	case "firstName":
		{

			if (event.target.getAttribute('data-direction') == 'top') {
				json = json.sort(function (personA, personB) {
					if (personB.firstName >= personA.firstName) {
						return 1
					} else {
						return -1
					}
				});
				event.target.setAttribute('data-direction', 'bottom');

			} else {

				json = json.sort(function (personA, personB) {
					if (personB.firstName < personA.firstName) {
						return 1
					} else {
						return -1
					}
				});
				event.target.setAttribute('data-direction', 'top');
			}

			break;

		}
	case "lastName":
		{

			if (event.target.getAttribute('data-direction') == 'top') {
				json = json.sort(function (personA, personB) {
					if (personB.lastName >= personA.lastName) {
						return 1
					} else {
						return -1
					}
				});
				event.target.setAttribute('data-direction', 'bottom');

			} else {

				json = json.sort(function (personA, personB) {
					if (personB.lastName < personA.lastName) {
						return 1
					} else {
						return -1
					}
				});
				event.target.setAttribute('data-direction', 'top');
			}

			break;

		}
	}
	renderTable();
});