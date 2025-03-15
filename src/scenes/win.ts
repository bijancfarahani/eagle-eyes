import { create } from "domain";
import { GameMode } from "../constants";

export class WinScene extends Phaser.Scene {
   gameMode: GameMode;
   answer: string;
   scrambled: string;
   memorizationTime: number;
   constructor() {
      super({
         key: "WinScene",
      });
   }

   init(data: { gameMode: GameMode, answer: string, scrambled: string, memorizationTime: number }) {
      this.gameMode = data.gameMode;
      this.answer = data.answer;
      this.scrambled = data.scrambled;
      this.memorizationTime = data.memorizationTime;
   }

   create() {
      this.add.text(0, 0, "You won!!!", {
         fontSize: "48px",
         fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
      });
      const card_sprite = this.add.sprite(400, 400, "card_back");
      card_sprite.setInteractive().on(
         "pointerdown",
         function () {
            this.scene.start("TitleScene");
         },
         this,
      );
      if (this.gameMode == GameMode.Modern) {
         const startClassicMode = this.add
            .text(400, 400, "Add to Leaderboard!", {
               fontSize: "70px",
               fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
            })
            .setInteractive()
            .on("pointerdown", () => this.addToLeaderboard(this.scrambled, this.memorizationTime));
         const startModernMode = this.add
            .text(1000, 400, "View Leaderboard", {
               fontSize: "70px",
               fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
            })
            .setInteractive()
            .on("pointerdown", () => this.viewLeaderboard());
      }
   }
   addToLeaderboard(scrambled: string, memorizationTime: number) {
      throw new Error("Method not implemented.");
   }
   viewLeaderboard() {
      throw new Error("Method not implemented.");
   }
}
