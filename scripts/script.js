import { User } from "./model/User.js";
import { Quiz } from "./model/Quiz.js";
import { Answer } from "./model/Answer.js";

//pour les couleurs css
const colorMap = {
  rouge: "red",
  bleu: "blue",
  jaune: "yellow",
  vert: "green",
};

const frenchColors = Object.keys(colorMap);

//avoir un element aleatoire de l'array
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

//elements de la vue
const ui = {
  colorText: document.getElementById("color-text"),
  btnStart: document.getElementById("main-button"),
  gameContainer: document.getElementById("game-container"),
  endScreen: document.getElementById("end-screen"),
  finalScore: document.getElementById("final-score"),
  btnRestart: document.getElementById("btn-restart"),
  answerButtons: document.querySelectorAll(".answer-button"),
  wrongSign: document.getElementById("wrong-sign"),
  quizCounter: document.getElementById("quiz-counter"), // Ajouter cet élément dans le HTML
};

//donnees du formulaire
let participantData = JSON.parse(localStorage.getItem("participantData")) || {};
console.log("participant data:", participantData);

//creation de l'user
let formData = JSON.parse(localStorage.getItem("participantData")) || {};
const user = new User(formData);

//gestion des quiz
const TOTAL_QUIZZES = 6;
let currentQuizNumber = 1;
//pour les resultats des quiz
let allQuizResults = [];

//fonction pour déterminer le type de quiz
function getQuizType(quizNumber) {
  //les 3 premiers quiz sont du type 1, les 3 autres du type 2
  return quizNumber <= 3 ? 1 : 2;
}

//creation du premier quiz
let quiz = new Quiz(getQuizType(currentQuizNumber));
user.setQuiz(quiz);
console.log("Quiz questions : ", quiz.questions);

//résultats du quiz actuel
let results = [];

// Chronos
let initiationStart = 0;
let movementStart = 0;
let initiationTime = 0;
let movementTime = 0;
let hasMoved = false;

//Réponses infos
let rightAnswerValue = "";

//afficher une question
function showCurrentQuestion() {
  // Afficher le texte au bout de 300ms
  setTimeout(() => {
    const q = quiz.getCurrentQuestion();

    ui.colorText.innerHTML = q.colorText.toUpperCase();
    ui.colorText.style.color = colorMap[q.colorName];
    rightAnswerValue = q.colorName;

    ui.colorText.dataset.target = q.colorName;
    document.body.style.cursor = "default";
  }, 300);
}

//passer au quiz suivant
function nextQuiz() {
  //on stocke les résultats du quiz actuel
  allQuizResults.push({
    quizNumber: currentQuizNumber,
    quizTitle: quiz.title,
    quizType: getQuizType(currentQuizNumber),
    score: quiz.getScore(),
    total: quiz.questions.length,
    trials: results
  });

  currentQuizNumber++;

  if (currentQuizNumber <= TOTAL_QUIZZES) {
    //et on crée le prochain avec le bon type
    quiz = new Quiz(getQuizType(currentQuizNumber));
    user.setQuiz(quiz);
    results = []; // Reset pour le prochain quiz
    console.log("Quiz questions : ", quiz.questions);

    // Vider le texte et afficher le bouton
    ui.colorText.innerHTML = "";
    ui.btnStart.style.display = "block";
    ui.btnStart.innerHTML = `Quiz suivant (${currentQuizNumber}/${TOTAL_QUIZZES})`;
    
    updateQuizCounter();
    isMouseLocked = true;
    isAnswerLocked = true;
  } else {
    // Tous les quiz sont terminés
    endAllQuizzes();
  }
}

//finir UN quiz (passer au suivant)
function endQuiz() {
  const score = quiz.getScore();
  const total = quiz.questions.length;

  console.log(`Quiz ${currentQuizNumber} terminé: ${score}/${total}`);

  // Passer au quiz suivant au lieu de tout terminer
  nextQuiz();
}

//finir TOUS les quiz (à la fin du 6ème)
function endAllQuizzes() {
  // Calculer le score total
  let totalScore = 0;
  let totalQuestions = 0;
  
  allQuizResults.forEach(qr => {
    totalScore += qr.score;
    totalQuestions += qr.total;
  });

  //ça masque les elements du jeu
  ui.gameContainer.style.display = "none";
  ui.colorText.style.display = "none";

  //ecran de fin
  ui.finalScore.innerHTML = `
    <h2>Expérience terminée !</h2>
    <p>Score total : ${totalScore} / ${totalQuestions}</p>
    <p>6 quiz complétés</p>
  `;
  ui.endScreen.style.display = "block";

  isMouseLocked = false;

  //clean le localstorage
  localStorage.removeItem("participantData");

  //envoyer TOUTES les donnees des 6 quiz
  savedata({
    user: {
      age: user.age,
      genre: user.genre,
      lateralite: user.lateralite,
      daltonisme: user.daltonisme,
      periph: user.periph
    },
    totalQuizzes: TOTAL_QUIZZES,
    allResults: allQuizResults
  });
}

