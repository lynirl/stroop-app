
//on récupère le form et on y ajoute un eventListener
document.getElementById("user-form").addEventListener("submit", function (e) {
    //pr pas utiliser le post de base
    e.preventDefault();

    const formData = {
      nom: document.getElementById("nom").value,
      age: document.getElementById("age").value,
      genre: document.getElementById("genre").value,
      lateralite: document.getElementById("lateralite").value,
      daltonisme: document.getElementById("daltonisme").value,
      periph: document.getElementById("periph").value
    };

    //on met dans localStorage pq on peut pas le passer a main.html
    localStorage.setItem("participantData", JSON.stringify(formData));
});
