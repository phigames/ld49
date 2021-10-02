import "phaser";
import Column from "./column";
import * as C from "./constants";
import { Dictionary } from "./dictionary";
import Rack from "./rack";

export default class Game extends Phaser.Scene {
  rack: Rack;
  columns: Column[];
  clock: Phaser.GameObjects.Text;
  clockTime: number

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
    const word_dict = new Dictionary(data);

    this.rack = new Rack(this);
    this.add.existing(this.rack);
    this.columns = [];
    for (let i = 0; i < 6; i++) {
      const column = new Column(this, i, ["A", "B", "C"], word_dict, ()=>{});
      this.columns.push(column);
      this.add.existing(column);
    }
    this.columns[0].addNewButton()
    this.clockTime = C.TIME_PER_LEVEL
    this.clock = this.add.text(700, 32, this.clockTime.toString());  
    const timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });
  }

  onEvent()
  {
      this.clockTime -= 1; // One second
      if (this.clockTime <= 0) {
        for (let column of this.columns) {
          column.onEarthquake();
        }
        this.clockTime = C.TIME_PER_LEVEL
      }
      this.clock.setText(this.clockTime.toString());
  }

  addRackTile(i: number): string{
    return 'X'
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
