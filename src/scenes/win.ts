import { GameMode } from "../constants";
import Nakama from "../nakama";

export class WinScene extends Phaser.Scene {
   gameMode: GameMode;
   answer: string;
   shuffle: string;
   memorizationTime: number;
   playerNameInput: Phaser.GameObjects.Text;
   addToLeaderboardButton: Phaser.GameObjects.Text;

   nearbyLeaderboard: Phaser.GameObjects.Text;
   topFiveLeaderboard: Phaser.GameObjects.Text;
   scrollLeftButton: Phaser.GameObjects.Text;
   scrollRightButton: Phaser.GameObjects.Text;
   lastRecordHeight: number;
   leaderboardRecordPointer: number;
   htmlUsernameInput: HTMLInputElement; // Add this line
   username: string; // Add this line

   constructor() {
      super({
         key: "WinScene",
      });
      // this.playerNameInputListener = this.playerNameInputListener.bind(this); // Bind this
   }

   init(data: {
      gameMode: GameMode;
      answer: string;
      shuffle: string;
      memorizationTime: number;
   }) {
      this.gameMode = data.gameMode;
      this.answer = data.answer;
      this.shuffle = data.shuffle;
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
            this.htmlUsernameInput.style.display = "none";
            this.scene.start("GameplayScene", {
               gameMode: this.gameMode,
               answer: this.answer,
            });
         });

      this.add
         .text(
            +this.sys.game.config.width / 3 + 1210,
            +this.sys.game.config.height - 150,
            "Title Screen",
            {
               fontSize: "75px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         )
         .setInteractive()
         .on("pointerdown", () => {
            this.htmlUsernameInput.style.display = "none";
            this.scene.start("TitleScene");
         });

      if (this.gameMode == GameMode.Modern) {
         this.drawLeaderboard();
         this.htmlUsernameInput = document.getElementById(
            "usernameInput",
         ) as HTMLInputElement; // Add this line
         this.htmlUsernameInput.style.display = "block"; //show the input
         this.htmlUsernameInput.focus();
         this.input.keyboard.on("keydown-ENTER", () => {
            //this.playerNameInput(this.htmlUsernameInput.value);
            this.username = this.htmlUsernameInput.value;
            this.htmlUsernameInput.style.display = "none";
            this.addToLeaderboard();
            // this.addToLeaderboardButton.setVisible(true);
            //this.addToLeaderboardButton.setInteractive();
         });
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

      this.scrollLeftButton = this.add
         .text(200, this.lastRecordHeight, "<<", {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         })
         .setInteractive()
         .on("pointerdown", () => this.scrollLeaderboard(0));

      this.scrollRightButton = this.add
         .text(350, this.lastRecordHeight, ">>", {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         })
         .setInteractive()
         .on("pointerdown", () => this.scrollLeaderboard(1));

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
         `Deck Shuffle: ${this.shuffle}`,
         {
            fontSize: "70px",
            fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
         },
      );

      this.playerNameInput = this.add
         .text(
            +this.sys.game.config.width / 3 + 850,
            +this.sys.game.config.height - 700,
            "<Enter player name>",
            {
               fontSize: "70px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         )
         .setVisible(false);
      // this.input.keyboard.on("keydown", this.playerNameInputListener);
   }
   async scrollLeaderboard(direction: number) {
      const result = await Nakama.getTopFiveLeaderboard();
      //const displayData = this.leaderboardResult.slice(this.leaderboardRecordPointer, 5);
      if (direction === 0) {
         // left
         this.leaderboardRecordPointer -= 5;
      } // right
      else {
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
         this.add.text(
            0,
            recordHeight,
            `Rank: #${record.rank}, Player: ${record.username}, Memorization Time: ${record.score / 1000}, Scramble: ${record.metadata["Shuffle"]}`,
            {
               fontSize: "50px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         );
      }
      this.scrollLeftButton.setY(lastRecordHeight);
      this.scrollRightButton.setY(lastRecordHeight);
   }

   private drawLeaderboardRows(result: any) {
      if (result == null) {
         return;
      }
      for (let index = 0; index < Math.min(5, result.records.length); index++) {
         this.add.text(
            0,
            1000 + index * 100,
            `Rank: #${result.records[index].rank}, Player: ${result.records[index].username}, Time: ${result.records[index].score / 1000}, Shuffle: ${result.records[index].metadata["Shuffle"]}`,
            {
               fontSize: "50px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         );
      }
   }
   /*
   playerNameInputListener(event: { key: string; keyCode: number }): void {
   //playerNameInputListener(playerNameTextInput: string): void{
   //return;
      var processedPlayerName = playerNameTextInput;
      if (processedPlayerName == "<Enter player name>") {
         processedPlayerName = "";
      }
      /*if (event.keyCode == 8) {
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
*/
   async addToLeaderboard() {
      const numStr = String(this.memorizationTime);
      const [integerPart, decimalPart] = numStr.split(".");
      const [integer, decimal] = [
         parseInt(integerPart, 10),
         parseInt(decimalPart || "0", 10),
      ];

      const isAddedToLeaderboard = await Nakama.addToLeaderboard(
         integer,
         decimal,
         this.username,
         this.shuffle,
      );
      if (isAddedToLeaderboard) {
         this.addToLeaderboardButton.setText("Success!");
         this.addToLeaderboardButton.disableInteractive();
      } else {
         this.addToLeaderboardButton.setText("Failed! Try again?");
      }
   }

   async drawTopFiveLeaderboard() {
      this.nearbyLeaderboard.setAlpha(0.5).setInteractive();

      const result = await Nakama.getTopFiveLeaderboard();
      this.drawLeaderboardRows(result);
      this.topFiveLeaderboard.setAlpha(1).disableInteractive();
   }

   async drawLeaderboardNearPlayer() {
      this.topFiveLeaderboard.setAlpha(0.5).setInteractive();

      const result = await Nakama.getNearbyLeaderboard();
      this.drawLeaderboardRows(result);

      this.nearbyLeaderboard.setAlpha(1).disableInteractive();
   }
}
