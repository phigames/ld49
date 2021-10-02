import Tile from "./tile";

export default class Rack extends Phaser.GameObjects.Container {
  tiles: Tile[];
  letters: string[];

  constructor(scene: Phaser.Scene) {
    super(scene, 400, 500);

    this.tiles = [];
    this.letters = ["C", "L", "M", "A", "C", "H", "T", "S"];
    let next_tile_x = -146;
    for (const value of this.letters) {
      const tile = new Tile(scene, value, next_tile_x, 0);
      this.tiles.push(tile);
      this.add(tile);
      next_tile_x = next_tile_x + 36;
    }
  }
}
