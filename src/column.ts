class Column extends Phaser.GameObjects.Container {
  letters: Tile[];

  constructor(scene: Phaser.Scene, letters: string[]) {
    super(scene);
    for (const value of letters) {
      this.letters.push(new Tile(scene, value));
    }
  }
}
