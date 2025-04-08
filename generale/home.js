"use strict";
var _a;
const containerCard = document.querySelector(".containerCard");
const bottoneInvia = document.querySelector(".bottoneInvia");
const selectFilm = document.getElementById("selectFilm");
const selectOra = document.getElementById("selectOra");
const selectData = document.getElementById("selectData");
const areaPersonale = document.querySelector(".areaPersonale");
const benvenuto = document.getElementById("benvenuto");
const voceRegistrati = document.querySelector(".hide.registrati");
const voceAccedi = document.querySelector(".hide.accedi");
const voceLogOut = document.querySelector(".hide.logout");
let cards;
let luoghi;
let date;
let cleanToken;
if (localStorage.getItem("tokenUtente")) {
    voceRegistrati.style.display = "none";
    voceAccedi.style.display = "none";
    voceLogOut.style.display = "block";
    areaPersonale.style.display = "block";
    // Get the token from localStorage
    const token = localStorage.getItem("tokenUtente");
    cleanToken = token.replace(/^"|"$/g, '').trim();
    console.log(cleanToken);
    // Send the token to your backend to retrieve user data
    fetch(`http://localhost:3000/users/${cleanToken}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${cleanToken}`,
        },
    })
        .then(response => response.json())
        .then(data => {
        console.log("User data:", data);
        benvenuto.innerHTML = `
            Benvenuto, ${data.nome}
        `;
    })
        .catch(error => {
        console.error("Error fetching user data:", error);
    });
}
else {
    console.log("senza token");
    voceAccedi.style.display = "block";
    voceRegistrati.style.display = "block";
    voceLogOut.style.display = "none";
    areaPersonale.style.display = "none";
}
voceLogOut.addEventListener("click", () => {
    localStorage.setItem("tokenUtente", "");
    console.log("cliccato logout");
    setTimeout(() => {
        window.location.reload();
    }, 500);
});
areaPersonale.addEventListener("click", () => {
    window.location.href = `dashboard.html`;
});
fetch("http://localhost:3000/film")
    .then(response => response.json())
    .then(data => {
    cards = data;
    for (let card of cards) {
        selectFilm.innerHTML += `
        <option data-id="${card.id}" data-titolo="${card.titolo}" value="${card.id}">${card.titolo}</option> 
    `;
    }
})
    .catch(error => { });
let filmScelto;
selectFilm.addEventListener("click", (event) => {
    filmScelto = event.target.value;
    fetch(`http://localhost:3000/film/${filmScelto}`)
        .then(response => response.json())
        .then((data) => {
        selectData.innerHTML = "";
        data.dateVisione.forEach((giorno, index) => {
            selectData.innerHTML += `
                    <option data-index="${index}" data-data="${giorno.data}" value="${index}">${giorno.data}</option>
                `;
        });
    });
});
selectData.addEventListener("click", (event) => {
    let index = event.target.value;
    fetch(`http://localhost:3000/film/${filmScelto}`)
        .then(response => response.json())
        .then((data) => {
        selectOra.innerHTML = "";
        const orari = data.dateVisione[index].orariVisione;
        orari.forEach((item, orarioIndex) => {
            selectOra.innerHTML += `
                    <option data-orario="${item.orario}" data-index="${orarioIndex}" value="${orarioIndex}">${item.orario}</option>
                `;
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/film")
        .then(response => response.json())
        .then(data => {
        cards = data;
        for (let card of cards) {
            card.addEventListener;
            if (containerCard) {
                containerCard.innerHTML +=
                    `
            <div class="card" data-id="${card.id}">
            <p>${card.titolo}</p> 
            <div class="imageCard"><img src="${card.copertina}"></div>
            </div>
            `;
            }
            document.querySelectorAll(".card").forEach((cardBack, index) => {
                cardBack.style.setProperty('--before-bg', `url("${cards[index].copertina}")`);
            });
        }
    })
        .catch(error => { });
});
bottoneInvia === null || bottoneInvia === void 0 ? void 0 : bottoneInvia.addEventListener("click", () => {
    const selectedFilm = selectFilm.selectedOptions[0];
    const selectedOra = selectOra.selectedOptions[0];
    const selectedData = selectData.selectedOptions[0];
    if (!selectedFilm || !selectedData) {
        console.error("Film o data non solezionati");
        return;
    }
    const prenotazione = {
        film: selectedFilm.getAttribute("data-titolo"),
        orario: selectedOra.getAttribute("data-orario"),
        data: selectedData.getAttribute("data-data"),
        idFilm: selectedFilm.getAttribute("data-id"),
        indexOra: selectedOra.getAttribute("data-index"),
        indexData: selectedData.getAttribute("data-index"),
    };
    sessionStorage.setItem("Prenotazione", JSON.stringify(prenotazione));
    console.log(prenotazione);
    window.location.href = "selezione.html";
});
(_a = document.querySelector(".icona")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
    window.location.href = "../home.html";
    console.log("gigi");
});
