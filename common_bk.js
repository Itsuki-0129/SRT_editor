// JavaScript
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
	console.dir(lines);
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
	  console.dir(currentSub);
  }
  return subtitles;
}

function displaySubtitles(subtitles) {
  const table = document.getElementById("subtitles");
  table.innerHTML = "<tr><th>No.</th><th>start</th><th>end</th><th>text</th></tr>";

  for (let i = 0; i < subtitles.length; i++) {
	  //最終業のundefined回避
	  /*if(Object.keys(subtitles[i]).length==0){
		  break;
	  }*/
    const sub = subtitles[i];
    const row = table.insertRow();
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
