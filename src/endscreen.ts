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
    this.load.html("nameform", "assets/nameform.html");
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

    var element = this.add.dom(300, 300).createFromCache("nameform");
    console.log(element);
    element.addListener("click");
    element.on("click", function (event) {
      var inputText = this.getChildByName("nameField");

      //  Have they entered anything?
      if (inputText.value !== "") {
        //  Turn off the click events
        this.removeListener("click");

        //  Hide the login element
        this.setVisible(false);

        //  Populate the text with whatever they typed in
        text.setText("Welcome " + inputText.value);
      } else {
        //  Flash the prompt
        this.scene.tweens.add({
          targets: text,
          alpha: 0.2,
          duration: 250,
          ease: "Power3",
          yoyo: true,
        });
      }
    });

    this.tweens.add({
      targets: element,
      y: 300,
      duration: 3000,
      ease: "Power3",
    });
  }
}
