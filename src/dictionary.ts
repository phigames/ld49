import "phaser";

export class Dictionary {
  wordList: string[];

  constructor(wordList) {
    this.wordList = wordList;
  }

  print_words() {
    console.log(this.wordList);
  }
}
