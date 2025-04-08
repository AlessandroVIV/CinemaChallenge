
document.querySelector("#ringraziamenti-button")?.addEventListener("click", function () {
    window.location.href = "home.html";
    console.log("gigi")
});

document.querySelector(".icona a")?.addEventListener("click", function (event) {
    event.preventDefault(); // Impedisce il comportamento predefinito
    window.location.href = "../home.html";
    console.log("Reindirizzamento avviato.");
});