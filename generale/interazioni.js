//----- APERTURA MENU LATERALE ----//
let menu = document.querySelector(".menu");
let sideBar = document.getElementById("sideBar");
menu.onclick = function () {
    sideBar.style.display = "flex";
}

//--- CHIUSURA MENU LATERALE ---//
let closeSide = document.querySelector(".close");
closeSide.onclick = function () {
    sideBar.style.display = "none";
}

//----- POPUP LOGIN -----//
let loginButton = document.querySelector(".hide.accedi");
let loginSideButton = document.querySelector(".side-accedi");
let popupLogin = document.getElementById("loginForm");

let body = document.querySelector("body");

loginButton.onclick = function () {
    popupRegistra.style.display = "none";
    popupLogin.style.display = "block";
    body.style.overflow = "hidden";
}

loginSideButton.onclick = function () {
    sideBar.style.display = "none";
    popupRegistra.style.display = "none";
    popupLogin.style.display = "block";
    body.style.overflow = "hidden";
}

//----- POPUP REGISTER -----//
let registerButton = document.querySelector(".registrati");
let registerSideButton = document.querySelector(".side-registrati");
let popupRegistra = document.getElementById("registerForm");

registerButton.onclick = function () {
    popupLogin.style.display = "none";
    popupRegistra.style.display = "block";
    body.style.overflow = "hidden";
}

registerSideButton.onclick = function () {
    sideBar.style.display = "none";
    popupLogin.style.display = "none";
    popupRegistra.style.display = "block";
    body.style.overflow = "hidden";
}

//------ CHIUSURA POPUP ------//
let arrows = document.querySelectorAll(".arrow");
for (let arrow of arrows) {
    arrow.onclick = function () {
        body.style.overflow = "";
        popupRegistra.style.display = "none";
        popupLogin.style.display = "none";
    }
}


const light = document.getElementById('light')

const divElement = document.querySelector('.containerLight')

divElement.addEventListener('mousemove', (e) => {
    const rect = divElement.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    light.style.left = `${mouseX}px`;
    light.style.top = `${mouseY}px`;
}); 

//----- SLIDER -----//
const slides = document.querySelector('.slides');
const slide = document.querySelectorAll('.slide');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

let currentIndex = 0;

function showSlide(index) {
    const slideWidth = slide[0].clientWidth;
    slides.style.transform = `translateX(${-index * slideWidth}px)`;
}

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : slide.length - 1;
    showSlide(currentIndex);
});

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex < slide.length - 1) ? currentIndex + 1 : 0;
    showSlide(currentIndex);
});

setInterval(() => {
    nextButton.click();
}, 5000);

//----- GESTIONE CARTE FILM -----//
const containerCard = document.querySelector(".containerCard");
const searchInput = document.getElementById("cercaFilm");
const genreSelect = document.querySelector("select[name='films']");
const ratingSelect = document.querySelector("#ratingSelect");

let selectedGenre = ""; 
let selectedRating = ""; 
let cards = []; 

fetch("http://localhost:3000/film")
    .then(response => response.json())
    .then(data => {
        cards = data;
        aggiornaFilm(); 
    })
    .catch(error => {
        console.error("Errore nel caricamento dei film:", error);
    });

function aggiornaFilm() {
    const query = searchInput ? searchInput.value.toLowerCase() : "";

    const filteredFilms = cards.filter((film) => {
        const matchesTitle = film.titolo.toLowerCase().includes(query);
        const matchesGenre = !selectedGenre || film.genere.toLowerCase() === selectedGenre.toLowerCase();
        const matchesRating = !selectedRating || film.rating === parseInt(selectedRating);

        return matchesTitle && matchesGenre && matchesRating;
    });

    if (containerCard) {
        containerCard.innerHTML = ""; 

        for (let film of filteredFilms) {
            containerCard.innerHTML += `
            <div class="card" data-id="${film.id}">
                <p>${film.titolo}</p> 
                <div class="imageCard">
                    <img src="${film.copertina}" alt="${film.titolo}">
                </div>
            </div>
            `;
        }
    }
}

if (searchInput) {
    searchInput.addEventListener("input", () => aggiornaFilm());
}

if (genreSelect) {
    genreSelect.addEventListener("change", (event) => {
        selectedGenre = event.target.value;
        aggiornaFilm();
    });
}

if (ratingSelect) {
    ratingSelect.addEventListener("change", (event) => {
        selectedRating = event.target.value;
        aggiornaFilm();
    });
}

const mediaQuery = window.matchMedia('(max-width: 600px)');
if (mediaQuery.matches) {
const allHide = document.querySelectorAll(".hide")
    for (let hide of allHide) {
        hide.style.display = "none"
    }
} 