//enregistrer la reponse
function submitAnswer(colorClickedFR) {
  endTimer();
  isTracking = false;

  console.log(coordSamples);
  console.log("Mouvement time :", movementTime);

  if (initiationTime > 0.5) {
    document.getElementById("warning-message").style.display = "block";
  }

  const q = quiz.getCurrentQuestion();

  const ans = new Answer({
    question: q,
    colorAnswer: colorClickedFR,
    initiation: initiationTime,
    movement: movementTime,
    area: 0,
  });

  quiz.addAnswer(ans);

  //stocker dans json a la fin de la question
  results.push({
    questionText: q.colorText,
    inkColor: q.colorName,
    answer: colorClickedFR,
    correct: ans.isCorrect(),
    congruency: q.congruency,
    initiationTime: initiationTime,
    movementTime: movementTime,
    timestamp: Date.now(),
    coordinates: coordSamples,
  });

  //pour debug
  console.log("Bonne réponse ?", ans.isCorrect());

  //passer à la suite (ou non)
  if (quiz.goNext()) {
    ui.btnStart.style.display = "block";
    ui.btnStart.innerHTML = "Continuer";
    ui.colorText.innerHTML = "";
  } else {
    endQuiz();
  }
}

let isAnswerLocked = true;

//bouton demarrer
// (on initie tout)
ui.btnStart.addEventListener("click", () => {
  showCurrentQuestion();
  document.getElementById("warning-message").style.display = "none";
  ui.btnStart.style.display = "none";
  document.body.style.cursor = "none";
  isMouseLocked = false;
  isAnswerLocked = false;
  initiationStart = performance.now();
  movementStart = 0;
  initiationTime = 0;
  movementTime = 0;
  hasMoved = false;
  coordSamples = [];
  isTracking = true;
});

//bouton de reponse
for (let answerButton of ui.answerButtons) {
  answerButton.addEventListener("click", (evt) => {
    const clicked = evt.target.innerText.trim().toLowerCase();
    if (clicked !== rightAnswerValue) {
      if (isAnswerLocked) return;
      ui.wrongSign.style.display = "block";
      ui.btnStart.style.display = "none";
      setTimeout(() => {
        ui.wrongSign.style.display = "none";
        isAnswerLocked = true;
        submitAnswer(clicked);
      }, 2000);
    } else {
      submitAnswer(clicked);
    }
  });
}

//enregistrer IT
let isMouseLocked = true;

let lastMouseX = 0;
let lastMouseY = 0;

document.addEventListener("mousemove", (event) => {
  if (!hasMoved) {
    trackingMouse();

    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    hasMoved = true;

    initiationTime = ((performance.now() - initiationStart) / 1000).toFixed(3);
    movementStart = performance.now();

    console.log("Initiation time :", initiationTime);
  }
});

//enregistrer MT
function endTimer() {
  if (movementStart > 0) {
    movementTime = ((performance.now() - movementStart) / 1000).toFixed(3);
  } else {
    movementTime = null;
  }

  console.log("Movement time :", movementTime);
}

//sauvegarder les données
function savedata(data) {
  let xhr = new XMLHttpRequest();
  let url = "../../savedata.php";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  console.log(">>>>>>>> ENVOI JSON", JSON.stringify(data));
  xhr.send(JSON.stringify(data));
}

//coordonnees des clics
let isTracking = false;
let coordSamples = [];
let isTrackingLoopRunning = false;

function trackingMouse() {
  if (isTrackingLoopRunning) return;
  isTrackingLoopRunning = true;

  const targetDelta = 1000 / 70;
  let last = performance.now();

  function loop() {
    const now = performance.now();
    const delta = now - last;

    if (delta >= targetDelta) {
      last = now - (delta % targetDelta);

      if (isTracking) {
        coordSamples.push({
          t: now,
          x: lastMouseX,
          y: lastMouseY,
        });
      }
    }

    requestAnimationFrame(loop);
  }
  loop();
}

//au demarrage, compteur
updateQuizCounter();

window.navigateTo = navigateTo;