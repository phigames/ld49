import { Dictionary } from "./dictionary";
import * as C from "./constants";
import Tile from "./tile";

export default class Column extends Phaser.GameObjects.Container {
  tiles: Tile[];
  draggingTile: Tile | null;
  dragStartX: number;
  dragStartY: number;
  dictionary: Dictionary;
  isWord: boolean;

  constructor(
    scene: Phaser.Scene,
    index: number,
    letters: string[],
    dictionary: Dictionary,
    callback
  ) {
    super(scene, index * 70, 20);
    this.tiles = [];
    this.draggingTile = null;
    this.isWord = false
    this.dictionary = dictionary;
    letters.forEach((l, i) => {
      let tile = new Tile(scene, l, index * 70, i * 40);
      this.addTile(tile);
    });

    this.on("pointerup", callback);
  }

  addTile(tile: Tile) {
    tile.removeAllListeners();
    tile.setInteractive();
    this.scene.input.setDraggable(tile);
    tile.on("dragstart", (pointer: Phaser.Input.Pointer) => {
      this.draggingTile = tile;
    });
    tile.on(
      "drag",
      (pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
        tile.x = dragX;
        tile.y = dragY;
      }
    );
    tile.on("dragend", (pointer: Phaser.Input.Pointer) => {
      this.draggingTile = null;
    });
    this.tiles.push(tile);
    this.add(tile)
    this.checkCorrectWord()
  }

  removeTile(index: number){
    this.remove(this.tiles[index])
    this.tiles.splice(index, 1)
    this.checkCorrectWord()
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

  checkCorrectWord() {
    this.isWord = this.dictionary.wordInDict(this.getWordString());
  }

  onEarthquake() {
    const randomIndex = Math.floor(Math.random() * (this.tiles.length + 1))
    if (this.isWord) {
      this.removeTile(randomIndex)
    } else {
      // TODO Animation for Earthquake Tiles
      this.remove(this.tiles)
      this.tiles = []
    }

  }
}
