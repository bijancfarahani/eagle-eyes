import { EagleEyesConfig } from "../config";
import { GameMode } from "../constants";
import Nakama from "../nakama";
export class TitleScene extends Phaser.Scene {
   gameMode: GameMode;
   constructor() {
      super({
         key: "TitleScene",
      });
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
      Nakama.authenticate();
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
      const startClassicMode = this.add
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
      const startModernMode = this.add
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
      const viewLeaderboard = this.add
         .text(1060, 750, "View Leaderboard", {
            fontSize: "150px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         })
         .setInteractive()
         .on("pointerdown", () => this.viewLeaderboard());
   }
   async viewLeaderboard() {
      const result = await Nakama.viewLeaderboard();
      if (result == null) {
         this.add.text(0, 900, "Unable to fetch leaderboard ", {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         });
         return;
      }
      this.add.text(0, 900, "Leaderboard", {
         fontSize: "70px",
         fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
      });
      for (
         let index = 0;
         index < Math.min(10, result.records.length);
         index++
      ) {
         const record = result.records[index];
         this.add.text(
            0,
            1000 + index * 100,
            `Rank: #${record.rank},Player: ${record.username}, Memorization Time: ${record.score / 1000}, Scramble: ${record.metadata.scrambled}`,
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
