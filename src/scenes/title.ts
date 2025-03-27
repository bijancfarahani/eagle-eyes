import { EagleEyesConfig } from "../config";
import { GameMode } from "../constants";
import Nakama from "../nakama";
export class TitleScene extends Phaser.Scene {
   gameMode: GameMode;
   constructor() {
      super({
         key: "TitleScene",
      });
      Nakama.authenticate();
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
            +this.sys.game.config.width / 3 + 570,
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
      this.add.text(0, 750, "Leaderboard", {
         fontSize: "70px",
         fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
      });
      for (let index = 0; index < Math.min(5, result.records.length); index++) {
         const record = result.records[index];
         this.add.text(
            0,
            850 + index * 100,
            `Rank: #${record.rank},Player: ${record.username}, Memorization Time: ${record.score / 1000}, Scramble: ${record.metadata["Shuffle"]}`,
            {
               fontSize: "50px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         );
      }
   }

   startGame(gameMode: GameMode) {
      this.scene.start("GameplayScene", {
         gameMode: gameMode,
         answer: EagleEyesConfig.answer,
      });
   }
}
