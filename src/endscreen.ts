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
    this.load.image("gameover", "assets/gameover.png");
  }

  create() {
    let background = this.add.image(
      C.SCREEN_WIDTH / 2,
      C.SCREEN_HEIGHT / 2,
      "background"
    );

    let gameover = this.add.image(0, -500, "gameover").setOrigin(0);
    this.tweens.add({
      targets: gameover,
      y: 0,
      duration: 1000,
      ease: Phaser.Math.Easing.Quintic.In,
    });
    this.time.addEvent({
      delay: 1000,
      loop: false,
      callback: () => {
        this.cameras.main.shake(
          C.EARTHQUAKE_DURATION * 1000,
          C.EARTHQUAKE_INTENSITY
        );
      },
    });

    var text = this.add.text(300, 10, "Please enter your name", {
      color: "white",
      fontSize: "20px ",
    });
  }
}
