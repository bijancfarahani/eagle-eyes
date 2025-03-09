import Card, { getCardsPosition } from "../card";
import { EagleEyesConfig } from "../config";
import { GameMode } from "../constants";

export class GameplayScene extends Phaser.Scene {
   target_index: number;
   gameMode: GameMode;
   timeText: Phaser.GameObjects.Text;
   isPlayerMemorizing: boolean;
   startTime: number;

   // Typescript needs an explicit key otherwise two scenes end up having the same (default) name.
   constructor() {
      super({
         key: "GameplayScene",
      });
   }

   cards: Card[] = [];

   init(data: { gameMode: GameMode }) {
      this.gameMode = data.gameMode;
   }

   create() {
      this.createCards();
      this.start();
   }

   showCards() {
      this.cards.forEach((card) => {
         card.move();
      });
   }
   closeCards() {
      this.cards.forEach((card) => {
         card.closeCard();
         card.setInteractive();
      });
   }
   start() {
      this.target_index = 0;
      this.initCards();
      this.showCards();

      switch (this.gameMode) {
         case GameMode.Classic: {
            var timer = this.time.addEvent({
               delay: EagleEyesConfig.memorizationTime * 1000, // ms
               callback: this.closeCards,
               callbackScope: this,
               loop: false,
            });
            break;
         }
         case GameMode.Modern: {
            this.isPlayerMemorizing = true;
            this.startTime = this.time.now;
            this.timeText = this.add.text(0, 0, "Time Spent Memorizing: 0", {
               fontSize: "48px",
               fontFamily: "Georgia, 'Goudy Bookletter 1911', Times, serif",
            });
            this.input.once("pointerdown", () => {
               this.isPlayerMemorizing = false;
               this.closeCards();
            });
            break;
         }
      }
   }
   update(time: number, _delta: number): void {
      if (this.gameMode != GameMode.Modern || !this.isPlayerMemorizing) {
         return;
      }
      var gameRuntime = (time - this.startTime) * 0.001;
      this.timeText.setText(
         "Time Spent Memorizing: " + Math.round(gameRuntime) + " seconds",
      );
   }

   createCards() {
      // Clear out cards from previous game attempts.
      this.cards = [];
      for (const letter of EagleEyesConfig.answer) {
         this.cards.push(new Card(this, letter));
      }
      this.input.on("gameobjectdown", this.onCardClicked, this);
   }

   initCards() {
      const positions = getCardsPosition(this.sys.game.config);

      this.cards.forEach((card) => {
         const position = positions.pop();
         card.init(position?.x, position?.y, position?.delay);
      });
   }

   onCardClicked(pointer: { x: number; y: number }, card: Card) {
      // NO-OP if the player tries to flip a card they already flipped.
      if (card.isOpened) {
         return false;
      }
      card.openCard();
      const target_letter = EagleEyesConfig.answer[this.target_index];
      if (card.letter != target_letter) {
         this.scene.start("LoseScene");
      }

      // The player correctly selected the next letter.
      ++this.target_index;
      if (this.target_index == EagleEyesConfig.answer.length) {
         this.scene.start("WinScene");
      }
   }
}
