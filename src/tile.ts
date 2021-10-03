export default class Tile extends Phaser.GameObjects.Image {
  letter: string;

  constructor(scene: Phaser.Scene, letter: string, x: integer, y: integer) {
    super(scene, x, y, `letter-${letter}`);
    this.letter = letter;
    this.setInteractive({useHandCursor: true});
  }
}
