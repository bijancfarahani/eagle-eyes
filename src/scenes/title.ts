import { EagleEyesConfig } from "../config";
import { GameMode } from "../constants";
import Nakama from "../nakama";
import { LeaderboardContainer } from "../leaderboard";
export class TitleScene extends Phaser.Scene {
   gameMode: GameMode;
   leaderboardContainer: LeaderboardContainer;

   constructor() {
      Nakama.authenticateDevice();
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

      this.leaderboardContainer = new LeaderboardContainer(
         this,
         +this.game.config.width * 0.03,
         +this.game.config.height * 0.5,
         +this.game.config.width * 0.5,
         +this.game.config.height * 0.5,
      );
      this.add.existing(this.leaderboardContainer);
   }

   create() {
      // Draw title.
      this.add
         .text(
            +this.sys.game.config.width * 0.5,
            +this.sys.game.config.height * 0.1,
            "Eagle Eyes",
            {
               fontSize: "250px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         )
         .setOrigin(0.5);

      // Draw instructions.
      this.add
         .text(
            +this.sys.game.config.width * 0.005,
            +this.sys.game.config.height * 0.2,
            "The game begins by dealing the player nine shuffle cards,\neach with a different letter of the phrase 'eagle eyes'.\nYou need to quickly memorize the position of each card\nbefore they are flipped face down.\n   -In Classic Mode, you're given a few seconds to quickly\n   memorize the location of each card.\n   -In Modern Mode, you can take as much time as you like\n    and can compete by submitting your time to a leaderboard\n    upon winning.\nOnce the cards are no longer visible, the objective is to\nflip them back over in an order which spells out eagle eyes.",
            {
               fontSize: "31px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         )
         .setFixedSize(+this.sys.game.config.width * 0.53, 0);

      this.drawButtons();
   }

   drawButtons() {
      // Draw game mode buttons.
      this.add
         .text(
            +this.sys.game.config.width * 0.99,
            +this.sys.game.config.height * 0.25,
            "Classic Mode",
            {
               fontSize: "150px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         )
         .setInteractive()
         .setOrigin(1, 0.5)
         .on("pointerdown", () => this.startGame(GameMode.Classic));

      this.add
         .text(
            +this.sys.game.config.width * 0.99,
            +this.sys.game.config.height * 0.35,
            "Modern Mode",
            {
               fontSize: "150px",
               fontFamily: "Andale Mono, 'Goudy Bookletter 1911', Times, serif",
            },
         )
         .setInteractive()
         .setOrigin(1, 0.5)
         .on("pointerdown", () => this.startGame(GameMode.Modern));

      this.leaderboardContainer.drawLeaderboard();
   }

   startGame(gameMode: GameMode) {
      this.scene.start("WinScene", {
         gameMode: gameMode,
         answer: EagleEyesConfig.answer,
         shuffle: "myshuffle",
         memorizationTime: 9999999,
      });
      return;

      this.scene.start("GameplayScene", {
         gameMode: gameMode,
         answer: EagleEyesConfig.answer,
      });
   }
}
