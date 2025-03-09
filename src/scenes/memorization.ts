import Card from "../card";
import { EagleEyesConfig } from "../config";
import { CARD_SIZE, CARD_PADDING, COLS, ROWS } from "../constants";

export class MemorizationScene extends Phaser.Scene {
   target_index: number;
   // Typescript needs an explicit key otherwise two scenes end up having the same (default) name.
   constructor() {
      super({
         key: "MemorizationScene",
      });
   }
   getCardsPosition(): { x: number; y: number; delay: number }[] {
      const cardWidth = CARD_SIZE + CARD_PADDING;
      const cardHeight = CARD_SIZE + CARD_PADDING;

      const positions = [];

      const offsetX = [
         (+this.sys.game.config.width - cardWidth * COLS[0]) / 2 +
         cardWidth / 2,
         (+this.sys.game.config.width - cardWidth * COLS[1]) / 2 +
         cardWidth / 2,
      ];

      const offsetY =
         (+this.sys.game.config.height - cardHeight * ROWS) / 2 +
         cardHeight / 2;

      let id = 0;

      for (let r = 0; r < ROWS; r++) {
         for (let c = 0; c < COLS[r]; c++) {
            positions.push({
               x: offsetX[r] + c * cardWidth,

               y: offsetY + r * cardHeight,

               delay: ++id * 100,
            });
         }
      }

      Phaser.Utils.Array.Shuffle(positions);
      return positions;
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
      this.cards = [];
      for (const letter of EagleEyesConfig.answer) {
         this.cards.push(new Card(this, letter));
      }
      this.input.on("gameobjectdown", this.onCardClicked, this);
   }

   initCards() {
      const positions = this.getCardsPosition();

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
