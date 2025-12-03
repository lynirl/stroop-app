import { User } from "./model/User.js";
import { Quiz } from "./model/Quiz.js";
import { Question } from "./model/Question.js";
import { Answer } from "./model/Answer.js";

//pour les couleurs css
const colorMap = {
  rouge: "red",
  bleu: "blue",
  jaune: "yellow",
  vert: "green"
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
  wrongSign: document.getElementById("wrong-sign")
};

//creation de l'user
const user = new User("Lyn");

//et du quiz
const quiz = new Quiz("Stroop");
user.setQuiz(quiz);

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

//generer les 20 questions (aleatoires pr le moment, pas de congruence 80% tout ça)
for (let i = 0; i < 20; i++) {
  const colorName = getRandom(frenchColors);
  const colorText = getRandom(frenchColors);

  const q = new Question({ colorName, colorText });
  quiz.addQuestion(q);
}

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
  
  savedata({
    user: user.pseudo,
    quiz: quiz.quizType,
    trials: results
  });
}


//enregistrer la réponse
function submitAnswer(colorClickedFR) {

  endTimer();
  console.log("Mouvement time :", movementTime);

  const q = quiz.getCurrentQuestion();

  const ans = new Answer({
    question: q,
    colorAnswer: colorClickedFR,
    initiation: initiationTime,
    movement: movementTime,
    area: 0
  });

  quiz.addAnswer(ans);

  //stocker dans json
  results.push({
    questionText: q.colorText,
    inkColor: q.colorName,
    answer: colorClickedFR,
    correct: ans.isCorrect(),
    initiationTime: initiationTime,
    movementTime: movementTime,
    timestamp: Date.now()
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

// GESTION DES EVENTS
//

// En cas d'erreur, pour bloquer pendant l'affichage du signe "X"
let isAnswerLocked = false;

// Clic bouton démarrer
ui.btnStart.addEventListener("click", () => {
  showCurrentQuestion();
  ui.btnStart.style.display = "none";
  document.body.style.cursor = "none";
  isMouseLocked = false;
  isAnswerLocked = false;
  initiationStart = performance.now();
  movementStart = 0;
  initiationTime = 0;
  movementTime = 0;
  hasMoved = false;
});

// Clic bouton de réponse

for (let answerButton of ui.answerButtons) {
  answerButton.addEventListener("click", evt => {
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

// Mouvement de la souris

let isMouseLocked = true;

document.addEventListener("mousemove", () => {
  if (!hasMoved) {
    hasMoved = true;

    initiationTime = ((performance.now() - initiationStart) / 1000).toFixed(3);
    movementStart = performance.now();

    console.log("Initiation time :", initiationTime);
  }
});


// Enregistrement

function registerInitiationTimer() {
  initiationTime = ((performance.now() - initiationTime) / 1000).toFixed(2);
  console.log("Initiation time :", initiationTime);
}

function registerMovementTimer() {
  movementTime = performance.now();
}

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
    let url = "https://corsproxy.io/?url=https://rafael.laboissiere.net/m1-miashs-2025-s7/Xo7Yei8e/savedata.php"
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    console.log(">>>>>>>> ENVOI JSON", JSON.stringify(data));
    xhr.send(JSON.stringify(data));
}
