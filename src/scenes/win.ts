import { GameMode } from "../constants";
import { LeaderboardContainer } from "../leaderboard";
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

   leaderboardContainer: LeaderboardContainer;

   constructor() {
      super({
         key: "WinScene",
      });
   }

   preload() {
      this.leaderboardContainer = new LeaderboardContainer(
         this,
         +this.game.config.width * 0.03,
         +this.game.config.height * 0.5,
         +this.game.config.width * 0.5,
         +this.game.config.height * 0.5,
      );
      this.add.existing(this.leaderboardContainer);
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
      this.add
         .text(
            +this.sys.game.config.width * 0.5,
            +this.sys.game.config.height * 0.1,
            "You won!!!",
            {
               fontSize: "200px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         )
         .setOrigin(0.5);

      this.add
         .text(
            +this.sys.game.config.width * 0.99,
            +this.sys.game.config.height * 0.6,
            "Replay",
            {
               fontSize: "75px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
               align: "right",
            },
         )
         .setInteractive()
         .setOrigin(1, 0.5)
         .on("pointerdown", () => {
            this.htmlUsernameInput.style.display = "none";
            this.scene.start("GameplayScene", {
               gameMode: this.gameMode,
               answer: this.answer,
            });
         });

      this.add
         .text(
            +this.sys.game.config.width * 0.99,
            +this.sys.game.config.height * 0.7,
            "Title Screen",
            {
               fontSize: "75px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
               align: "right",
            },
         )
         .setInteractive()
         .setOrigin(1, 0.5)
         .on("pointerdown", () => {
            this.htmlUsernameInput.style.display = "none";
            this.scene.start("TitleScene");
         });

      // Draw player win details.
      this.add
         .text(
            +this.sys.game.config.width * 0.99,
            +this.sys.game.config.height * 0.3,
            `Time: ${this.memorizationTime}`,
            {
               fontSize: "70px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
               align: "right",
            },
         )
         .setOrigin(1, 0.5);
      this.add
         .text(
            +this.sys.game.config.width * 0.99,
            +this.sys.game.config.height * 0.4,
            `Deck Shuffle: ${this.shuffle}`,
            {
               fontSize: "70px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
               align: "right",
            },
         )
         .setOrigin(1, 0.5);

      // Draw leaderboard details.
      if (this.gameMode == GameMode.Modern) {
         this.leaderboardContainer.drawLeaderboard();
         this.htmlUsernameInput = document.getElementById(
            "usernameInput",
         ) as HTMLInputElement; // Add this line
         this.htmlUsernameInput.style.display = "block"; //show the input
         this.htmlUsernameInput.focus();
         this.input.keyboard.on("keydown-ENTER", () => {
            this.username = this.htmlUsernameInput.value;
            this.htmlUsernameInput.style.display = "none";
            this.addToLeaderboard();
         });
      }
   }

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
}
