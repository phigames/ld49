import Tile from "./tile";
import * as C from "./constants";

export default class Rack extends Phaser.GameObjects.Container {
  tiles: Tile[];
  activeTileIndex: number | null;
  updateColumnButtons: Function;
  highlightRect2: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, updateColumnButtons: Function) {
    super(scene, 321, 397);

    this.tiles = [];
    this.activeTileIndex = null;
    this.updateColumnButtons = updateColumnButtons;
  }

  updateTileCoords() {
    let nextTileX = -180;
    for (let tile of this.tiles) {
      tile.x = nextTileX;
      nextTileX = nextTileX + 50;
    }
  }

  addTile(letter: string) {
    if (this.tiles.length >= 8) {
      return false;
    } else {
      const newTile = new Tile(this.scene, letter, 0, 0);
      this.tiles.push(newTile);
      this.add(newTile);
      this.updateTileCoords();

      // Add event listener
      newTile.on(
        "pointerup",
        () => {
          this.activeTileIndex = this.tiles.indexOf(newTile);
          // this.tintActiveTile();
          this.updateColumnButtons();

          if (this.highlightRect2) {
            this.highlightRect2.destroy();
          }
          this.highlightRect2 = new Phaser.GameObjects.Graphics(this.scene);
          this.highlightRect2.fillStyle(0xffffff, 0.3);
          this.highlightRect2.fillRoundedRect(
            newTile.x - 16,
            newTile.y - 16,
            32,
            32,
            3
          );
          this.add(this.highlightRect2);
        },
        this
      );
      return true;
    }
  }

  removeTile(i: integer) {
    // Remove one element at index
    this.tiles[i].destroy();
    this.tiles.splice(i, 1);
    this.updateTileCoords();
    this.resetActiveTile();
    this.updateColumnButtons();
    if (this.highlightRect2) {
      this.highlightRect2.destroy();
    }
  }

  resetActiveTile() {
    this.activeTileIndex = null;
    // this.tintActiveTile();
  }

  // tintActiveTile() {
  //   for (let i = 0; i < this.tiles.length; i++) {
  //     const tile = this.tiles[i];
  //     if (i === this.activeTileIndex) {
  //       tile.setTint(0x888888);
  //     } else {
  //       tile.setTint(0xffffff);
  //     }
  //   }
  // }

  fill(tilesToFill: integer) {
    // Fill rack with random letter tiles, ensuring at least one vowel
    const nOfTiles = Math.min(8 - this.tiles.length, tilesToFill);

    for (let i = 0; i < nOfTiles; i++) {
      const randomIndex = Math.floor(Math.random() * C.LETTERS.length);
      const randomLetter = C.LETTERS[randomIndex];
      this.addTile(randomLetter);
    }

    while (!this.vowelInTiles()) {
      // Remove the elements we just added
      for (let i = this.tiles.length - nOfTiles; i < 8; i++) {
        this.removeTile(this.tiles.length - 1);
      }
      // Call fill again
      this.fill(nOfTiles);
    }
  }

  vowelInTiles() {
    // Returns true if tiles contain any vowel, false otherwise
    const vowels = "AEIOU";
    let vowelInTiles = false;
    for (let tile of this.tiles) {
      // If letter is in vowel string
      if (vowels.indexOf(tile.letter) != -1) {
        vowelInTiles = true;
      }
    }
    console.log("Vowel in tiles: " + vowelInTiles);
    return vowelInTiles;
  }
}
