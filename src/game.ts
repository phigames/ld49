import "phaser";
import Column from "./column";
import * as C from "./constants";
import { Dictionary } from "./dictionary";
import Rack from "./rack";

export default class Game extends Phaser.Scene {
  rack: Rack;
  columns: Column[];

  constructor() {
    super("game");
  }

  preload() {
    for (const letter of C.LETTERS) {
      this.load.image(`assets/letter-${letter}`);
    }
    this.load.json("wordList", "assets/words.json");
  }

  create() {
    const data = this.cache.json.get("wordList");
    const word_dict = new Dictionary(data);

    this.rack = new Rack(this, ["D", "E", "F"]);
    this.add.existing(this.rack);
    this.columns = [];
    for (let i = 0; i < 5; i++) {
      const column = new Column(this, i, ["A", "B", "C"]);
      this.columns.push(column);
      this.add.existing(column);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  backgroundColor: "#125555",
  width: 800,
  height: 600,
  scene: Game,
};

const game = new Phaser.Game(config);
