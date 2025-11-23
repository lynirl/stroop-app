export class Question {
  constructor({ colorName, colorText }) {
    this.colorName = colorName;
    this.colorText = colorText;
    this.congruency = colorName === colorText ? "congruent" : "incongruent";
  }

  isCorrect(colorAnswer) {
    return colorAnswer === this.colorName;
  }
}