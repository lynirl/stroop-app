export class Answer {
  constructor({ question, colorAnswer, initiation, movement, area, coordSamples }) {
    this.question = question;
    this.colorAnswer = colorAnswer;
    this.initiationTime = initiation;
    this.movementTime = movement;
    this.area = area;
    this.coordonnates = coordSamples;
  }

  isCorrect() {
    return this.question.isCorrect(this.colorAnswer);
  }
}