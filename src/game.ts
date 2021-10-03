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
  levelDisplay: Phaser.GameObjects.Text;
  level: number;
  dictionary: Dictionary;

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

    this.load.json("wordList", "assets/words.json");
  }

  create() {
    this.add.image(C.SCREEN_WIDTH / 2, C.SCREEN_HEIGHT / 2, "background");
    const data = this.cache.json.get("wordList");
    this.dictionary = new Dictionary(data);

    this.columns = [];
    for (let i = 0; i < 6; i++) {
      this.addColumn(i);
    }

    this.rack = new Rack(this, () => {
      console.log(this.columns);
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
    const timedEvent = this.time.addEvent({
      delay: 1000,
      callback: this.onClockTick,
      callbackScope: this,
      loop: true,
    });
    this.updateClock();

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
    this.input.keyboard.on(
      "keydown-C",
      function () {
        this.moveTileToRack(this.columns[0], 0);
      },
      this
    );
  }

  onClockTick() {
    this.clockTime -= 1; // One second
    if (this.clockTime <= 0) {
      this.cameras.main.shake(
        C.EARTHQUAKE_DURATION * 1000,
        C.EARTHQUAKE_INTENSITY
      );
      this.level++;
      if (this.level >= C.NUMBER_OF_LEVELS) {
        alert("WOW SUCH FINISH!!!11!");
      }
      this.updateLevelDisplay();
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
      }
      this.rack.fill(8);
      this.clockTime = C.TIME_PER_LEVEL + C.EARTHQUAKE_DURATION;
    }
    this.updateClock();
  }

  updateClock() {
    this.clock.setText(this.clockTime.toString());
  }

  updateLevelDisplay() {
    this.levelDisplay.setText(`${this.level} / ${C.NUMBER_OF_LEVELS}`);
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
      (tile) => this.moveTileToRack(column, tile)
    );
    this.columns.splice(i, 0, column);
    this.add.existing(column);
  }

  addRackTileToColumn(i: number) {
    if (this.rack.activeTileIndex !== null) {
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
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: "#125555",
  width: C.SCREEN_WIDTH,
  height: C.SCREEN_HEIGHT,
  scene: Game,
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
};

const game = new Phaser.Game(config);
