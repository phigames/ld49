import "phaser";

export class Dictionary {
  wordList: Set<string>;

  constructor(wordList) {
    this.wordList = new Set(wordList);
  }

  print_words() {
    console.log(this.wordList);
  }

  wordInDict(word) {
    return this.wordList.has(word);
  }
}
