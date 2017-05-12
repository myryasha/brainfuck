var results = document.getElementById('results');
var result = document.getElementById('result');
var progress = document.getElementById('progress'),
	pages = [];

let temp = [];

var r = new XMLHttpRequest();
// r.open("GET", "http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}", true);
r.open("GET", "js/test.json", true);

r.send();

r.addEventListener("progress", function (e) {
	// let data = JSON.parse(r.responseText);
	// console.log(data.person);
	// console.log(r.responseText.split('}, {'));
	// temp = r.responseText;
	// progress.innerHTML = Math.round((e.loaded / 425381) * 100) + '%';
	console.log(e);

	// temp.push(r.responseText.split('}, {'));

}, false);

r.onreadystatechange = function () {
	if (r.readyState != 4 || r.status != 200) return;
	let data = JSON.parse(r.responseText),
		max = 50,
		tbody = document.createElement('tbody');
	tbody.className = 'hidden';


	for (i = 0; i < data.length; i++) {
		tbody.insertAdjacentHTML("beforeEnd", renderRow(data[i]));

		if (i == max || i == data.length - 1) {
			results.appendChild(tbody);
			tbody = document.createElement('tbody');
			tbody.className = 'hidden';
			max += 50;
		};
	};

	results.querySelector('tbody').classList.remove('hidden');
};


function renderRow({
	id,
	firstName,
	lastName,
	email,
	phone
}) {
	return `<tr><td>${id}</td><td>${firstName}</td><td>${lastName}</td><td>${email}</td><td>${phone}</td></tr>`
};