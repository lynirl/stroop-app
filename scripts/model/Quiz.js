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

    const congruent = [
      { colorName: "rouge", colorText: "rouge" },
      { colorName: "vert", colorText: "vert" },
      { colorName: "bleu", colorText: "bleu" },
      { colorName: "jaune", colorText: "jaune" },
    ];

    const incongruent = [
      { colorName: "vert", colorText: "rouge" },
      { colorName: "rouge", colorText: "vert" },
      { colorName: "bleu", colorText: "jaune" },
      { colorName: "jaune", colorText: "bleu" },
    ];

    // Type 1: 80% congruent 20% incongruent
    if (type === 1) {
      for (let i = 0; i < 16; i++) {
        questions.push(congruent[Math.floor(Math.random() * congruent.length)]);
      }
      questions.push(...incongruent);

    // Type 2: 20% congruent 80% incongruent
    } else {
      questions.push(...congruent);
      for (let i = 0; i < 16; i++) {
        questions.push(
          incongruent[Math.floor(Math.random() * incongruent.length)]
        );
      }
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
