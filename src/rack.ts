import Tile from "./tile";
import * as C from "./constants";

export default class Rack extends Phaser.GameObjects.Container {
  tiles: Tile[];
  letters: string[];
  activeLetter: number;

  constructor(scene: Phaser.Scene) {
    super(scene, 320, 400);

    this.tiles = [];
    this.fill();
  }

  updateTileCoords() {
    let nextTileX = -142;
    for (let tile of this.tiles) {
      tile.x = nextTileX;
      nextTileX = nextTileX + 36;
    }
  }

  addTile(letter: string) {
    if (this.tiles.length >= 8) {
      return false;
    } else {
      // 4 buffer plus tile size (32) + buffer (4) for each tile
      let newTileX = 4 + this.tiles.length * (32 + 4);
      const newTile = new Tile(this.scene, letter, newTileX, 0);
      newTile.index = this.tiles.length;
      this.tiles.push(newTile);
      this.add(newTile);

      // Add event listener
      newTile.on(
        "pointerup",
        () => {
          this.activeLetter = newTile.index;
        },
        this
      );
      this.updateTileCoords();
      return true;
    }
  }

  removeTile(i: integer) {
    // Remove one element at index
    this.remove(this.tiles[i]);
    this.tiles[i].destroy();
    this.tiles.splice(i, 1);
    this.updateTileCoords();
  }

  fill() {
    // Fill rack with random letter tiles, ensuring at least one vowel
    const nOfTiles = 8 - this.tiles.length;

    for (let i = 0; i < nOfTiles; i++) {
      const randomIndex = Math.floor(Math.random() * C.LETTERS.length);
      const randomLetter = C.LETTERS[randomIndex];
      this.addTile(randomLetter);
    }

    while (!this.vowelInTiles()) {
      // Remove the elements we just added
      for (let i = 7; i > nOfTiles - 1; i--) {
        this.removeTile(i);
      }
      // Call fill again
      this.fill();
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
