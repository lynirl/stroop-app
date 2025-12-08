import { Question } from "./Question.js";

export class Quiz {
  constructor(type) {
    this.quizType = type;
    this.questions = this.generateQuestions(type);
    this.answers = [];
    this.currentIndex = 0;
  }

  generateQuestions(type) {
    let questions = [];
     // Type 1: 80% congruent 20% incongruent
    const Type1Quiz = [
      { colorName: "rouge", colorText: "rouge" },
      { colorName: "vert", colorText: "vert" },
      { colorName: "vert", colorText: "rouge" },
      { colorName: "vert", colorText: "rouge" },
      { colorName: "vert", colorText: "rouge" },
      { colorName: "vert", colorText: "rouge" },
      { colorName: "rouge", colorText: "vert" },
      { colorName: "rouge", colorText: "vert" },
      { colorName: "rouge", colorText: "vert" },
      { colorName: "rouge", colorText: "vert" },
      { colorName: "bleu", colorText: "bleu" },
      { colorName: "bleu", colorText: "bleu" },
      { colorName: "bleu", colorText: "bleu" },
      { colorName: "bleu", colorText: "bleu" },
      { colorName: "jaune", colorText: "jaune" },
      { colorName: "jaune", colorText: "jaune" },
      { colorName: "jaune", colorText: "jaune" },
      { colorName: "jaune", colorText: "jaune" },
      { colorName: "bleu", colorText: "jaune" },
      { colorName: "jaune", colorText: "bleu" },
    ]


    // Type 2: 80% incongruent 20% congruent
    const Type2Quiz = [
      { colorName: "bleu", colorText: "bleu" },
      { colorName: "jaune", colorText: "jaune" },
      { colorName: "bleu", colorText: "jaune" },
      { colorName: "bleu", colorText: "jaune" },
      { colorName: "bleu", colorText: "jaune" },
      { colorName: "bleu", colorText: "jaune" },
      { colorName: "jaune", colorText: "bleu" },
      { colorName: "jaune", colorText: "bleu" },
      { colorName: "jaune", colorText: "bleu" },
      { colorName: "jaune", colorText: "bleu" },
      { colorName: "rouge", colorText: "rouge" },
      { colorName: "rouge", colorText: "rouge" },
      { colorName: "rouge", colorText: "rouge" },
      { colorName: "rouge", colorText: "rouge" },
      { colorName: "vert", colorText: "vert" },
      { colorName: "vert", colorText: "vert" },
      { colorName: "vert", colorText: "vert" },
      { colorName: "vert", colorText: "vert" },
      { colorName: "rouge", colorText: "vert" },
      { colorName: "vert", colorText: "rouge" },
    ]

    if (type === 1) {
      questions.push(...Type1Quiz);
    } else {
      questions.push(...Type2Quiz);
    }

    questions = this.shuffleArray(questions);
    return questions.map((q) => new Question(q));
  }

  shuffleArray(questions) {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
  }

  addQuestion(question) {
    this.questions.push(question);
  }

  addAnswer(answer) {
    this.answers.push(answer);
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex];
  }

  goNext() {
    this.currentIndex++;
    return this.currentIndex < this.questions.length;
  }

  getScore() {
    return this.answers.filter((answer) => answer.isCorrect()).length;
  }
}
