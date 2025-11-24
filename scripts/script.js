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
  btnRestart: document.getElementById("btn-restart")
};

//creation de l'user
const user = new User("Lyn");

//et du quiz
const quiz = new Quiz("Stroop");
user.setQuiz(quiz);

// Chronos 
let initiationTime = 0;
let movementTime = 0;

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

    ui.colorText.dataset.target = q.colorName;
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

// Clic bouton démarrer
ui.btnStart.addEventListener("click", () => {
  showCurrentQuestion();
  ui.btnStart.style.display = "none";
  document.body.style.cursor = "none";
  isMouseLocked = false;
  initiationTime = performance.now();

});

// Clic bouton de réponse
ui.gameContainer.addEventListener("click", evt => {
  if (!evt.target.matches(".answer-button")) return;

  const clicked = evt.target.innerText.trim().toLowerCase();

  submitAnswer(clicked);
});

// Mouvement de la souris

let isMouseLocked = true;

document.addEventListener("mousemove", (event) => {
  if (!isMouseLocked) {
    registerInitiationTimer();
    isMouseLocked = true;
    registerMovementTimer();
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
  movementTime = ((performance.now() - initiationTime) / 1000).toFixed(2);
}