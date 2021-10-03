import { Dictionary } from "./dictionary";
import Tile from "./tile";

export default class Column extends Phaser.GameObjects.Container {
  background: Phaser.GameObjects.Image;
  tiles: Tile[];
  draggingTile: Tile | null;
  dictionary: Dictionary;
  button: Phaser.GameObjects.Image;
  lockButton: Phaser.GameObjects.Image;
  buttonAddsTile: Function;
  isWord: boolean;

  constructor(
    scene: Phaser.Scene,
    index: number,
    letters: string[],
    dictionary: Dictionary,
    buttonAddsTile
  ) {
    super(scene, 70 + index * 100, 239);
    this.tiles = [];
    this.draggingTile = null;
    this.isWord = false;
    this.dictionary = dictionary;

    this.background = new Phaser.GameObjects.Image(
      this.scene,
      0,
      -65,
      "column-crumbly"
    );
    this.add(this.background);

    this.lockButton = new Phaser.GameObjects.Image(
      this.scene,
      30,
      70,
      "letter-C"
    );
    this.add(this.lockButton);
    this.lockButton.setInteractive({ useHandCursor: true });
    this.lockButton.on("pointerup", () => {});

    letters.forEach((l, i) => {
      let tile = new Tile(scene, l, 0, 0);
      this.addTile(tile);
    });

    this.button = new Phaser.GameObjects.Image(this.scene, 0, 100, "letter-X");
    this.add(this.button);
    this.button.setInteractive({ useHandCursor: true });
    this.hideButton();
    this.buttonAddsTile = buttonAddsTile;
    this.button.on("pointerup", this.buttonAddsTile);
  }

  addTile(tile: Tile) {
    tile.removeAllListeners();
    this.tiles.push(tile);
    this.add(tile);
    this.updateTileCoords();
    this.checkCorrectWord();

    this.scene.input.setDraggable(tile);
    tile.on("dragstart", () => {
      this.draggingTile = tile;
    });
    tile.on("drag", (_, dragX: number, dragY: number) => {
      tile.y = dragY;
      const index = this.tiles.indexOf(tile);
      for (let i = 0; i < this.tiles.length; i++) {
        if (i < index && tile.y < this.tiles[i].y + 16) {
          // Move tile up
          this.tiles.splice(index, 1);
          this.tiles.splice(i, 0, tile);
          this.updateTileCoords(true, tile);
          this.checkCorrectWord();
          break;
        }
        if (i > index && tile.y > this.tiles[i].y - 16) {
          // Move tile down
          this.tiles.splice(index, 1);
          this.tiles.splice(i, 0, tile);
          this.updateTileCoords(true, tile);
          this.checkCorrectWord();
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
    const distance = 35;
    let nextTileY = 86 - distance * this.tiles.length;
    for (const tile of this.tiles) {
      if (tile !== excludeTile) {
        tile.x = 0;
        if (tile.y !== nextTileY) {
          if (animate) {
            if (!this.scene.tweens.isTweening(tile)) {
              const that = this;
              this.scene.tweens.add({
                targets: tile,
                props: { y: nextTileY },
                duration: 100,
                onComplete() {
                  if (that.draggingTile === null) that.updateTileCoords();
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

  showButton() {
    this.button.setVisible(true);
  }

  hideButton() {
    this.button.setVisible(false);
  }

  updateLockButton() {
    if (this.isWord) {
      this.lockButton.setVisible(true);
    } else {
      this.lockButton.setVisible(false);
    }
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
    if (this.isWord) {
      this.background.setTexture("column");
    } else {
      this.background.setTexture("column-crumbly");
    }
    this.updateLockButton();
  }
}
