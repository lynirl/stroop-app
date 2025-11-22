//le script

const btn = view.btnStart;
const btnMain = view.btnMain;

function cramptes(){
    view.textArea.innerHTML = "haha cramptés ^^"
}

// btn.addEventListener('click', cramptes);

function getRandint(max) {
  return Math.floor(Math.random() * max);
}

function startMain(){
    //on cache le bouton au début de l'expérience
   // btnMain.style.display = "none";

    //les couleurs
    const colors = ["red", "blue", "green", "yellow"];

    //on choisit une couleur et un texte
    const couleur = colors[getRandint(colors.length)];
    const texte = colors[getRandint(colors.length)];
    
    //et on affiche
    const colorText = document.getElementById("color-text");
    colorText.innerHTML = texte;
    colorText.style.color = couleur;
    // stocke la couleur cible pour vérification
    colorText.dataset.targetColor = couleur;
}

//vérifie si la couleur est la bonne ou non
function isRight(){

  //on normalise la chaise pour éviter les problèmes de casse
  function normalize(s) { 
    return s.trim().toLowerCase(); 
 }

  //ce qui a été cliqué
  const clicked = normalize(arguments[0]);
  
  //ce qui est attendu
  const target = normalize(document.getElementById('color-text').dataset.targetColor);

  //si c'ets correct ou pas
  const correct = clicked === target;

  //debug
  console.log('on a cliqué', clicked, ', la bonne réponse est:', target);
  return correct;
}

//on assigne la tâche au bouton start
if (btnMain){
  btnMain.addEventListener('click', (event) => {
      startMain()
      //puis il disparait pq plus besoin
      btnMain.style.display = "none";
  });
}


//faire en sorte que les boutons fonctionnent aussi
//on sélectionne le container pour les sélectionner tous
const gameContainer = document.getElementById('game-container');

if (gameContainer){
  gameContainer.addEventListener('click', (event) => {
  if (!event.target || !event.target.matches || !event.target.matches('.answer-button')){
      return;
  }
  const text = (event.target.innerText || event.target.textContent).trim();
  // on vérifie d'abord si la réponse est correcte
      isRight(text);
      // puis on passe à la vignette suivante
      startMain();
  });
}
