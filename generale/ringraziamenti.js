"use strict";
var _a, _b;
(_a = document.querySelector("#ringraziamenti-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
    window.location.href = "home.html";
    console.log("gigi");
});
(_b = document.querySelector(".icona a")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function (event) {
    event.preventDefault(); // Impedisce il comportamento predefinito
    window.location.href = "../home.html";
    console.log("Reindirizzamento avviato.");
});
