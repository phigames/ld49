import { Dictionary } from "./dictionary";
import Tile from "./tile";
import * as C from "./constants";

export default class Column extends Phaser.GameObjects.Container {
  background: Phaser.GameObjects.Image;
  tiles: Tile[];
  dragging: boolean;
  dictionary: Dictionary;
  addButton: Phaser.GameObjects.Image;
  onAddButtonClick: Function;
  onLock: Function;
  onCountScore: Function;
  onTileClick: Function;
  isWord: boolean;
  isLocked: boolean;
  highlight: Phaser.GameObjects.Rectangle;
  highlightRect: Phaser.GameObjects.Graphics;

  constructor(
    scene: Phaser.Scene,
    index: number,
    letters: string[],
    dictionary: Dictionary,
    onAddButtonClick,
    onLock,
    onTileClick,
    onCountScore
  ) {
    super(scene, 70 + index * 100, 238);
    this.tiles = [];
    this.dragging = false;
    this.isWord = false;
    this.isLocked = false;
    this.dictionary = dictionary;

    this.background = new Phaser.GameObjects.Image(
      this.scene,
      1,
      -64,
      "column"
    );
    this.add(this.background);
    this.makeColShadowy();

    letters.forEach((l, i) => {
      let tile = new Tile(scene, l, 0, 0);
      this.addTile(tile);
    });
    this.updateLock();

    this.addButton = new Phaser.GameObjects.Image(this.scene, 0, 100, "arrow");
    this.add(this.addButton);
    this.addButton.setInteractive({ useHandCursor: true });
    this.hideAddButton();
    this.onAddButtonClick = onAddButtonClick;
    this.onTileClick = onTileClick;
    this.addButton.on("pointerup", this.onAddButtonClick);

    // Highlight on mouseover
    this.addButton.on("pointerover", () => {
      this.highlightRect = new Phaser.GameObjects.Graphics(this.scene);
      this.highlightRect.fillStyle(0xffffff, 0.3);
      this.highlightRect.fillRoundedRect(0 - 16, 100 - 24, 32, 48, 2);
      this.add(this.highlightRect);
    });
    this.addButton.on("pointerout", () => {
      this.highlightRect.destroy();
    });
    this.addButton.on("pointerup", () => {
      this.highlightRect.destroy();
    });

    this.onLock = onLock;
    this.onCountScore = onCountScore;
  }

  addTile(tile: Tile) {
    tile.removeAllListeners();
    this.unlock();
    this.tiles.push(tile);
    this.add(tile);
    this.updateTileCoords();
    this.checkCorrectWord();
    tile.on(
      "pointerup",
      () => {
        if (!this.dragging) {
          this.onTileClick(tile);
        }
        this.dragging = false;
      },
      this
    );
    this.scene.input.setDraggable(tile);
    tile.on("drag", (_, dragX: number, dragY: number) => {
      if (!this.isLocked) {
        this.dragging = true;
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
      }
    });
    tile.on("dragend", () => {
      this.updateTileCoords();
    });
  }

  removeTile(index: number) {
    this.tiles[index].destroy();
    this.tiles.splice(index, 1);
    // Auto-lock if no rackable tiles
    if (!this.tiles.some((tile) => tile.rackable)) {
      this.lock();
    }
    this.updateTileCoords();
    this.checkCorrectWord();
    if (this.tiles.length === 0) {
      this.makeColShadowy();
    }
  }

  updateTileCoords(animate: boolean = false, excludeTile?: Tile) {
    const distance = 34;
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
                  if (!that.dragging) that.updateTileCoords();
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
    if (this.tiles.length === 0) {
      this.makeColShadowy();
    }
  }

  showAddButton() {
    this.addButton.setVisible(true);
  }

  hideAddButton() {
    this.addButton.setVisible(false);
  }

  unlock() {
    console.log("unlocking");
    this.isLocked = false;
    for (const tile of this.tiles) {
      tile.unlock();
    }
  }

  lock() {
    console.log("locking");
    if (!this.isLocked) {
      this.isLocked = true;
      const n = this.countNewTiles();
      console.log(n, "new tiles");
      this.onLock(n);
      this.onCountScore(this.score());
    }
    this.lockTiles();
    this.tintLockedTiles();
  }

  updateLock() {
    console.log("updateLock");
    if (this.isWord) {
      if (this.tiles.some((tile) => tile.rackable)) {
        this.lock();
      }
    }
  }

  lockTiles() {
    for (const tile of this.tiles) {
      tile.lock();
    }
  }

  countNewTiles() {
    let i = 0;
    for (const tile of this.tiles) {
      if (tile.rackable) {
        i++;
      }
    }
    return i;
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
      this.makeColStable();
    } else {
      this.makeColUnstable();
    }
    this.updateLock();
  }

  tintLockedTiles() {
    for (let i = 0; i < this.tiles.length; i++) {
      const tile = this.tiles[i];
      if (!tile.rackable) {
        tile.setTint(0xe0e0e0);
      } else {
        tile.clearTint();
      }
    }
  }

  makeColShadowy() {
    this.background.setTexture("column");
    this.background.setTint(0xa9a9a9);
    this.background.setAlpha(0.7);
  }

  makeColStable() {
    this.background.setTexture("column");
    this.background.clearAlpha();
    this.background.clearTint();
  }

  makeColUnstable() {
    this.background.setTexture("column-crumbly");
    this.background.clearAlpha();
    this.background.clearTint();
  }

  score(): number {
    let score = 0;
    for (let tile of this.tiles) {
      score = score + C.LETTER_SCORES[tile.letter];
    }
    return score;
  }
}
