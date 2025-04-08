// Seleziona gli elementi dal DOM
const registerForm: any = document.getElementById("registerForm");
const loginForm: any = document.getElementById("loginForm");

const emailLog: any = document.getElementById("email");
const passwordLog: any = document.getElementById("password");

const nome: any = document.getElementById("nome");
const cognome: any = document.getElementById("cognome");
const email: any = document.getElementById("emailRegistrazione");
const numero: any = document.getElementById("telefono");
const password: any = document.getElementById("passwordRegistrazione");

// Regex di validazione
const regexValidations = {
    nome: /^[A-Za-z\s]{2,50}$/, // Solo lettere e spazi, tra 2 e 50 caratteri
    cognome: /^[A-Za-z\s]{2,50}$/, // Solo lettere e spazi, tra 2 e 50 caratteri
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email nel formato utente@dominio.estensione
    numero: /^\+?[0-9]{10,15}$/, // Numero di telefono (10-15 cifre, opzionale +)
    password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, // Password complessa
};

// Funzione per convalidare i dati di registrazione
const convalidaDati2 = (): boolean => {
    const isNomeValid = regexValidations.nome.test(nome.value.trim());
    const isCognomeValid = regexValidations.cognome.test(cognome.value.trim());
    const isEmailValid = regexValidations.email.test(email.value.trim());
    const isNumeroValid = regexValidations.numero.test(numero.value.trim());
    const isPasswordValid = regexValidations.password.test(password.value.trim());

    // Gestisci gli errori visivi
    nome.classList.toggle("errore", !isNomeValid);
    cognome.classList.toggle("errore", !isCognomeValid);
    email.classList.toggle("errore", !isEmailValid);
    numero.classList.toggle("errore", !isNumeroValid);
    password.classList.toggle("errore", !isPasswordValid);

    if (!isNomeValid) {
        nome.setCustomValidity("Il nome deve contenere solo lettere e spazi (max 50 caratteri).");
    } else {
        nome.setCustomValidity("");
    }

    if (!isCognomeValid) {
        cognome.setCustomValidity("Il cognome deve contenere solo lettere e spazi (max 50 caratteri).");
    } else {
        cognome.setCustomValidity("");
    }

    if (!isEmailValid) {
        email.setCustomValidity("Inserire un'email valida.");
    } else {
        email.setCustomValidity("");
    }

    if (!isNumeroValid) {
        numero.setCustomValidity("Inserire un numero di telefono valido (10-15 cifre, opzionale prefisso +).");
    } else {
        numero.setCustomValidity("");
    }

    if (!isPasswordValid) {
        password.setCustomValidity(
            "La password deve contenere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un simbolo speciale."
        );
    } else {
        password.setCustomValidity("");
    }

    // Ritorna true se tutti i campi sono validi
    return isNomeValid && isCognomeValid && isEmailValid && isNumeroValid && isPasswordValid;
};

// Funzione per registrare un nuovo utente
registerForm?.addEventListener("submit", (e: Event) => {
    e.preventDefault();

    // Convalida i dati prima di procedere
    if (convalidaDati2()) {
        const utenteNuovo = {
            nome: nome.value.trim(),
            cognome: cognome.value.trim(),
            numero: numero.value.trim(),
            email: email.value.trim(),
            password: password.value.trim(),
        };

        // Esegui la richiesta per registrare l'utente
        fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(utenteNuovo),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to register user");
                }
                return response.json();
            })
            .then((data) => {
                console.log("User registered successfully:", data);
                alert("Registrazione completata!");
                registerForm.reset(); // Resetta il form
            })
            .catch((error) => {
                console.error("Error during registration:", error);
                alert("Errore durante la registrazione.");
            });
    } else {
        alert("Errore nei dati inseriti. Controlla i campi evidenziati.");
    }
});

// Funzione per gestire il login
const loginUser = async (email: string, password: string) => {
    try {
        const response = await fetch(
            `http://localhost:3000/users?email=${email}&password=${password}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Login request failed");
        }

        const data = await response.json();

        if (data.length > 0) {
            console.log("Login successful:", data[0]);
            localStorage.setItem("tokenUtente", JSON.stringify(data[0].id)); // Salva l'ID utente nel localStorage
            return data[0];
        } else {
            console.log("Invalid username or password");
            alert("Email o password errati!");
            return null;
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Errore durante il login.");
        return null;
    }
};

// Gestione dell'evento di login
loginForm?.addEventListener("submit", async (e: Event) => {
    e.preventDefault();

    const emailValue = emailLog.value.trim();
    const passwordValue = passwordLog.value.trim();

    // Esegui la funzione di login
    const user = await loginUser(emailValue, passwordValue);

    if (user) {
        alert("Login effettuato con successo!");
        setTimeout(() => {
            window.location.reload(); // Ricarica la pagina dopo il login
        }, 500);
    }
});
