import "phaser";
import * as C from "./constants";

export default class Endscreen extends Phaser.Scene {
  score: number;
  scoreText: Phaser.GameObjects.Text;

  constructor() {
    super("endscreen");
  }

  init(data) {
    this.score = data.score;
  }

  initialize() {
    Phaser.Scene.call(this, { key: "endscreen" });
  }

  preload() {
    this.load.image("background", "assets/background.png");
  }

  create() {
    let background = this.add.image(
      C.SCREEN_WIDTH / 2,
      C.SCREEN_HEIGHT / 2,
      "background"
    );

    const scoreText = this.add
      .text(320, 250, "Game Over \n Your score: " + this.score, {
        fontFamily: C.FONT_FAMILY,
        fontSize: "16px",
        align: "center",
        color: "black",
        fontStyle: "bold",
        backgroundColor: "white",
      })
      .setOrigin(0.5);
  }
}
