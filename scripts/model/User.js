export class User {
  constructor(pseudo) {
    this.pseudo = pseudo;
    this.quiz = null;
  }

  setQuiz(quiz) {
    this.quiz = quiz;
  }
}
