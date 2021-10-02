import { Dictionary } from "./dictionary";
import Tile from "./tile";

export default class Column extends Phaser.GameObjects.Container {
  tiles: Tile[];
  dictionary: Dictionary;
  button: Phaser.GameObjects.Image | null;
  buttonAddsTile: Function | null;
  isWord: boolean;

  constructor(
    scene: Phaser.Scene,
    index: number,
    letters: string[],
    dictionary: Dictionary,
    buttonAddsTile
  ) {
    super(scene, index * 70, 20);
    this.tiles = [];
    this.isWord = false;
    this.dictionary = dictionary;
    letters.forEach((l, i) => {
      let tile = new Tile(scene, l, index * 70, i * 40);
      this.addTile(tile);
    });
    this.button = null;
    this.buttonAddsTile = buttonAddsTile;
  }

  addTile(tile: Tile) {
    this.tiles.push(tile);
    this.add(tile);
    this.checkCorrectWord();
  }

  removeTile(index: number) {
    this.remove(this.tiles[index]);
    this.tiles.splice(index, 1);
    this.checkCorrectWord();
  }

  addNewButton() {
    let button = new Phaser.GameObjects.Image(
      this.scene,
      this.x,
      this.y + 120,
      `letter-X`
    );
    this.button = button;
    this.add(button);
    this.button.setInteractive();
    this.button.on("pointerup", this.buttonAddsTile);
  }

  removeButton() {
    this.button = null;
  }

  getWordString() {
    let word = "";
    for (const tile of this.tiles) {
      word += tile.letter;
    }
    return word;
  }

  checkCorrectWord() {
    this.isWord = this.dictionary.wordInDict(this.getWordString());
  }

  onEarthquake() {
    const randomIndex = Math.floor(Math.random() * (this.tiles.length + 1));
    if (this.isWord) {
      this.removeTile(randomIndex);
    } else {
      // TODO Animation for Earthquake Tiles
      this.remove(this.tiles);
      this.tiles = [];
    }
  }
}
