var convertBtn = document.querySelector('.run-button');
var Cmdinput = document.querySelector('.Cmd-input');
var ReverseProxy = "192.168.0.106";
var baseURL = "http://" + ReverseProxy + "/";
var Router = {
    "home" : "home-context",
    "ansible": "ansible-context"
}

console.log(baseURL);

convertBtn.addEventListener('click', () => {
    console.log(`CMD: ${Cmdinput.value}`);
    runCmd(Cmdinput.value);
});

function setView(id) {
    let currView;
    
    for ( var route in Router) {
        var menu = document.getElementById(route)
        var ctx = document.getElementById(Router[route])
        ctx.style.visibility = 'hidden'
        menu.style.background = 'rgb(201, 213, 219)'
        if (route == id) {
            currView = ctx
            menu.style.background = 'rgb(228, 236, 240)'
        }
        
    }

    currView.style.visibility = 'visible'
}

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
            target: 'vm',
            reverseProxy : ReverseProxy
        }
        console.log('INFO: created payload');
    } else {
        console.log('WARNING: empty command');
    }

    console.log(payload['reverseProxy']);
    fetch( baseURL + 'invoke', {
      method: 'post',
      body: JSON.stringify(payload),
    })
    changeVisibility();
}

function CreateTableFromJSON() {
    let jsondata;    
    fetch( baseURL + 'monitor/get').then(function(u){ return u.json();})
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
                    tabCell.innerHTML = myBooks[i][col[j]] ;
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
    fetch( baseURL + 'log/get').then(function(u){ return u.json();})
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
                    // display newline character literally
                    tabCell.innerHTML = "<pre class='tdata'>" + myBooks[i][col[j]] + "</pre>";
                }
            }

            // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
            var divContainer = document.getElementById("showLog");
            divContainer.innerHTML = "";
            divContainer.appendChild(table);
        }
    )
}
