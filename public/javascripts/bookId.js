saveWho.onclick = () => {
    take();
};

modalDelete.onclick = () => {
  deleteBook();
};

__save.onclick = () => {
    changeBook();
};

giveBookButton.onclick = () => {
    give();
};

function take() {
    var id = document.location.href.split('book/')[1].split('#')[0];
    var name = document.getElementById("newWho");
    var passport = document.getElementById("newPassport");
    var date = document.getElementById("newDate");
    if (name.value === "" || passport.value === "" || date.value === "") {
        alert("Ошибка! Не все поля заполнены");
        return;
    }
    if (new Date(date.value) < new Date()) {
        alert("Ошибка! Дата введена некорректно")
        return;
    }
    addRequest("PUT", {
        id: id,
        master: {name: name.value, passport: passport.value},
        name: null,
        author: null,
        date: null,
        in_stock: false,
        return_date: date.value
    }, cb=>{},"/ajax2/");
    alert("Книа взята в аренду");
    setTimeout('document.location.href="/listOfBooks";',400)
   // setTimeout('document.location.href;',200)
}

function give() {
    var id = document.location.href.split('book/')[1].split('#')[0];
    addRequest("PUT", {
        id: id,
        master: null,
        name: null,
        author: null,
        date: null,
        in_stock: true,
        return_date: null
    }, cb=>{},"/ajax3/");
    alert("Книга возвращена в библиотеку");
    setTimeout('document.location.href="/listOfBooks";',400)
  //  setTimeout('document.location.href;',200)
}

function deleteBook() {
    var id = document.location.href.split('book/')[1].split('#')[0];
    console.log("begin")
    addRequest("DELETE", {
        id: id,
        master: null,
        name: null,
        author: null,
        date: null,
        in_stock: true,
        return_date: null
    }, cb=>{},"/ajax4/");
    console.log("two")
    alert("Удаление прошло успешно");
    setTimeout('document.location.href="/listOfBooks";',400)
}


function changeBook() {
    var id = document.location.href.split('book/')[1].split('#')[0];
    var name = document.getElementById("changeBookName");
    var author = document.getElementById("changeBookAuthor");
    var year = document.getElementById("changeBookYear");
    if (name.value === "" || author.value === "" || year.value === "") {
        alert("Ошибка! Не все поля заполнены");
        return;
    }
    addRequest("PUT", {
        id: id,
        master: null,
        name: name.value,
        author: author.value,
        date: year.value,
        in_stock: true,
        return_date: null
    }, cb=>{},'/ajax5/');
    alert("Изменения прошли успешно");
    setTimeout('document.location.href="/listOfBooks";',400)
}

function addRequest(method, body, callback,type) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            callback(JSON.parse(this.responseText));
        }
        if(this.readyState===4 && this.status === 400) {
            alert(JSON.parse(this.responseText).message);
        }
    };
    xhttp.open(method, type, true);
    xhttp.setRequestHeader("Content-Type","application/json");
    xhttp.send(JSON.stringify(body,null,2));
}