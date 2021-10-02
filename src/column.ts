import Tile from "./tile";

export default class Column extends Phaser.GameObjects.Container {
  tiles: Tile[];

  constructor(scene: Phaser.Scene, index: number, letters: string[], callback) {
    super(scene, index * 70, 20);
    this.tiles = [];
    letters.forEach((l, i) => {
      let tile = new Tile(scene, l, index * 70, i * 40)
    });
    for (let tile of this.tiles){
      this.add(tile)
    }
    this.on('pointerup', callback)
  }

  addTile(tile: Tile){
    this.tiles.push();
    this.add(tile)
  }

  removeTile(index: number){
    this.tiles.splice(index, 1)
  }
  
  addNewButton() {
    this.add(new Phaser.GameObjects.Image(this.scene, this.x , this.y + 120, `letter-X`));
  }

  removeButton() {}
}
