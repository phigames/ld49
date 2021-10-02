import Tile from "./tile";

export default class Rack extends Phaser.GameObjects.Container {
  tiles: Tile[];
  letters: string[];
  activeLetter: number | null;

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
      // 4 buffer plus tile size (32) + buffer (4) for each tile
      nextTileX = nextTileX + 36;
    }
  }

  addTile(letter: string) {
    if (this.tiles.length >= 8) {
      return false;
    } else {
      const newTile = new Tile(this.scene, letter, 0, 0);
      newTile.index = this.tiles.length;
      this.tiles.push(newTile);
      this.add(newTile);
      this.updateTileCoords();

      // Add event listener
      newTile.on(
        "pointerup",
        () => {
          this.activeLetter = this.tiles.indexOf(newTile);
        },
        this
      );
      return true;
    }
  }

  removeTile(i: integer) {
    // Remove one element at index
    this.remove(this.tiles[i]);
    this.tiles[i].destroy();
    this.tiles.splice(i, 1);
    this.updateTileCoords();
    console.log("tile removed");
    this.activeLetter = null;
  }

  /*   refill() {
    const nOfTiles = 8 - this.tiles.length;
    do {
      // loop body
      for (let i = 0; i < nOfTiles; i++) {
        // body
      }
    } while (condition);
  } */
}
