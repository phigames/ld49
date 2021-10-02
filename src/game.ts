import "phaser";
import Column from "./column";
import * as C from "./constants";
import { Dictionary } from "./dictionary";
import Rack from "./rack";
import Tile from "./tile";

export default class Game extends Phaser.Scene {
  rack: Rack;
  columns: Column[];
  clock: Phaser.GameObjects.Text;
  clockTime: number;
  dictionary: Dictionary;

  constructor() {
    super("game");
  }

  preload() {
    for (const letter of C.LETTERS) {
      this.load.image(`letter-${letter}`, `assets/letter-${letter}.png`);
    }
    this.load.json("wordList", "assets/words.json");
    this.load.image("background", "assets/background.png");
  }

  create() {
    let background = this.add.image(
      C.SCREEN_WIDTH / 2,
      C.SCREEN_HEIGHT / 2,
      "background"
    );
    const data = this.cache.json.get("wordList");
    this.dictionary = new Dictionary(data);

    this.rack = new Rack(this);
    this.add.existing(this.rack);
    this.columns = [];
    for (let i = 0; i < 6; i++) {
      this.addColumn(i);
    }
    this.clockTime = C.TIME_PER_LEVEL;
    this.clock = this.add.text(600, 32, this.clockTime.toString());
    const timedEvent = this.time.addEvent({
      delay: 1000,
      callback: this.onEvent,
      callbackScope: this,
      loop: true,
    });

    // Test functions for removing/adding rack tiles (hehe)
    this.input.keyboard.on(
      "keydown-R",
      function () {
        this.rack.removeTile(0);
      },
      this
    );
    this.input.keyboard.on(
      "keydown-F",
      function () {
        console.log(this.rack.addTile("F"));
      },
      this
    );
    this.input.keyboard.on(
      "keydown-A",
      function () {
        this.rack.fill();
      },
      this
    );
  }

  onEvent() {
    this.clockTime -= 1; // One second
    if (this.clockTime <= 0) {
      for (let i = 0; i < this.columns.length; i++) {
        const column = this.columns[i];
        const randomIndex = Math.floor(
          Math.random() * (column.tiles.length + 1)
        );
        if (column.isWord) {
          column.removeTile(randomIndex);
        } else {
          // TODO Animation for Earthquake Tiles
          for (const tile of column.tiles) {
            tile.destroy();
          }
          this.columns.splice(i, 1);
          this.addColumn(i);
          column.destroy(true);
        }
      }
      this.clockTime = C.TIME_PER_LEVEL;
    }
    this.clock.setText(this.clockTime.toString());
  }

  addColumn(i: number) {
    const column = new Column(this, i, ["A", "B", "C"], this.dictionary, () =>
      this.addRackTile(i)
    );
    this.columns.splice(i, 0, column);
    this.add.existing(column);
    column.addNewButton();
    if (i == 0) {
      column.removeButton();
    }
  }

  addRackTile(i: number) {
    if (this.rack.activeLetter >= 0) {
      console.log("add tile from rack");
      // index of currently selected tile
      const index = this.rack.activeLetter;
      // letter of currently selected tile
      const letter = this.rack.tiles[index].letter;
      let tile = new Tile(this, letter, i * 70, 5 * 40);
      this.columns[i].addTile(tile);
      this.rack.removeTile(index);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#125555",
  width: C.SCREEN_WIDTH,
  height: C.SCREEN_HEIGHT,
  scene: Game,
};

const game = new Phaser.Game(config);
