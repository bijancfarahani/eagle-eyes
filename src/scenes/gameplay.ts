import Card, { getCardsPosition } from "../card";
import { EagleEyesConfig } from "../config";

export class GameplayScene extends Phaser.Scene {
   target_index: number;
   // Typescript needs an explicit key otherwise two scenes end up having the same (default) name.
   constructor() {
      super({
         key: "GameplayScene",
      });
   }

   cards: Card[] = [];

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
      function on_memorization_timer_expire() {
         this.closeCards();
      }

      var timer = this.time.addEvent({
         delay: EagleEyesConfig.memorizationTime * 1000, // ms
         callback: on_memorization_timer_expire,
         callbackScope: this,
         loop: false,
      });
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
