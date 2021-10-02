import { Dictionary } from "./dictionary";
import Tile from "./tile";

export default class Column extends Phaser.GameObjects.Container {
  tiles: Tile[];
  dictionary: Dictionary;

  constructor(
    scene: Phaser.Scene,
    index: number,
    letters: string[],
    dictionary: Dictionary,
    callback
  ) {
    super(scene, index * 70, 20);
    this.tiles = [];
    this.dictionary = dictionary;
    letters.forEach((l, i) => {
      this.tiles.push(new Tile(scene, l, index * 70, i * 40));
    });
    for (let tile of this.tiles) {
      this.add(tile);
    }
    this.on("pointerup", callback);
  }

  addNewButton() {
    this.add(
      new Phaser.GameObjects.Image(this.scene, this.x, this.y + 120, `letter-X`)
    );
  }

  removeButton() {}

  getWordString() {
    let word = "";
    for (const tile of this.tiles) {
      word += tile.letter;
    }
    return word;
  }

  isCorrectWord() {
    return this.dictionary.wordInDict(this.getWordString());
  }
}
