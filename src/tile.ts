export default class Tile extends Phaser.GameObjects.Image {
  letter: string;
  rackable: boolean;

  constructor(scene: Phaser.Scene, letter: string, x: integer, y: integer) {
    super(scene, x, y, `letter-${letter}`);
    this.letter = letter;
    this.rackable = true;
    this.unlock();
  }

  lock() {
    this.rackable = false;
    this.scene.input.disable(this);
  }

  unlock() {
    this.setInteractive({ useHandCursor: true });
  }
}
