export default class Tile extends Phaser.GameObjects.Image {
  letter: string;
  rackable: boolean;

  constructor(scene: Phaser.Scene, letter: string, x: integer, y: integer) {
    super(scene, x, y, `letter-${letter}`);
    this.letter = letter;
    this.rackable = true;
    this.setInteractive({ useHandCursor: true });
  }
}
