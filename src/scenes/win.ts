import { GameMode } from "../constants";
import Nakama from "../nakama";

export class WinScene extends Phaser.Scene {
   gameMode: GameMode;
   answer: string;
   shuffled: string;
   memorizationTime: number;
   playerNameInput: Phaser.GameObjects.Text;
   addToLeaderboardButton: Phaser.GameObjects.Text;

   nearbyLeaderboard: Phaser.GameObjects.Text;
   topFiveLeaderboard: Phaser.GameObjects.Text;

   constructor() {
      super({
         key: "WinScene",
      });
      this.playerNameInputListener = this.playerNameInputListener.bind(this); // Bind this
   }

   init(data: {
      gameMode: GameMode;
      answer: string;
      shuffled: string;
      memorizationTime: number;
   }) {
      this.gameMode = data.gameMode;
      this.answer = data.answer;
      this.shuffled = data.shuffled;
      this.memorizationTime = data.memorizationTime;
   }

   create() {
      this.add.text(
         +this.sys.game.config.width / 2,
         +this.sys.game.config.height / 100,
         "You won!!!",
         {
            fontSize: "258px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         },
      );

      this.add
         .text(
            +this.sys.game.config.width / 3 + 1370,
            +this.sys.game.config.height - 250,
            "Replay",
            {
               fontSize: "75px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         )
         .setInteractive()
         .on("pointerdown", () => {
            this.scene.start("GameplayScene", {
               gameMode: this.gameMode,
               answer: this.answer,
            });
         });

      this.add
         .text(
            +this.sys.game.config.width / 3 + 1100,
            +this.sys.game.config.height - 150,
            "Title Screen",
            {
               fontSize: "75px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         )
         .setInteractive()
         .on("pointerdown", () => {
            this.scene.start("TitleScene");
         });

      if (this.gameMode == GameMode.Modern) {
         this.drawLeaderboard();
      }
   }

   drawLeaderboard() {
      this.addToLeaderboardButton = this.add
         .text(1700, 800, "Add to Leaderboard!", {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         })
         .disableInteractive()
         .setVisible(false)
         .on("pointerdown", () => this.addToLeaderboard());

      this.topFiveLeaderboard = this.add
         .text(0, 800, "Top 5 Leaderboard", {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         })
         .disableInteractive()
         .on("pointerdown", () => this.drawTopFiveLeaderboard());

      this.nearbyLeaderboard = this.add
         .text(800, 800, "Leaderboard Near Me", {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         })
         .setInteractive()
         .setAlpha(0.5)
         .on("pointerdown", () => this.drawLeaderboardNearPlayer());

      this.drawTopFiveLeaderboard();

      // Draw player win details.
      this.add.text(
         +this.sys.game.config.width / 3 + 910,
         +this.sys.game.config.height - 1050,
         `Time: ${this.memorizationTime}`,
         {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         },
      );
      this.add.text(
         +this.sys.game.config.width / 3 + 700,
         +this.sys.game.config.height - 950,
         `Deck Shuffle: ${this.shuffled}`,
         {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         },
      );

      this.playerNameInput = this.add.text(
         +this.sys.game.config.width / 3 + 850,
         +this.sys.game.config.height - 700,
         "<Enter player name>",
         {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         },
      );
      this.input.keyboard.on("keydown", this.playerNameInputListener);
   }

   async drawTopFiveLeaderboard() {
      this.nearbyLeaderboard.setAlpha(0.5).setInteractive();

      const result = await Nakama.getTopFiveLeaderboard();
      this.drawLeaderboardRows(result);
      this.topFiveLeaderboard.setAlpha(1).disableInteractive();
   }

   private drawLeaderboardRows(result: any) {
      for (let index = 0; index < Math.min(5, result.records.length); index++) {
         this.add.text(
            0,
            1000 + index * 100,
            `Rank: #${result.records[index].rank},Player: ${result.records[index].username}, Time: ${result.records[index].score / 1000}, Shuffle: ${result.records[index].metadata["Shuffle"]}`,
            {
               fontSize: "50px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         );
      }
   }

   playerNameInputListener(event: { key: string; keyCode: number }): void {
      var processedPlayerName = this.playerNameInput.text;
      if (processedPlayerName == "<Enter player name>") {
         processedPlayerName = "";
      }
      if (event.keyCode == 8) {
         if (processedPlayerName.length == 0) {
            return;
         }
         processedPlayerName = processedPlayerName.slice(0, -1);
         if (processedPlayerName.length == 0) {
            processedPlayerName = "<Enter player name>";
         }
      } else if (processedPlayerName.length > 15) {
         return;
      } else if (
         (event.keyCode >= 65 && event.keyCode <= 90) ||
         (event.keyCode >= 48 && event.keyCode <= 57) ||
         event.keyCode === 32 ||
         event.keyCode === 173
      ) {
         processedPlayerName += event.key;
      }
      if (
         processedPlayerName != "<Enter player name>" &&
         processedPlayerName.length > 0
      ) {
         this.addToLeaderboardButton.setVisible(true);
         this.addToLeaderboardButton.setInteractive();
      } else {
         this.addToLeaderboardButton.setVisible(false);
         this.addToLeaderboardButton.disableInteractive();
      }
      this.playerNameInput.setText(processedPlayerName);
   }

   async addToLeaderboard() {
      const numStr = String(this.memorizationTime);
      const [integerPart, decimalPart] = numStr.split(".");
      const [integer, decimal] = [
         parseInt(integerPart, 10),
         parseInt(decimalPart || "0", 10),
      ];

      Nakama.addToLeaderboard(
         integer,
         decimal,
         this.playerNameInput.text,
         this.shuffled,
      );
      this.addToLeaderboardButton.setText("Success!");
      this.addToLeaderboardButton.disableInteractive();
   }

   async drawLeaderboardNearPlayer() {
      this.topFiveLeaderboard.setAlpha(0.5).setInteractive();

      const result = await Nakama.getNearbyLeaderboard();
      this.drawLeaderboardRows(result);

      this.nearbyLeaderboard.setAlpha(1).disableInteractive();
   }
}
