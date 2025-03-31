import { EagleEyesConfig } from "../config";
import { GameMode } from "../constants";
import Nakama from "../nakama";
export class TitleScene extends Phaser.Scene {
   gameMode: GameMode;
   leaderboardRecordPointer: number;
   leaderboardResult: any;
   scrollLeftButton: Phaser.GameObjects.Text;
   scrollRightButton: Phaser.GameObjects.Text;
   leaderboardRecords: Phaser.GameObjects.Text[];
   constructor() {
      super({
         key: "TitleScene",
      });
      Nakama.authenticate();
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
         const recordHeight = 850 + index * 100;
         this.leaderboardRecords.push(
            this.add
               .text(0, recordHeight, `Index: ${index}`, {
                  fontSize: "50px",
                  fontFamily:
                     "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
               })
               .setVisible(false),
         );
      }

      this.add
         .text(
            0,
            +this.sys.game.config.height / 4,
            "The game begins by dealing the player nine shuffle cards, each with a different letter of the phrase 'eagle eyes'.\nYou need to quickly memorize the position of each card before they are all flipped face down.\n  -In Classic Mode, you're given a few seconds to quickly memorize the location of each card.\n  -In Modern Mode, you can take as much time as you like\n   and can compete by submitting your time to a leaderboard upon winning.\n\nOnce the cards are no longer visible, the objective is to flip them back over in an order which spells out eagle eyes.",
            {
               fontSize: "31px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         )
         .setInteractive()
         .on("pointerdown", () => this.startGame(GameMode.Classic));
   }

   drawButtons() {
      this.add.text(
         +this.sys.game.config.width / 2 - 600,
         +this.sys.game.config.height / 100,
         "Eagle Eyes",
         {
            fontSize: "296px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         },
      );
      this.add
         .text(
            +this.sys.game.config.width / 3 + 700,
            +this.sys.game.config.height / 4,
            "Classic Mode",
            {
               fontSize: "150px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         )
         .setInteractive()
         .on("pointerdown", () => this.startGame(GameMode.Classic));
      this.add
         .text(
            +this.sys.game.config.width / 3 + 660,
            +this.sys.game.config.height / 3 + 50,
            "Modern Mode",
            {
               fontSize: "150px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         )
         .setInteractive()
         .on("pointerdown", () => this.startGame(GameMode.Modern));

      this.waitAnddrawLeaderboard();
   }
   delay(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
   }

   async delayedFunctionCall(func: () => Promise<any>, ms: number) {
      await this.delay(ms); // Pause execution for 'ms' milliseconds
      return func(); // Call the async function
   }

   async waitAnddrawLeaderboard() {
      await this.delayedFunctionCall(() => this.drawLeaderboard(), 1000);
   }

   async drawLeaderboard() {
      const result = await Nakama.getTopFiveLeaderboard();
      if (result == null) {
         this.add.text(0, 900, "Unable to fetch leaderboard ", {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         });
         return;
      }
      // this.leaderboardResult = result;
      this.add.text(0, 750, "Leaderboard", {
         fontSize: "70px",
         fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
      });
      var lastRecordHeight = 850;
      this.leaderboardRecordPointer = 0;
      for (let index = 0; index < Math.min(5, result.records.length); index++) {
         const record = result.records[index];
         const recordHeight = 850 + index * 100;
         lastRecordHeight = recordHeight + 100;
         this.leaderboardRecords[index].setText(
            `Rank: #${record.rank},Player: ${record.username}, Memorization Time: ${record.score / 1000}, Scramble: ${record.metadata["Shuffle"]}`,
         );
         this.leaderboardRecords[index].setVisible(true);
         /*  this.add.text(
            0,
            recordHeight,
            `Rank: #${record.rank},Player: ${record.username}, Memorization Time: ${record.score / 1000}, Scramble: ${record.metadata["Shuffle"]}`,
            {
               fontSize: "50px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         );
         */
      }
      this.scrollLeftButton = this.add
         .text(200, lastRecordHeight, "<<", {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         })
         .setInteractive()
         .on("pointerdown", () => this.scrollLeaderboard(0));

      this.scrollRightButton = this.add
         .text(350, lastRecordHeight, ">>", {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         })
         .setInteractive()
         .on("pointerdown", () => this.scrollLeaderboard(1));
   }
   async scrollLeaderboard(direction: number) {
      const result = await Nakama.getTopFiveLeaderboard();
      //const displayData = this.leaderboardResult.slice(this.leaderboardRecordPointer, 5);
      if (direction === 0) {
         // left
         //  if(this.leaderboardRecordPointer <= 0) {return;}
         this.leaderboardRecordPointer -= 5;
      } // right
      else {
         // if(this.leaderboardRecordPointer >= result.records.length) {return;}
         this.leaderboardRecordPointer += 5;
      }
      var lastRecordHeight = 850;
      for (
         let index = Math.max(0, this.leaderboardRecordPointer);
         index < Math.min(5, result.records.length);
         index++
      ) {
         const record = result.records[index];
         const recordHeight = 850 + index * 100;
         lastRecordHeight = recordHeight + 100;
         this.leaderboardRecords[index].setText(
            `Rank: #${record.rank},Player: ${record.username}, Memorization Time: ${record.score / 1000}, Scramble: ${record.metadata["Shuffle"]}`,
         );
         this.leaderboardRecords[index].setVisible(true);
         /* this.add.text(
            0,
            recordHeight,
            `Rank: #${record.rank}, Player: ${record.username}, Memorization Time: ${record.score / 1000}, Scramble: ${record.metadata["Shuffle"]}`,
            {
               fontSize: "50px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         );
         */
      }
      this.scrollLeftButton.setY(lastRecordHeight);
      this.scrollRightButton.setY(lastRecordHeight);
   }

   startGame(gameMode: GameMode) {
      this.scene.start("GameplayScene", {
         gameMode: gameMode,
         answer: EagleEyesConfig.answer,
      });
   }
}
