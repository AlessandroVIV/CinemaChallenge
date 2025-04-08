// Seleziona gli elementi dal DOM
const form = document.getElementById('formPagamento') as HTMLFormElement;
const riepilogo = document.getElementById('riepilogoFinale') as HTMLElement;
const pagaOraButton = document.getElementById('pagaOra') as HTMLElement;
let token: any = JSON.parse(localStorage.getItem("tokenUtente") as any);
token = token.replace(/^"|"$/g, '');

// Seleziona i campi di input
const nomeInput = document.getElementById('nome') as HTMLInputElement;
const numeroCartaInput = document.getElementById('numeroCarta') as HTMLInputElement;
const dataScadenzaInput = document.getElementById('dataScadenza') as HTMLInputElement;
const cvvInput = document.getElementById('cvv') as HTMLInputElement;

document.querySelector(".icona a")?.addEventListener("click", function (event) {
    event.preventDefault(); // Impedisce il comportamento predefinito
    window.location.href = "../home.html";
    console.log("Reindirizzamento avviato.");
});


// Recupera la prenotazione da sessionStorage
let prenotazione: any;
const prendiPrenotazione = sessionStorage.getItem("Prenotazione");
if (prendiPrenotazione) {
    prenotazione = JSON.parse(prendiPrenotazione);
} else {
    console.log("Prenotazione non trovata");
}

// Se la prenotazione esiste, mostra il riepilogo
if (prenotazione) {
    console.log(prenotazione);

    let postiHTML = prenotazione.posti.map((posto: any) =>
        `<p>Fila: ${posto.fila}, posto: ${posto.posto}</p>`
    ).join('');

    riepilogo.innerHTML += `
        <div id="riepilogoFinale">
            <p>Titolo film: ${prenotazione.film}</p>
            <p>Data: ${prenotazione.data}</p>
            <p>Orario: ${prenotazione.orario}</p>
            <p>Posti scelti:</p>
            <div>${postiHTML}</div>
        </div>
    `;
}

// Funzione per validare un singolo campo
function validaCampo(id: string, regex: RegExp, erroreMessaggio: string): boolean {
    const campo = document.getElementById(id) as HTMLInputElement;
    const valore = campo?.value || '';

    if (!valore) {
        campo.classList.add('errore');
        campo.setCustomValidity(`Il campo '${campo.placeholder}' è obbligatorio.`);
        campo.reportValidity();
        return false;
    }

    if (!regex.test(valore)) {
        campo.classList.add('errore');
        campo.setCustomValidity(erroreMessaggio);
        campo.reportValidity();
        return false;
    }

    campo.classList.remove('errore');
    campo.setCustomValidity('');
    return true;
}

// Funzione per validare tutti i campi
function validaCampi(): boolean {
    const nomeValido = validaCampo(
        "nome",
        /^[A-Za-z\s]{1,50}$/,
        "Nome non valido. Deve contenere solo lettere e spazi, massimo 50 caratteri."
    );
    console.log("Validazione nome:", nomeValido);

    const numeroCartaValido = validaCampo(
        "numeroCarta",
        /^(\d{4}[-\s]?){3}\d{4}$/,
        "Numero della carta non valido. Deve essere composto da 16 cifre, eventualmente separate da spazi o trattini."
    );
    console.log("Validazione numero carta:", numeroCartaValido);

    const dataScadenzaValida = validaCampo(
        "dataScadenza",
        /^(0[1-9]|1[0-2])\/\d{2}$/,
        "Data di scadenza non valida. Il formato deve essere MM/YY."
    );
    console.log("Validazione data scadenza:", dataScadenzaValida);

    const cvvValido = validaCampo(
        "cvv",
        /^\d{3,4}$/,
        "CVV non valido. Deve essere composto da 3 o 4 cifre."
    );

    console.log("Validazione CVV:", cvvValido);

    return nomeValido && numeroCartaValido && dataScadenzaValida && cvvValido;
}

// Aggiungi il listener per la validazione al blur dei campi
const campi = [
    { id: "nome", regex: /^[A-Za-z\s]{1,50}$/, errore: "Nome non valido. Deve contenere solo lettere e spazi, massimo 50 caratteri." },
    { id: "numeroCarta", regex: /^(\d{4}[-\s]?){3}\d{4}$/, errore: "Numero della carta non valido. Deve essere composto da 16 cifre, eventualmente separate da spazi o trattini." },
    { id: "dataScadenza", regex: /^(0[1-9]|1[0-2])\/\d{2}$/, errore: "Data di scadenza non valida. Il formato deve essere MM/YY." },
    { id: "cvv", regex: /^\d{3,4}$/, errore: "CVV non valido. Deve essere composto da 3 o 4 cifre." }
];

campi.forEach((campo) => {
    const elemento = document.getElementById(campo.id) as HTMLInputElement;
    elemento?.addEventListener("blur", () => {
        validaCampo(campo.id, campo.regex, campo.errore);
    });
});

// Gestione del click sul pulsante "Paga ora"
pagaOraButton?.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Click su 'Paga ora' intercettato");

    if (validaCampi() && prenotazione) {
        console.log("Tutti i campi sono validi! Reindirizzamento in corso...");
        console.log("Pagamento effettuato");

        fetch(`http://localhost:3000/film/${prenotazione.idFilm}`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch film data');
                return response.json();
            })
            .then(filmData => {
                const currentDateVisione = filmData?.dateVisione ?? [];

                const updatedDateVisione = currentDateVisione.map(vision => {
                    if (vision.data === prenotazione.data && vision.orariVisione.some(orario => orario.orario === prenotazione.orario)) {
                        return {
                            ...vision,
                            orariVisione: vision.orariVisione.map(orario => {
                                if (orario.orario === prenotazione.orario) {
                                    return {
                                        ...orario,
                                        postiPrenotati: [
                                            ...orario.postiPrenotati,
                                            ...prenotazione.posti
                                        ]
                                    };
                                }
                                return orario;
                            })
                        };
                    }
                    return vision;
                });

                return fetch(`http://localhost:3000/film/${prenotazione.idFilm}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dateVisione: updatedDateVisione })
                }).then(response => {
                    if (!response.ok) throw new Error('Failed to update film data');
                    return updatedDateVisione; 
                });
            })
            .then(updatedDateVisione => {
            
                return fetch(`http://localhost:3000/users/${token}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ dateVisione: updatedDateVisione }) 
                });
            })
            .then(response => {
                if (!response.ok) throw new Error('Failed to update user data');
                return response.json();
            })
            .then(userData => {
                console.log('Updated user data:', userData);
                window.location.href = "ringraziamenti.html"
            })
            .catch(error => {
                console.error('Error updating data:', error);
            }); 
            window.location.href = "ringraziamenti.html"
    }
});

