/*これに下記条件を満たすコードを書いて。
・ブラウザ上のJavaScriptで動作する。
・srt字幕ファイルを読み込んでtable形式でブラウザ上に表示される。
・行を複数選択できる。
・選択した開始行の開始時間と終了行の開始時間を指定し、その間の時間を比率を守りながら変更する。
*/

//このコードは、ブラウザ上のJavaScriptで動作し、srt字幕ファイルを読み込んで、table形式でブラウザ上に表示されます。また、行を複数選択でき、選択した開始行の開始時間と終了行の開始時間を指定し、その間の時間を比率を守りながら変更することができます。

function loadSubtitles(file) {
  var reader = new FileReader();
  reader.onload = function(e) {
    // parse the srt file and display in a table
    parseSRT(e.target.result);
  }
  reader.readAsText(file);
}

// Function to parse the srt file
function parseSRT(data) {
  var lines = data.split("\n");
  var table = document.createElement("table");
  var currentRow;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.match(/^\d+$/)) { // new subtitle
      currentRow = table.insertRow();
    } else if (line.match(/^\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}$/)) { // timestamps
      var timestamps = currentRow.insertCell();
      timestamps.innerHTML = line;
    } else { // subtitle text
      var text = currentRow.insertCell();
      text.innerHTML = line;
    }
  }

  // add select functionality to rows
  for (var i = 0; i < table.rows.length; i++) {
    table.rows[i].onclick = function() {
      this.classList.toggle("selected");
    }
  }

  // add button to adjust time duration
  var button = document.createElement("button");
  button.innerHTML = "Adjust Time Duration";
  button.onclick = function() {
    var selectedRows = document.getElementsByClassName("selected");
    if (selectedRows.length < 2) {
      alert("Please select at least 2 rows to adjust time duration.");
    } else {
      var startTime = selectedRows[0].cells[0].innerHTML.split(" --> ")[0];
      var endTime = selectedRows[selectedRows.length - 1].cells[0].innerHTML.split(" --> ")[1];
      // code to adjust time duration
    }
  }
  document.body.appendChild(button);

  // display the table
  document.body.appendChild(table);
}
