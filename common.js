// JavaScript
let selectedRows = [];
function readSrtFile() {
  const input = document.getElementById("input");
  const file = input.files[0];

  const reader = new FileReader();
  reader.onload = function() {
    const srt = reader.result;
    const subtitles = parseSrt(srt);
    displaySubtitles(subtitles);
  };
  reader.readAsText(file);
}

function parseSrt(srt) {
  const subtitles = [];
  const lines = srt.split("\n");
  let currentSub = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      subtitles.push(currentSub);
      currentSub = {};
      continue;
    }


    if (!currentSub.id) {
      currentSub.id = line;
    } else if (!currentSub.start) {
      const [start, end] = line.split(" --> ");
      currentSub.start = start;
      currentSub.end = end;
    } else {
      if (!currentSub.text) {
        currentSub.text = line;
      } else {
        currentSub.text += `<br>${line}`;
      }
    }
  }
  return subtitles;
}

function displaySubtitles(subtitles) {
  const table = document.getElementById("subtitles");
  table.innerHTML = "<tr><th>No.</th><th>start</th><th>end</th><th>text</th></tr>";

  for (let i = 0; i < subtitles.length; i++) {
    const sub = subtitles[i];
    const row = table.insertRow();
    row.setAttribute("id", i);
    row.addEventListener("click", handleRowClick);
    const idCell = row.insertCell(0);
    const startCell = row.insertCell(1);
    const endCell = row.insertCell(2);
    const textCell = row.insertCell(3);
    idCell.innerHTML = sub.id;
    startCell.innerHTML = sub.start;
    endCell.innerHTML = sub.end;
    textCell.innerHTML = sub.text;
  }
}

function handleRowClick(event) {
  const row = event.target.parentNode;
  if (event.shiftKey) {
    selectMultipleRows(row);
  } else {
    selectSingleRow(row);
  }
}

function selectSingleRow(row) {
  deselectAllRows();
  selectedRows = [row];
  row.classList.add("selected");
}

function selectMultipleRows(row) {
  const startIndex = selectedRows[0].id;
  const endIndex = row.id;
  deselectAllRows();
  selectedRows = Array.from(table.rows).slice(Math.min(startIndex, endIndex), Math.max(startIndex, endIndex) + 1);
  selectedRows.forEach(row => row.classList.add("selected"));
}

function deselectAllRows() {
  selectedRows.forEach(row => row.classList.remove("selected"));
  selectedRows = [];
}

function modifySelectedRows(startTime, endTime) {
  if (selectedRows.length < 2) {
    console.log("Please select at least 2 rows to modify");
    return;
  }
  const startRow = selectedRows[0];
  const endRow = selectedRows[selectedRows.length - 1];
  const startRowStartTime = startRow.cells[1].innerHTML;
  const endRowStartTime = endRow.cells[1].innerHTML;
  const ratio = (endTime - startTime) / (endRowStartTime - startRowStartTime);

  selectedRows.forEach((row, i) => {
    const newStartTime = startTime + (row.cells[1].innerHTML - startRowStartTime) * ratio;
    const newEndTime = newStartTime + (row.cells[2].innerHTML - row.cells[1].innerHTML) * ratio;
    row.cells[1].innerHTML = newStartTime;
    row.cells[2].innerHTML = newEndTime;
  });
}
