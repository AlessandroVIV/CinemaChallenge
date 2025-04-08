"use strict";
const token = JSON.parse(localStorage.getItem("tokenUtente"));
const sezionePreno = document.querySelector(".containerPreno");
fetch(`http://localhost:3000/users/${token}`)
    .then(response => response.json())
    .then(data => {
    for (let prenotazione of data.dateVisione) {
        sezionePreno.innerHTML +=
            `
        <div class="prenotazione">
            <p>Film:${prenotazione.id}</p>
            <p>Data:${prenotazione.data}</p>
            <p>Orario:${prenotazione.orariVisione.orario}}</p>
            <p>Posti: fila ${prenotazione.OrariVisione.postiPrenotati.fila}, posto: ${prenotazione.orariVisione.postiPrenotati.posto}</p>
        </div>
        `;
    }
})
    .catch(error => console.log(error));
