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

   // Capture the player name via the devices keyboard.
   htmlUsernameInput: HTMLInputElement;
   username: string;

   leaderboardContainer: LeaderboardContainer;

   constructor() {
      super({
         key: "WinScene",
      });
      this.htmlUsernameInput = document.getElementById(
         "usernameInput",
      ) as HTMLInputElement;
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
         .on("pointerup", () => {
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
         .on("pointerup", () => {
            this.htmlUsernameInput.style.display = "none";
            this.scene.start("TitleScene");
         });

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

      // Draw modern mode, leaderboard details.
      if (this.gameMode == GameMode.Modern) {
         // Draw memorization time.
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

         this.leaderboardContainer.drawLeaderboard();

         // Draw the HTML form.
         // Show the input field.
         this.htmlUsernameInput.style.display = "block";
         this.htmlUsernameInput.focus();
         this.input.keyboard.on("keyup-ENTER", () => {
            this.username = this.htmlUsernameInput.value;
            this.htmlUsernameInput.style.display = "none";
            this.addToLeaderboard();
         });
      }
   }

   async addToLeaderboard() {
      const isAddedToLeaderboard = await Nakama.addToLeaderboard(
         this.memorizationTime,
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
