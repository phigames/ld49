import Tile from "./tile";

export default class Rack extends Phaser.GameObjects.Container {
  tiles: Tile[];
  letters: string[];
  activeLetter: number;

  constructor(scene: Phaser.Scene) {
    super(scene, 320, 400);

    this.tiles = [];
    this.letters = ["C", "L", "M", "A", "C", "H", "T", "S"];
    for (const letter of this.letters) {
      this.addTile(letter);
    }
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

  refill() {
    const nOfTiles = 8 - this.tiles.length;
    do {
      // loop body
      for (let i = 0; i < nOfTiles; i++) {
        // body
      }
    } while (condition);
  }
}
