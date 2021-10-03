import "phaser";
import Column from "./column";
import * as C from "./constants";
import { Dictionary } from "./dictionary";
import { getLeaderboard, postScore } from "./leaderboard";
import Rack from "./rack";
import TextBox from "./textbox";
import Tile from "./tile";
import Gameover from "./gameover";

export default class Game extends Phaser.Scene {
  rack: Rack;
  columns: Column[];
  clock: Phaser.GameObjects.Text;
  clockTime: number;
  clockState: "none" | "running" | "delay";
  timer: Phaser.Time.TimerEvent;
  levelDisplay: Phaser.GameObjects.Text;
  level: number;
  dictionary: Dictionary;
  score: number;
  scoreText: Phaser.GameObjects.Text;
  tutorial: TextBox;

  constructor() {
    super("game");
  }

  preload() {
    for (const letter of Array.from(new Set(C.LETTERS))) {
      this.load.image(`letter-${letter}`, `assets/letter-${letter}.png`);
    }
    this.load.image("background", "assets/background.png");
    this.load.image("column", "assets/column.png");
    this.load.image("column-crumbly", "assets/column-crumbly.png");
    this.load.image("arrow", "assets/arrow.png");
    this.load.image("ok1", "assets/ok1.png");
    this.load.image("ok2", "assets/ok2.png");
    this.load.json("wordList", "assets/words.json");
    this.load.html("nameform", "assets/nameform.html");
  }

