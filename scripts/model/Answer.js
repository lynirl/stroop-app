export class Answer {
  constructor({ question, colorAnswer, initiation, movement, area }) {
    this.question = question;
    this.colorAnswer = colorAnswer;
    this.initiationTime = initiation;
    this.movementTime = movement;
    this.area = area;
  }

  isCorrect() {
    return this.question.isCorrect(this.colorAnswer);
  }
}