import { GameMode } from "../constants";

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
      this.add.text(0, 0, "Welcome to Eagle Eyes!", {
         fontSize: "48px",
         fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      });
      const startClassicMode = this.add.text(400, 400, "Classic Mode", {
         fontSize: "70px",
         fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      })
         .setInteractive()
         .on('pointerdown', () => this.startGame(GameMode.Classic));
      const startModernMode = this.add.text(1000, 400, "Modern Mode", {
         fontSize: "70px",
         fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      })
         .setInteractive()
         .on('pointerdown', () => this.startGame(GameMode.Modern));
   }
   startGame(gameMode: GameMode) {
      this.scene.start("GameplayScene", { gameMode: gameMode });
   }
}
