import "phaser";
import * as C from "./constants";
import { Dictionary } from "./dictionary";

export default class Game extends Phaser.Scene {
  tiles: Tile[];

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
    for (const letter of this.tiles) {
      this.add.existing(letter);
    }
    const data = this.cache.json.get("wordList");
    const word_dict = new Dictionary(data);
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
