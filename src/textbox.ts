import * as C from "./constants";

export default class TextBox extends Phaser.GameObjects.Container {
  text: string;

  constructor(
    scene: Phaser.Scene,
    text: string,
    x: number,
    y: number,
    width?: number,
    height?: number
  ) {
    super(scene, x, y);
    this.text = text;

    this.add(new Phaser.GameObjects.Image(this.scene, 0, 0, "tutorial-box").setOrigin(0));

    this.add(
      new Phaser.GameObjects.Text(this.scene, 0, 0, this.text, {
        fontFamily: C.FONT_FAMILY,
        fontSize: "25px",
        align: "left",
        color: "black",
        fontStyle: "bold",
        padding: { x: 20, y: 20 },
        fixedWidth: width,
        fixedHeight: height,
        wordWrap: { width: width !== undefined ? width - 40 : undefined },
      })
    );
  }
}
