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


      this.add.text(0, 0, "Welcome to Eagle Eyes!", {
         fontSize: "48px",
         fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
      });
      const startClassicMode = this.add
         .text(400, 400, "Classic Mode", {
            fontSize: "70px",
            fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
         })
         .setInteractive()
         .on("pointerdown", () => this.startGame(GameMode.Classic));
      const startModernMode = this.add
         .text(1000, 400, "Modern Mode", {
            fontSize: "70px",
            fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
         })
         .setInteractive()
         .on("pointerdown", () => this.startGame(GameMode.Modern));
       const viewLeaderboard = this.add
          .text(1000, 700, "View Leaderboard", {
             fontSize: "70px",
             fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
          })
          .setInteractive()
          .on("pointerdown", () => this.viewLeaderboard());
          const addLeaderboard = this.add
             .text(400, 700, "Add Leaderboard", {
                fontSize: "70px",
                fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
             })
             .setInteractive()
             .on("pointerdown", () => this.addToLeaderboard());
   }
   async viewLeaderboard() {
      console.log('view leaderboard');
      const result = await Nakama.viewLeaderboard();
      console.log(result);

      this.add
      .text(0, 800, "Leaderboard", {
         fontSize: "70px",
         fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
      });
      console.log(result.records);
      for (let index = 0; index < Math.min(10, result.records.length); index++) {
         this.add
            .text(0, 1000 + (index * 100), `Rank: #${result.records[index].rank},Player: ${result.records[index].username}, Memorization Time: ${result.records[index].score / 1000}`, {
               fontSize: "50px",
               fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
            });
      }
   }

   async addToLeaderboard() {
      Nakama.addToLeaderboard(91, 10, "title scene2", "eagleeyes");
   }
   startGame(gameMode: GameMode) {
      this.scene.start("GameplayScene", {
         gameMode: gameMode,
         answer: EagleEyesConfig.answer,
      });
   }
}
