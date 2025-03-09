import { CARD_PADDING, CARD_SIZE, COLS, ROWS } from "./constants";

class Card extends Phaser.GameObjects.Sprite {
   isOpened: boolean = true;
   letter: string;
   positionX = 0;
   positionY = 0;
   delay = 0;

   constructor(scene: Phaser.Scene, letter: string) {
      super(scene, 0, 0, "card_back");
      this.scene = scene;
      this.letter = letter;
      //this.setScale(0.5);
      this.setOrigin(0.5, 0.5);
      this.scene.add.existing(this);
   }

   init(x: number, y: number, delay: number) {
      this.positionX = x;
      this.positionY = y;
      this.delay = delay;
      this.setPosition(-this.width, -this.height);
   }

   move() {
      this.scene.tweens.add({
         targets: this,
         x: this.positionX,
         y: this.positionY,
         ease: "Linear",
         delay: this.delay,
         duration: 250,
         onComplete: () => {
            this.showCard();
         },
      });
   }

   openCard() {
      this.isOpened = true;
      this.flipCard();
   }

   closeCard() {
      if (this.isOpened) {
         this.isOpened = false;
         this.flipCard();
      }
   }

   flipCard() {
      this.scene.tweens.add({
         targets: this,
         scaleX: 0,
         ease: "Linear",
         duration: 150,
         onComplete: () => {
            this.showCard();
         },
      });
   }

   showCard() {
      const texture = this.isOpened ? `card_${this.letter}` : "card_back";
      this.setTexture(texture);
      this.scene.tweens.add({
         targets: this,
         scaleX: 1,
         ease: "Linear",
         duration: 150,
      });
   }
}
export default Card;

export function getCardsPosition(
   gameConfig: Phaser.Core.Config,
): { x: number; y: number; delay: number }[] {
   const cardWidth = CARD_SIZE + CARD_PADDING;
   const cardHeight = CARD_SIZE + CARD_PADDING;

   const positions = [];

   const offsetX = [
      (+gameConfig.width - cardWidth * COLS[0]) / 2 + cardWidth / 2,
      (+gameConfig.width - cardWidth * COLS[1]) / 2 + cardWidth / 2,
   ];

   const offsetY =
      (+gameConfig.height - cardHeight * ROWS) / 2 + cardHeight / 2;

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
