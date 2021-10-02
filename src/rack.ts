import Tile from "./tile";

export default class Rack extends Phaser.GameObjects.Container {
  tiles: Tile[];
  letters: string[];

  constructor(scene: Phaser.Scene) {
    super(scene, 320, 400);

    this.tiles = [];
    this.letters = ["C", "L", "M", "A", "C", "H", "T", "S"];
    let nextTileX = -142;
    for (const value of this.letters) {
      const tile = new Tile(scene, value, nextTileX, 0);
      this.tiles.push(tile);
      this.add(tile);
      nextTileX = nextTileX + 36;
    }
  }

  addTile(letter: string) {
    if (this.letters.length >= 8) {
      return false;
    } else {
      // 4 buffer plus tile size (32) + buffer (4) for each tile
      let newTileX = 4 + this.letters.length * (32 + 4);
      const newTile = new Tile(this.scene, letter, newTileX, 0);
      this.tiles.push(newTile);
      this.add(newTile);
      return true
    }
  }

  removeTile(i: integer) {
    // Remove one element at index
    this.tiles.splice(i, 1)
    this.remove(this.tiles[i])
  }
}
