import { Dictionary } from "./dictionary";
import * as C from "./constants";
import Tile from "./tile";

export default class Column extends Phaser.GameObjects.Container {
  tiles: Tile[];
  draggingTile: Tile | null;
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
    super(scene, index * 140, 250);
    this.tiles = [];
    this.draggingTile = null;
    this.isWord = false;
    this.dictionary = dictionary;
    letters.forEach((l, i) => {
      let tile = new Tile(scene, l, 0, 0);
      this.addTile(tile);
    });
    this.button = null;
    this.buttonAddsTile = buttonAddsTile;
  }

  addTile(tile: Tile) {
    tile.removeAllListeners();
    tile.setInteractive();
    this.tiles.push(tile);
    this.add(tile);
    this.updateTileCoords();
    this.checkCorrectWord();

    this.scene.input.setDraggable(tile);
    tile.on("dragstart", () => {
      this.draggingTile = tile;
    });
    tile.on("drag", (_: Phaser.Input.Pointer, dragX: number, dragY: number) => {
      tile.y = dragY;
      const index = this.tiles.indexOf(tile);
      for (let i = 0; i < this.tiles.length; i++) {
        if (i < index && tile.y < this.tiles[i].y + 16) {
          // Move tile up
          this.tiles.splice(index, 1);
          this.tiles.splice(i, 0, tile);
          this.updateTileCoords(true, tile);
          break;
        }
        if (i > index && tile.y > this.tiles[i].y - 16) {
          // Move tile down
          this.tiles.splice(index, 1);
          this.tiles.splice(i, 0, tile);
          this.updateTileCoords(true, tile);
          break;
        }
      }
    });
    tile.on("dragend", () => {
      this.draggingTile = null;
      this.updateTileCoords();
    });
  }

  removeTile(index: number) {
    this.remove(this.tiles[index]);
    this.tiles.splice(index, 1);
    this.updateTileCoords();
    this.checkCorrectWord();
  }

  updateTileCoords(animate: boolean = false, excludeTile?: Tile) {
    const distance = 40;
    let nextTileY = -distance * this.tiles.length;
    for (const tile of this.tiles) {
      if (tile !== excludeTile) {
        if (tile.y !== nextTileY) {
          if (animate) {
            if (!this.scene.tweens.isTweening(tile)) {
              const that = this;
              this.scene.tweens.add({
                targets: tile,
                props: { y: nextTileY },
                duration: 100,
                onComplete() {
                  if (that.draggingTile === null)
                  that.updateTileCoords();
                },
              });
            }
          } else {
            tile.y = nextTileY;
          }
        }
      }
      nextTileY += distance;
    }
  }

  addNewButton() {
    let button = new Phaser.GameObjects.Image(
      this.scene,
      0,
      this.tiles[this.tiles.length - 1].y + 40,
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
}
