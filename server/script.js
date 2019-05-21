var convertBtn = document.querySelector('.run-button');
var Cmdinput = document.querySelector('.Cmd-input');

convertBtn.addEventListener('click', () => {
    console.log(`CMD: ${Cmdinput.value}`);
    runCmd(Cmdinput.value);
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function changeVisibility() {
    var feedback = document.getElementById('feedback')
    feedback.style.visibility = 'visible'
    await sleep(2000);
    feedback.style.visibility = 'hidden'
}

function runCmd(cmd) {

    if (cmd) {
        payload = {
            cmd: cmd,
            target: 'localhost'
        }
        console.log('INFO: created payload');
    } else {
        console.log('WARNING: empty command');
    }

    fetch('http://invoke:8080/invoke', {
      method: 'post',
      body: JSON.stringify(payload)
    })
    changeVisibility();
}

function CreateTableFromJSON() {
    let jsondata;    
    fetch('http://monitor:8081/monitor/get').then(function(u){ return u.json();})
    .then(function(json){
            jsondata = json;
            console.log(jsondata)
            var myBooks = [
                jsondata
            ]

            // EXTRACT VALUE FOR HTML HEADER. 
            // ('Book ID', 'Book Name', 'Category' and 'Price')
            var col = [];
            for (var i = 0; i < myBooks.length; i++) {
                for (var key in myBooks[i]) {
                    if (col.indexOf(key) === -1) {
                        col.push(key);
                    }
                }
            }

            // CREATE DYNAMIC TABLE.
            var table = document.createElement("table");

            // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

            var tr = table.insertRow(-1);                   // TABLE ROW.

            for (var i = 0; i < col.length; i++) {
                var th = document.createElement("th");      // TABLE HEADER.
                th.innerHTML = col[i];
                tr.appendChild(th);
            }

            // ADD JSON DATA TO THE TABLE AS ROWS.
            for (var i = 0; i < myBooks.length; i++) {

                tr = table.insertRow(-1);

                for (var j = 0; j < col.length; j++) {
                    var tabCell = tr.insertCell(-1);
                    tabCell.innerHTML = myBooks[i][col[j]];
                }
            }

            // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
            var divContainer = document.getElementById("showData");
            divContainer.innerHTML = "";
            divContainer.appendChild(table);
        }
    )
}

function CreateTableFromJSON_() {
    let jsondata;    
    fetch('http://logging:8082/log/get').then(function(u){ return u.json();})
    .then(function(json){
            jsondata = json;
            console.log(jsondata)
            var myBooks = [
                jsondata
            ]

            // EXTRACT VALUE FOR HTML HEADER. 
            // ('Book ID', 'Book Name', 'Category' and 'Price')
            var col = [];
            for (var i = 0; i < myBooks.length; i++) {
                for (var key in myBooks[i]) {
                    if (col.indexOf(key) === -1) {
                        col.push(key);
                    }
                }
            }

            // CREATE DYNAMIC TABLE.
            var table = document.createElement("table");

            // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

            var tr = table.insertRow(-1);                   // TABLE ROW.

            for (var i = 0; i < col.length; i++) {
                var th = document.createElement("th");      // TABLE HEADER.
                th.innerHTML = col[i];
                tr.appendChild(th);
            }

            // ADD JSON DATA TO THE TABLE AS ROWS.
            for (var i = 0; i < myBooks.length; i++) {

                tr = table.insertRow(-1);

                for (var j = 0; j < col.length; j++) {
                    var tabCell = tr.insertCell(-1);
                    tabCell.innerHTML = myBooks[i][col[j]];
                }
            }

            // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
            var divContainer = document.getElementById("showLog");
            divContainer.innerHTML = "";
            divContainer.appendChild(table);
        }
    )
}