  create() {
    getLeaderboard().then((data) => console.log(data));
    this.add.image(C.SCREEN_WIDTH / 2, C.SCREEN_HEIGHT / 2, "background");
    const data = this.cache.json.get("wordList");
    this.dictionary = new Dictionary(data);

    this.columns = [];
    for (let i = 0; i < 6; i++) {
      this.addColumn(i);
    }

    this.rack = new Rack(this, () => {
      for (const column of this.columns) {
        if (this.rack !== undefined && this.rack.activeTileIndex !== null) {
          column.showAddButton();
        } else {
          column.hideAddButton();
        }
      }
    });
    this.rack.fill(8);
    this.add.existing(this.rack);
    this.score = 0;
    this.scoreText = this.add
      .text(C.SCREEN_WIDTH / 2 + 18, C.SCREEN_HEIGHT - 33, "", {
        fontFamily: C.FONT_FAMILY,
        fontSize: "25px",
        align: "center",
        color: "black",
      })
      .setOrigin(0.5);
    this.updateScoreText();

    this.clockTime = C.TIME_PER_LEVEL;
    this.clock = this.add
      .text(50, 380, "", {
        fontFamily: C.FONT_FAMILY,
        fontSize: "30px",
        align: "center",
        color: "black",
      })
      .setOrigin(0.5);
    this.add
      .text(50, 404, "sec until", {
        fontFamily: C.FONT_FAMILY,
        fontSize: "16px",
        align: "center",
        color: "black",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.add
      .text(50, 420, "earthquake", {
        fontFamily: C.FONT_FAMILY,
        fontSize: "16px",
        align: "center",
        color: "black",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.level = 0;
    this.levelDisplay = this.add
      .text(590, 380, "", {
        fontFamily: C.FONT_FAMILY,
        fontSize: "30px",
        align: "center",
        color: "black",
      })
      .setOrigin(0.5);
    this.add
      .text(590, 410, "earthquakes", {
        fontFamily: C.FONT_FAMILY,
        fontSize: "16px",
        align: "center",
        color: "black",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.updateLevelDisplay();

    this.clockState = "none";

    const messages = [
      "Make words in the pillars to prevent the temple from collapsing!\n\n" +
        "Earthquakes will delete letters and make pillars unstable! " +
        "Fix them fast before they collapse in the next quake.",
    ];
    let message = "";
    for (const elem of messages) {
      message = message + elem;
    }

    this.tutorial = new TextBox(this, message, 35, 20, 370, 344);
    this.add.existing(this.tutorial);

    // // Test functions for removing/adding rack tiles (hehe)
    // this.input.keyboard.on(
    //   "keydown-R",
    //   function () {
    //     this.rack.removeTile(0);
    //   },
    //   this
    // );
    // this.input.keyboard.on(
    //   "keydown-F",
    //   function () {
    //     console.log(this.rack.addTile("F"));
    //   },
    //   this
    // );
    // this.input.keyboard.on(
    //   "keydown-A",
    //   function () {
    //     this.rack.fill(8);
    //   },
    //   this
    // );
    // this.input.keyboard.on(
    //   "keydown-C",
    //   function () {
    //     this.moveTileToRack(this.columns[0], 0);
    //   },
    //   this
    // );

    // this.input.keyboard.on(
    //   "keydown-X",
    //   function () {
    //     console.log("gameover started");
    //     this.scene.start("gameover");
    //   },
    //   this
    // );
  }

  update() {
    if (this.clockState === "none") {
      if (
        this.columns.some(
          (column) => column.isLocked === true && column.tiles.length > 0
        )
      ) {
        this.clockState = "running";
        this.tutorial.destroy();
      }
    }

    // clock
    if (this.clockState == "running") {
      this.timer = this.time.addEvent({
        delay: 1000,
        callback: this.onClockTick,
        callbackScope: this,
        loop: true,
      });
      this.clockState = "delay";
      this.updateClock();
    }
  }

  onClockTick() {
    this.clockTime -= 1; // One second
    if (this.clockTime == 0) {
      this.cameras.main.shake(
        C.EARTHQUAKE_DURATION * 1000,
        C.EARTHQUAKE_INTENSITY
      );
      for (let i = 0; i < this.columns.length; i++) {
        const column = this.columns[i];
        column.hideAddButton();
        this.rack.resetActiveTile();
        const randomIndex = Math.floor(Math.random() * column.tiles.length);
        if (column.isWord) {
          column.removeTile(randomIndex);
          column.unlock();
        } else {
          // TODO Animation for Earthquake Tiles
          for (const tile of column.tiles) {
            tile.destroy();
          }
          this.columns.splice(i, 1);
          this.addColumn(i);
          column.destroy(true);
        }
        // Losing condition
        if (!this.columns.some((column) => column.tiles.length > 0)) {
          this.lose();
        }
      }
      this.rack.fill(8);
      this.level++;
      // Winning condition
      if (
        this.level >= C.NUMBER_OF_LEVELS &&
        this.columns.some((column) => column.tiles.length > 0)
      ) {
        this.win();
      }
      this.updateLevelDisplay();
    } else if (this.clockTime <= -C.PAUSE_AFTER_EARTHQUAKE) {
      this.clockTime = C.TIME_PER_LEVEL;
    }
    this.updateClock();
  }

  updateClock() {
    this.clock.setText(this.clockTime > 0 ? this.clockTime.toString() : "");
  }

  updateLevelDisplay() {
    this.levelDisplay.setText(` ${this.level}    ${C.NUMBER_OF_LEVELS}`);
  }

  updateScoreText() {
    this.scoreText.setText(`Score: ${this.score}`);
  }

  addColumn(i: number) {
    const column = new Column(
      this,
      i,
      [],
      this.dictionary,
      () => this.addRackTileToColumn(i),
      //TODO provide fill function
      (numRackableTiles) => this.rack.fill(numRackableTiles),
      (tile) => this.moveTileToRack(column, tile),
      (score) => {
        this.score += score;
        this.updateScoreText();
        const scoreAnimation = this.add.text(
          column.x,
          column.y + column.tiles[0].y - 20,
          `+${score}`,
          {
            fontFamily: C.FONT_FAMILY,
            fontSize: "20px",
            fontStyle: "bold",
            color: "#d29465",
          }
        );
        this.tweens.add({
          targets: scoreAnimation,
          props: { y: scoreAnimation.y - 50, opacity: 0 },
          duration: 700,
          onComplete: () => {
            scoreAnimation.destroy();
          },
        });
      }
    );
    this.columns.splice(i, 0, column);
    this.add.existing(column);
  }

  addRackTileToColumn(i: number) {
    if (
      this.rack.activeTileIndex !== null &&
      this.columns[i].tiles.length < 8
    ) {
      // index of currently selected tile
      const index = this.rack.activeTileIndex;
      // letter of currently selected tile
      const letter = this.rack.tiles[index].letter;
      let tile = new Tile(this, letter, 0, 0);
      this.columns[i].addTile(tile);
      this.rack.removeTile(index);
      this.columns[i].unlock();
    }
  }

  moveTileToRack(column: Column, tile: Tile) {
    const tileIndex = column.tiles.indexOf(tile);
    if (tile.rackable && this.rack.tiles.length < 8) {
      column.removeTile(tileIndex);
      this.rack.addTile(tile.letter);
    }
  }

  win() {
    this.timer.destroy();
    this.clockTime = -1;

    this.time.addEvent({
      delay: 2000,
      loop: false,
      callback: () => {
        alert("WIN");
        for (const column of this.columns) {
          column.lock();
        }
        this.add.text(C.SCREEN_WIDTH, C.SCREEN_HEIGHT, "You won!");
      },
    });

    const nameform = this.add
      .dom(C.SCREEN_WIDTH / 2, C.SCREEN_HEIGHT / 2)
      .createFromCache("nameform");
    const usernameField = nameform.getChildByName("username");
    const form = nameform.getChildByID("nameform");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const username: string = usernameField["value"];
      if (username.trim() !== "") {
        postScore(username, this.score).then(() => {
          nameform.destroy();
          this.add
            .text(
              C.SCREEN_WIDTH / 2,
              C.SCREEN_HEIGHT / 2 - 200,
              "Leaderboard",
              {
                fontFamily: C.FONT_FAMILY,
                fontSize: "30px",
                fontStyle: "bold",
                color: "black",
                backgroundColor: "white",
              }
            )
            .setOrigin(0.5, 0);
          const leaderboard = this.add
            .text(C.SCREEN_WIDTH / 2, C.SCREEN_HEIGHT / 2 - 150, "Loading...", {
              fontFamily: C.FONT_FAMILY,
              fontSize: "25px",
              color: "black",
              backgroundColor: "white",
            })
            .setOrigin(0.5, 0);
          getLeaderboard().then(({ runs }) => {
            const text = runs
              .map((run) => `${run.username}: ${run.score}`)
              .join("\n");
            console.log(text);
            leaderboard.setText(text);
          });
        });
      }
    });

    this.tweens.add({
      targets: nameform,
      y: 300,
      duration: 3000,
      ease: "Power3",
    });
  }

  lose() {
    this.timer.destroy();
    this.time.addEvent({
      delay: 2000,
      loop: false,
      callback: () => {
        this.scene.start("gameover", {
          score: this.score,
        });
      },
    });
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: "#125555",
  width: C.SCREEN_WIDTH,
  height: C.SCREEN_HEIGHT,
  scene: [Game, Gameover],
  scale: {
    zoom:
      window.innerHeight >= C.SCREEN_HEIGHT * 2 &&
      window.innerWidth >= C.SCREEN_WIDTH * 2
        ? 2
        : window.innerHeight >= C.SCREEN_HEIGHT * 1.5 &&
          window.innerWidth >= C.SCREEN_WIDTH * 1.5
        ? 1.5
        : 1,
  },
  render: {
    pixelArt: true,
  },
  dom: {
    createContainer: true,
  },
  parent: "parent",
};

const game = new Phaser.Game(config);
