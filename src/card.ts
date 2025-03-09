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
