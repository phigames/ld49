import * as C from "./constants";

export default class TextBox extends Phaser.GameObjects.Container {
  text: string;

  constructor(scene: Phaser.Scene, text: string, x: integer, y: integer) {
    super(scene, x, y);
    this.text = text;

    this.add(
      new Phaser.GameObjects.Text(this.scene, 0, 0, this.text, {
        fontFamily: C.FONT_FAMILY,
        fontSize: "32px",
        align: "left",
        color: "black",
        fontStyle: "bold",
        backgroundColor: "#d29465",
        padding: { x: 20, y: 20 },
      })
    );
  }
}
