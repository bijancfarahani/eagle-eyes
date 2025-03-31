import { EagleEyesConfig } from "../config";
import { GameMode } from "../constants";
import Nakama from "../nakama";
export class TitleScene extends Phaser.Scene {
   gameMode: GameMode;
   leaderboardRecordPointer: number;
   scrollLeftButton: Phaser.GameObjects.Text;
   scrollRightButton: Phaser.GameObjects.Text;
   leaderboardRecords: Phaser.GameObjects.Text[];
   constructor() {
      Nakama.authenticateDevice();
      super({
         key: "TitleScene",
      });
      this.leaderboardRecords = [];
   }

   preload() {
      this.load.setBaseURL("./assets/");
      this.load.image("card_back", "cards/back.png");
      this.load.image("card_e", "cards/e.png");
      this.load.image("card_a", "cards/a.png");
      this.load.image("card_g", "cards/g.png");
      this.load.image("card_l", "cards/l.png");
      this.load.image("card_y", "cards/y.png");
      this.load.image("card_s", "cards/s.png");
   }
   create() {
      this.drawButtons();

      for (let index = 0; index < 5; index++) {
         const recordHeight = +this.sys.game.config.height * 0.6 + index * 100;
         this.leaderboardRecords.push(
            this.add
               .text(
                  +this.sys.game.config.width * 0.01,
                  recordHeight,
                  `Index: ${index}`,
                  {
                     fontSize: "50px",
                     fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
                  },
               )
               .setVisible(false),
         );
      }

      this.add
         .text(
            +this.sys.game.config.width * 0.005,
            +this.sys.game.config.height * 0.2,
            "The game begins by dealing the player nine shuffle cards,\neach with a different letter of the phrase 'eagle eyes'.\nYou need to quickly memorize the position of each card\nbefore they are flipped face down.\n   -In Classic Mode, you're given a few seconds to quickly\n   memorize the location of each card.\n   -In Modern Mode, you can take as much time as you like\n    and can compete by submitting your time to a leaderboard\n    upon winning.\nOnce the cards are no longer visible, the objective is to\nflip them back over in an order which spells out eagle eyes.",
            {
               fontSize: "31px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         )
         .setInteractive()
         //.setOrigin(0, 0)
         .setFixedSize(+this.sys.game.config.width * 0.53, 0)
         .on("pointerdown", () => this.startGame(GameMode.Classic));
   }

   drawButtons() {
      this.add
         .text(
            +this.sys.game.config.width * 0.5,
            +this.sys.game.config.height * 0.1,
            "Eagle Eyes",
            {
               fontSize: "250px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         )
         .setOrigin(0.5);
      this.add
         .text(
            +this.sys.game.config.width * 0.99,
            +this.sys.game.config.height * 0.25,
            "Classic Mode",
            {
               fontSize: "150px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         )
         .setInteractive()
         .setOrigin(1, 0.5)
         .on("pointerdown", () => this.startGame(GameMode.Classic));
      this.add
         .text(
            +this.sys.game.config.width * 0.99,
            +this.sys.game.config.height * 0.35,
            "Modern Mode",
            {
               fontSize: "150px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         )
         .setInteractive()
         .setOrigin(1, 0.5)
         .on("pointerdown", () => this.startGame(GameMode.Modern));

      this.drawLeaderboard();
   }

   async drawLeaderboard() {
      const result = await Nakama.getTopFiveLeaderboard();
      if (result == null) {
         this.add.text(
            +this.sys.game.config.width * 0.1,
            +this.sys.game.config.height * 0.5,
            "Unable to fetch leaderboard ",
            {
               fontSize: "70px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         );
         return;
      }

      this.add.text(
         +this.sys.game.config.width * 0.01,
         +this.sys.game.config.height * 0.5,
         "Leaderboard",
         {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         },
      );
      var lastRecordHeight = +this.sys.game.config.height * 0.6;
      this.leaderboardRecordPointer = 0;
      for (let index = 0; index < Math.min(5, result.records.length); index++) {
         const record = result.records[index];
         const recordHeight = +this.sys.game.config.height * 0.6 + index * 100;
         lastRecordHeight = recordHeight + 100;
         this.leaderboardRecords[index].setText(
            `Rank: #${record.rank}, Player: ${record.username}, Memorization Time: ${record.score / 1000}, Scramble: ${record.metadata["Shuffle"]}`,
         );
         this.leaderboardRecords[index].setVisible(true);
      }
      this.scrollLeftButton = this.add
         .text(+this.sys.game.config.width * 0.1, lastRecordHeight, "<<", {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         })
         .setInteractive()
         .on("pointerdown", () => this.scrollLeaderboard(0));

      this.scrollRightButton = this.add
         .text(+this.sys.game.config.width * 0.15, lastRecordHeight, ">>", {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         })
         .setInteractive()
         .on("pointerdown", () => this.scrollLeaderboard(1));
   }
   async scrollLeaderboard(direction: number) {
      const result = await Nakama.getTopFiveLeaderboard();
      if (direction === 0) {
         // left
         //  if(this.leaderboardRecordPointer <= 0) {return;}
         this.leaderboardRecordPointer -= 5;
      } // right
      else {
         //if(this.leaderboardRecordPointer >= result.records.length) {return;}
         this.leaderboardRecordPointer += 5;
      }
      var lastRecordHeight = +this.sys.game.config.height * 0.6;
      let index = Math.max(0, this.leaderboardRecordPointer);
      if (index >= result.records.length) {
      } else {
         for (; index < Math.min(5, result.records.length); index++) {
            const record = result.records[index];
            const recordHeight = +this.sys.game.config.height * 0.6 + index * 100;
            lastRecordHeight = recordHeight + 100;
            this.leaderboardRecords[index].setText(
               `Rank: #${record.rank}, Player: ${record.username}, Memorization Time: ${record.score / 1000}, Scramble: ${record.metadata["Shuffle"]}`,
            );
            this.leaderboardRecords[index].setVisible(true);
         }
         this.scrollLeftButton.setY(lastRecordHeight);
         this.scrollRightButton.setY(lastRecordHeight);
      }
   }

   startGame(gameMode: GameMode) {
      this.scene.start("GameplayScene", {
         gameMode: gameMode,
         answer: EagleEyesConfig.answer,
      });
   }
}
