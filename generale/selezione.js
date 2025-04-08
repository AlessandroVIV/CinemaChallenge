var _a;
const bottoneInvia = document.querySelector(".bottoneInvia2");
const test = document.getElementById("riepilogo");
let prenotazione;
const prendiPrenotazione = sessionStorage.getItem("Prenotazione");
if (prendiPrenotazione) {
    prenotazione = JSON.parse(prendiPrenotazione);
    console.log(prenotazione);
}
else {
    console.log("prenotazione non trovata");
}
generaPosti(8, 17);
let dataVisione = parseInt(prenotazione.indexData);
let oraVisione = parseInt(prenotazione.indexOra);
let postiPrenotati = [];
let postiScelti = [];
document.addEventListener("DOMContentLoaded", () => {
    fetch(`http://localhost:3000/film/${prenotazione.idFilm}`)
        .then(response => response.json())
        .then(data => {
        postiPrenotati = data.dateVisione[dataVisione].orariVisione[oraVisione].postiPrenotati;
        console.log(postiPrenotati); // Check the data
        // Proceed with filtering only after postiPrenotati is populated
        if (test && prenotazione) {
            test.innerHTML = `
                    <p>Titolo film: ${prenotazione.film}</p>
                    <p>Data: ${prenotazione.data}</p>
                    <p>Orario: ${prenotazione.orario}</p>
                `;
            const posti = document.querySelectorAll(".posto");
            // Ensure that postiPrenotati is populated before filtering
            postiScelti = Array.from(posti).filter((posto) => {
                return postiPrenotati.some((postoPrenotato) => posto.dataset.fila === postoPrenotato.fila &&
                    posto.dataset.posto === postoPrenotato.posto);
            });
            console.log(postiScelti); // Check the selected posts
            for (let posto of postiScelti) {
                posto.classList.add("nonDisponibile");
            }
        }
    })
        .catch(error => console.error(error));
});
function generaPosti(file, posti) {
    const container = document.getElementById("postiCinema");
    container.innerHTML = "";
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Letters for seats
    for (let fila = 0; fila < file; fila++) {
        const divFila = document.createElement("div");
        divFila.classList.add("fila");
        for (let posto = 0; posto < posti; posto++) {
            const divPosto = document.createElement("div");
            divPosto.classList.add("posto");
            divPosto.innerText = posto;
            divPosto.dataset.fila = (fila + 1).toString();
            // Generate letter for posto (seat) based on the position
            const postoLetter = letters[posto % letters.length];
            divPosto.dataset.posto = postoLetter;
            divFila.appendChild(divPosto);
        }
        container.appendChild(divFila);
    }
}
;
document.querySelectorAll(".posto").forEach((posto) => {
    posto.addEventListener("click", () => {
        var _a;
        posto.classList.toggle("selected");
        if (posto.classList.contains("selected")) {
            const postoPrenotazione = { fila: posto.dataset.fila, posto: posto.dataset.posto };
            if (!prenotazione.posti) {
                prenotazione.posti = [];
            }
            (_a = prenotazione.posti) === null || _a === void 0 ? void 0 : _a.push(postoPrenotazione);
            console.log(prenotazione.posti);
            console.log(prenotazione);
        }
        else {
            // Remove the posto from prenotazione.posti
            const fila = posto.dataset.fila;
            const numeroPosto = posto.dataset.posto;
            if (prenotazione.posti) {
                prenotazione.posti = prenotazione.posti.filter((p) => p.fila !== fila || p.posto !== numeroPosto);
            }
            console.log(prenotazione.posti);
            console.log(prenotazione);
        }
    });
});
bottoneInvia === null || bottoneInvia === void 0 ? void 0 : bottoneInvia.addEventListener("click", () => {
    sessionStorage.setItem("Prenotazione", JSON.stringify(prenotazione));
    console.log(prenotazione);
    window.location.href = "pagamento.html";
});
const light = document.getElementById('light');
document.addEventListener('mousemove', (e) => {
    light.style.left = `${e.pageX}px`;
    light.style.top = `${e.pageY}px`;
});
(_a = document.querySelector(".icona a")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function (event) {
    event.preventDefault(); // Impedisce il comportamento predefinito
    window.location.href = "../home.html";
    console.log("Reindirizzamento avviato.");
});
export {};
