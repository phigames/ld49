import Tile from "./tile";

export default class Column extends Phaser.GameObjects.Container {
  letters: Tile[];

  constructor(scene: Phaser.Scene, index: number, letters: string[]) {
    super(scene, index * 70, 20);
    this.letters = [];
    for (const value of letters) {
      this.letters.push(new Tile(scene, value));
    }
  }
}
