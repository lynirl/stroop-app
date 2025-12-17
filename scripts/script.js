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
};


// récupération des query params
const urlParams = new URLSearchParams(window.location.search);
const quizType = urlParams.get("quiztype");

//données du formulaire
let participantData = JSON.parse(localStorage.getItem("participantData")) || {};
console.log("participant data:", participantData);

//creation de l'user
//en utilisant le localstorage
let formData = JSON.parse(localStorage.getItem("participantData")) || {};

const user = new User(formData);
//nettoyer pour la session suivante
localStorage.removeItem("participantData");

//creation du quiz
let quiz;

if (quizType === "1") {
  quiz = new Quiz(1);
} else {
  quiz = new Quiz(2);
}

console.log("Quiz type :", quiz.getQuizType());

//définition du pourcentage de la congruence
let congrPercent;
if(quiz.getQuizType() == 1){
  congrPercent = 80;
} else {
  congrPercent = 20;
}

user.setQuiz(quiz);
console.log("Quiz questions : ", quiz.questions);

//et du json final
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

//finir le quiz
function endQuiz() {
  // on calcule le score
  const score = quiz.getScore();
  const total = quiz.questions.length;

  //ça masque les elements du jeu
  ui.gameContainer.style.display = "none";
  ui.colorText.style.display = "none";

  //ecran de fin
  ui.finalScore.innerHTML = `Score : ${score} / ${total}`;
  ui.endScreen.style.display = "block";

  isMouseLocked = false;

  console.log(results)

  //envoyer les donnees
  savedata({
  user: {
    age: user.age,
    genre: user.genre,
    congr: congrPercent + "%",
    lateralite: user.lateralite,
    daltonisme: user.daltonisme,
    periph: user.periph
  },
  quiz: quiz.title,
  trials: results
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
    ui.colorText.innerHTML = "";
  } else {
    endQuiz();
  }
}

let isAnswerLocked = true;

//bouton demarrer
// (on initie tout)
if (ui.btnStart){
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
}
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
  let url =
    "../../savedata.php";
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
  if (isTrackingLoopRunning) return; // éviter les doublons
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

// Navigation 
function navigateTo(page) {
  let quiztype = quiz?.getQuizType() || urlParams.get('quiztype') || '1';
  window.location.href = `${page}?quiztype=${quiztype}`;
}

window.navigateTo = navigateTo;