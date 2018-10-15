var table = document.getElementById("m_table");
var currentCellIndex = -1;
var flagOnClick = false;
var flagFilter = false;
var realRows = [];
var secondFlagFilter = false;

table.onclick = (e) => {
    if (e.target.tagName != 'TH') {
        return;
    }
    if (e.target.cellIndex != currentCellIndex || flagOnClick === true) {
        tableSort(e.target.cellIndex, e.target.getAttribute('datatype'),true);
        currentCellIndex = e.target.cellIndex;
        flagOnClick = false;
    } else {
        tableSort(e.target.cellIndex, e.target.getAttribute('datatype'),false);
        currentCellIndex = e.target.cellIndex;
        flagOnClick = true;
    }
};

function tableSort(columns, type, flag) {
    var mbody = document.getElementById("mbody");
    var rows = [].slice.call(mbody.rows);
    var comparator;
    switch (type) {
        case "title_name":
            comparator = (rowA, rowB) => {
                if (flag)
                    return rowA.cells[columns].textContent > rowB.cells[columns].textContent;
                else return !(rowA.cells[columns].textContent > rowB.cells[columns].textContent)
            };
        break;
        case "title_instock":
            comparator = (rowA, rowB) => {
                let dateA = (rowA.cells[columns].textContent !== "В наличии")  ?
                    new Date(String(rowA.cells[columns].textContent).replace(/(\d+)-(\d+)-(\d+)/, '$2/$1/$3')) : new Date(null);
                let dateB = (rowB.cells[columns].textContent !== "В наличии")  ?
                    new Date(String(rowB.cells[columns].textContent).replace(/(\d+)-(\d+)-(\d+)/, '$2/$1/$3')) : new Date(null);
                if (flag) {
                    return dateA > dateB;
                }
                else return !(dateA > dateB)
            }
        break;
        default:
            comparator = (rowA, rowB) => {
                if (flag)
                    return rowA.cells[columns].innerHTML > rowB.cells[columns].innerHTML;
                else return !(rowA.cells[columns].innerHTML > rowB.cells[columns].innerHTML)
            };
    }
    rows.sort(comparator);
    table.removeChild(mbody);
    for (let i = 0; i < rows.length; i++) {
        mbody.appendChild(rows[i]);
    }
    table.appendChild(mbody);
}

_filter.onclick = () => {
    if (flagFilter === false && secondFlagFilter === false) {
        realRows = deleteStock();
        document.getElementById("_filter").innerHTML="Показать 'Возврат'";
        flagFilter = true;
    } else if (flagFilter === true && secondFlagFilter === false) {
        deleteSecondStock(realRows);
        document.getElementById("_filter").innerHTML="Вернуть";
        secondFlagFilter = true;
    }else {
        goBack(realRows);
        document.getElementById("_filter").innerHTML="Показать 'В наличии'";
        flagFilter = false;
        secondFlagFilter = false;
    }
}

function deleteStock() {
    var mbody = document.getElementById("mbody");
    var rows = [].slice.call(mbody.rows);
    var deletedRows = [];
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].cells[3].innerHTML.localeCompare("В наличии") == 0) {
            deletedRows.push(rows[i])
        }
    }
    table.removeChild(mbody);
    mbody.innerText = "";
    for (let i = 0; i < deletedRows.length; i++) {
        mbody.appendChild(deletedRows[i]);
    }
    table.appendChild(mbody);
    return rows;
}

function deleteSecondStock(rows) {
    var mbody = document.getElementById("mbody");
    var deletedRows = [];
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].cells[3].innerHTML.localeCompare("В наличии") != 0) {
            deletedRows.push(rows[i])
        }
    }
    table.removeChild(mbody);
    mbody.innerText = "";
    for (let i = 0; i < deletedRows.length; i++) {
        mbody.appendChild(deletedRows[i]);
    }
    table.appendChild(mbody);
}

function goBack(rows) {
    var mbody = document.getElementById("mbody");
    table.removeChild(mbody);
    mbody.innerText = "";
    for (let i = 0; i < rows.length; i++) {
        mbody.appendChild(rows[i]);
    }
    table.appendChild(mbody);
}

_save.onclick = () => {
    addBook();
};

function addBook() {
    var name = document.getElementById("newBookName");
    var author = document.getElementById("newBookAuthor");
    var year = document.getElementById("newBookYear");
    if (name.value === "" || author.value === "" || year.value === "") {
        alert("Ошибка! Не все поля заполнены");
        return;
    }
    addRequest("PUT", {
        id: null,
        master: null,
        name: name.value,
        author: author.value,
        date: year.value,
        in_stock: true,
        return_date: null
    }, cb=>{});
    setTimeout('document.location.href="/listOfBooks";',200)
}

function addRequest(method, body, callback) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        //if (this.readyState === 4 && this.status === 200) {
            callback(JSON.parse(this.responseText));
       // }
       // if(this.readyState===4 && this.status === 400) {
       //     alert(JSON.parse(this.responseText).message);
       // }
    };
    xhttp.open(method, "/ajax/", true);
    xhttp.setRequestHeader("Content-Type","application/json");
    xhttp.send(JSON.stringify(body,null,2));
}