const config = {
	subjects: [
		'Toán', 'Ngữ văn', 'Tiếng Anh', 'Vật lý',
		'Hóa học', 'Sinh học', 'Lịch sử', 'Tin học',
		'Thể dục', 'GDĐP', 'HĐTN&HN', 'GDQP&AN',
		'Chào cờ', 'Sinh hoạt', ''
	],
	days: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
	blocks: [
		{ name: 'Sáng', lessons: 5 },
		{ name: 'Chiều', lessons: 3 },
		{ name: 'Tối', lessons: 1 }
	]
};

function initTimetable() {
	const tbody = document.querySelector('#timetable tbody');
	tbody.innerHTML = '';

	const saved = JSON.parse(localStorage.getItem('timetable')) || {};

	config.blocks.forEach(block => {
		// Tạo dòng đầu của block (có ô block với rowspan)
		const firstTr = document.createElement('tr');
		const blockTd = document.createElement('td');
		blockTd.textContent = block.name;
		blockTd.rowSpan = block.lessons;
		firstTr.appendChild(blockTd);

		// ô "Tiết 1"
		const lessonTd = document.createElement('td');
		lessonTd.textContent = `Tiết 1`;
		firstTr.appendChild(lessonTd);

		// các ô theo ngày
		config.days.forEach(day => {
			const td = document.createElement('td');
			td.dataset.block = block.name;
			td.dataset.lesson = 1;
			td.dataset.day = day;
			td.textContent = (saved?.[block.name]?.[1]?.[day]) || '';
			firstTr.appendChild(td);
		});

		tbody.appendChild(firstTr);

		// các dòng tiếp theo của block (Tiết 2..n)
		for (let i = 2; i <= block.lessons; i++) {
			const tr = document.createElement('tr');

			const lessonTdN = document.createElement('td');
			lessonTdN.textContent = `Tiết ${i}`;
			tr.appendChild(lessonTdN);

			config.days.forEach(day => {
				const td = document.createElement('td');
				td.dataset.block = block.name;
				td.dataset.lesson = i;
				td.dataset.day = day;
				td.textContent = (saved?.[block.name]?.[i]?.[day]) || '';
				tr.appendChild(td);
			});

			tbody.appendChild(tr);
		}
	});

	addCellClickHandlers();
}

function initControls() {
	const daySelect = document.getElementById('daySelect');
	const lessonSelect = document.getElementById('lessonSelect');
	const subjectSelect = document.getElementById('subjectSelect');

	daySelect.innerHTML = '';
	lessonSelect.innerHTML = '';
	subjectSelect.innerHTML = '';

	config.days.forEach(day => {
		const o = document.createElement('option');
		o.value = day;
		o.textContent = day;
		daySelect.appendChild(o);
	});

	config.blocks.forEach(block => {
		for (let i = 1; i <= block.lessons; i++) {
			const o = document.createElement('option');
			o.value = `${block.name}-${i}`;
			o.textContent = `${block.name} – Tiết ${i}`;
			lessonSelect.appendChild(o);
		}
	});

	config.subjects.forEach(sub => {
		const o = document.createElement('option');
		o.value = sub;
		o.textContent = sub;
		subjectSelect.appendChild(o);
	});
}

function addCellClickHandlers() {
	document.querySelectorAll('#timetable td[data-day]').forEach(td => {
		td.onclick = () => {
			document.getElementById('daySelect').value = td.dataset.day;
			document.getElementById('lessonSelect').value = `${td.dataset.block}-${td.dataset.lesson}`;
			document.getElementById('subjectSelect').value = td.textContent;
		};
	});
}

function updateCell() {
	const day = document.getElementById('daySelect').value;
	const lessonVal = document.getElementById('lessonSelect').value;
	const subject = document.getElementById('subjectSelect').value;

	const [block, lesson] = lessonVal.split('-');

	const cell = document.querySelector(
		`td[data-block="${block}"][data-lesson="${lesson}"][data-day="${day}"]`
	);

	if (!cell) return;

	cell.textContent = subject;

	const data = JSON.parse(localStorage.getItem('timetable')) || {};
	if (!data[block]) data[block] = {};
	if (!data[block][lesson]) data[block][lesson] = {};
	data[block][lesson][day] = subject;

	localStorage.setItem('timetable', JSON.stringify(data));
}

function resetTimetable() {
	if (prompt('Nhập "OK" để xác nhận') === 'OK') {
		localStorage.removeItem('timetable');
		initTimetable();
		document.getElementById('daySelect').selectedIndex = 0;
		document.getElementById('lessonSelect').selectedIndex = 0;
		document.getElementById('subjectSelect').selectedIndex = 0;
	}
}

document.addEventListener('DOMContentLoaded', () => {
	initControls();
	initTimetable();
});