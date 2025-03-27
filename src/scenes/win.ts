import { GameMode } from "../constants";
import Nakama from "../nakama";

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

   init(data: {
      gameMode: GameMode;
      answer: string;
      scrambled: string;
      memorizationTime: number;
   }) {
      this.gameMode = data.gameMode;
      this.answer = data.answer;
      this.scrambled = data.scrambled;
      this.memorizationTime = data.memorizationTime;
   }

   create() {
      this.add.text(0, 0, "You won!!!", {
         fontSize: "48px",
         fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
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
            .text(400, 1000, "Add to Leaderboard!", {
               fontSize: "70px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            })
            .setInteractive()
            .on("pointerdown", () => this.addToLeaderboard());
         const startModernMode = this.add
            .text(1000, 400, "View Leaderboard", {
               fontSize: "70px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            })
            .setInteractive()
            .on("pointerdown", () => this.getLeaderboard());
      }
   }
   async addToLeaderboard() {
      const player_name = "bj";

      const numStr = String(this.memorizationTime);
      const [integerPart, decimalPart] = numStr.split(".");
      const [integer, decimal] = [
         parseInt(integerPart, 10),
         parseInt(decimalPart || "0", 10),
      ];

      Nakama.addToLeaderboard(integer, decimal, player_name, this.scrambled);
   }

   async getLeaderboard() {
      const result = await Nakama.getLeaderboard();

      this.add.text(0, 800, "Leaderboard", {
         fontSize: "70px",
         fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
      });
      for (
         let index = 0;
         index < Math.min(10, result.records.length);
         index++
      ) {
         this.add.text(
            0,
            1000 + index * 100,
            `Rank: #${result.records[index].rank},Player: ${result.records[index].username}, Memorization Time: ${result.records[index].score / 1000}`,
            {
               fontSize: "50px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         );
      }
   }
}
