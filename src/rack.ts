import Tile from "./tile";

export default class Rack extends Phaser.GameObjects.Container {
  tiles: Tile[];

  constructor(scene: Phaser.Scene, letters: string[]) {
    super(scene);
    this.tiles = [];
    for (const value of letters) {
      const tile = new Tile(scene, value);
      this.tiles.push(tile);
      this.add(tile);
    }
  }
}

