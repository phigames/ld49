class Tile extends Phaser.GameObjects.Image {
  letter: string;

  constructor(scene: Phaser.Scene, letter: string) {
    super(scene, 50, 50, `letter-${letter}`);
    this.letter = letter;
  }
}
