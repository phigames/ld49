import Tile from "./tile";

export default class Column extends Phaser.GameObjects.Container {
  letters: Tile[];

  constructor(scene: Phaser.Scene, index: number, letters: string[]) {
    super(scene, index * 70, 20);
    this.letters = [];
    letters.forEach((l, i) => {
      this.letters.push(new Tile(scene, l, index * 70, i * 40));
    });
    for (let tile of this.letters){
      this.add(tile)
    }
  }

  addNewButton() {
    this.add(new Phaser.GameObjects.Image(this.scene, this.x , this.y + 120, `letter-X`));
  }

  removeButton() {}
}
