import Card from "../card";
import { EagleEyesConfig } from "../config";
import { CARD_SIZE, CARD_PADDING, COLS, ROWS } from "../constants";

export class MemorizationScene extends Phaser.Scene {
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

      const offsetX =
         [(+this.sys.game.config.width - cardWidth * COLS[0]) / 2 + cardWidth / 2,
         (+this.sys.game.config.width - cardWidth * COLS[1]) / 2 + cardWidth / 2
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

   start() {
      this.initCards();
      this.showCards();
      this.cards.forEach((card) => {
         //card.closeCard();
      });
   }

   createCards() {
      for (const letter of EagleEyesConfig.answer) {
         this.cards.push(new Card(this, letter));
      }
   }

   initCards() {
      const positions = this.getCardsPosition();

      this.cards.forEach((card) => {
         const position = positions.pop();
         card.init(position?.x, position?.y, position?.delay);
      });
   }

   create_old() {
      // 1) Scramble all the letters in the answer string.
      const answer = "eagleeyes";
      const answer_chars = answer.split("");
      answer_chars.sort(() => 0.5 - Math.random());
      const scrambled = answer_chars.join("");
      // 2) Draw the cards face-up on the game board for the player to remember.
      for (
         var letter_index = 0;
         letter_index < scrambled.length;
         ++letter_index
      ) {
         const letter = scrambled[letter_index];
         const card_key = letter + "_card";
         var y_coordinate = 200;
         var x_offset = letter_index;
         var left_alignment = 150;
         if (letter_index >= scrambled.length / 2) {
            y_coordinate = 500;
            x_offset = scrambled.length - letter_index - 1;
            left_alignment = 250;
         }

         var x_coordinate = left_alignment + x_offset * 250;
         var card_sprite = this.add.sprite(
            x_coordinate,
            y_coordinate,
            card_key,
         );
         card_sprite.setScale(0.5);
      }

      // 3) Launch a timer for memorizing and move onto the next
      // stage in the game on its expiration.
      // Proceed to the card selection scene and pass along the
      // scrambled letters.
      function on_memorization_timer_expire() {
         this.scene.start("SelectionScene", {
            answer: answer,
            scrambled: scrambled,
         });
      }

      var timer = this.time.addEvent({
         delay: EagleEyesConfig.memorizationTime * 1000, // ms
         callback: on_memorization_timer_expire,
         callbackScope: this,
         loop: false,
      });
   }
}
