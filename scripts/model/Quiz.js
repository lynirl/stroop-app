export class Quiz {
  constructor(type) {
    this.quizType = type;
    this.questions = [];
    this.answers = [];
    this.currentIndex = 0;
  }

  addQuestion(q) {
    this.questions.push(q);
  }

  addAnswer(ans) {
    this.answers.push(ans);
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex];
  }

  goNext() {
    this.currentIndex++;
    return this.currentIndex < this.questions.length;
  }

  getScore() {
    return this.answers.filter(a => a.isCorrect()).length;
  }
}