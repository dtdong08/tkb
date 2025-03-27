const config = {
	subjects: [
		'Toán', 'Ngữ văn', 'Tiếng Anh', 'Vật lý', 
		'Hóa học', 'Sinh học', 'Lịch sử', 'Tin học',
		'Thể dục', 'GDĐP', 'HĐTN&HN', 'GDQP&AN',
		'Chào cờ', 'Sinh hoạt', ''
	],
	days: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
	lessons: [1, 2, 3, 4, 5],
	initialData: [
		['Chào cờ', 'Lịch sử', 'Tin học', 'Vật lý', 'Tiếng Anh', 'Sinh học'],
		['Tiếng Anh', 'Thể dục', 'Vật lý', 'Hóa học', 'GDĐP', 'HĐTN&HN'],
		['Toán', 'Hóa học', 'Ngữ văn', 'Toán', 'Sinh học', 'Toán'],
		['Hóa học', 'Tin học', 'Ngữ văn', 'Toán', 'Thể dục', 'Vật lý'],
		['Lịch sử', 'Ngữ văn', 'Tiếng Anh', '', 'GDQP&AN', 'Sinh hoạt']
	]
};

function initTimetable() {
	const tbody = document.querySelector('#timetable tbody');
	tbody.innerHTML = '';

	const data = JSON.parse(localStorage.getItem('timetable')) || config.initialData;

	data.forEach((row, rowIndex) => {
		const tr = document.createElement('tr');
		tr.innerHTML = `<td>${rowIndex + 1}</td>`;
		
		row.forEach((cell, colIndex) => {
			const td = document.createElement('td');
			td.dataset.day = config.days[colIndex];
			td.dataset.lesson = rowIndex + 1;
			td.textContent = cell;
			tr.appendChild(td);
		});
		
		tbody.appendChild(tr);
	});
}

function initControls() {
	const daySelect = document.getElementById('daySelect');
	const lessonSelect = document.getElementById('lessonSelect');
	const subjectSelect = document.getElementById('subjectSelect');

	config.days.forEach(day => {
		const option = document.createElement('option');
		option.value = day;
		option.textContent = day;
		daySelect.appendChild(option);
	});

	config.lessons.forEach(lesson => {
		const option = document.createElement('option');
		option.value = lesson;
		option.textContent = lesson;
		lessonSelect.appendChild(option);
	});

	config.subjects.forEach(subject => {
		const option = document.createElement('option');
		option.value = subject;
		option.textContent = subject;
		subjectSelect.appendChild(option);
	});
}

function updateCell() {
	const day = document.getElementById('daySelect').value;
	const lesson = document.getElementById('lessonSelect').value;
	const subject = document.getElementById('subjectSelect').value;

	const dayIndex = config.days.indexOf(day);
	const lessonIndex = parseInt(lesson) - 1;

	const tbody = document.querySelector('#timetable tbody');
	const row = tbody.children[lessonIndex];
	const cell = row.children[dayIndex + 1];
	cell.textContent = subject;

	const data = Array.from(tbody.children).map(row => 
		Array.from(row.children).slice(1).map(cell => cell.textContent)
	);
	localStorage.setItem('timetable', JSON.stringify(data));
}

document.addEventListener('DOMContentLoaded', () => {
	initControls();
	initTimetable();
});
