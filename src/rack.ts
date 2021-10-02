import Tile from "./tile";

export default class Rack extends Phaser.GameObjects.Container {
  tiles: Tile[];

  constructor(scene: Phaser.Scene, letters: string[]) {
    super(scene, 400, 500);

    this.tiles = [];
    for (const value of letters) {
      const tile = new Tile(scene, value, 0, 0);
      this.tiles.push(tile);
      this.add(tile);
    }
  }
}

