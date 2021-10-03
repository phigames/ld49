import "phaser";
import * as C from "./constants";

export default class Gameover extends Phaser.Scene {
  constructor() {
    super("gameover");
  }

  initialize() {
    Phaser.Scene.call(this, { key: "gameover" });
  }

  preload() {
    this.load.image("background", "assets/background.png");
    this.load.image("gameover", "assets/gameover.png");
    for (const letter of Array.from(new Set(C.LETTERS))) {
      this.load.image(`letter-${letter}`, `assets/letter-${letter}.png`);
    }
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

    let endString = ["G", "A", "M", "E", "O", "V", "E", "R"];
    let nextTileX = 50;
    endString.forEach((l, i) => {
      this.add.image(nextTileX + 90 + 30 * i, 397, `letter-${l}`);
      nextTileX += 20;
    });

    this.add
      .text(320, 300, "Click spacebar to try again", {
        fontFamily: C.FONT_FAMILY,
        fontSize: "25px",
        align: "center",
        color: "black",
      })
      .setOrigin(0.5);

    this.input.keyboard.on(
      "keydown-SPACE",
      function () {
        window.location.reload();
      },
      this
    );
  }
}
