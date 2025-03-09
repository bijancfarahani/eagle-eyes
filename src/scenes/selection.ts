export class SelectionScene extends Phaser.Scene {
   answer: string;
   scrambled: string;
   target_index: number;

   // Typescript needs an explicit key otherwise two scenes end up having the same (default) name.
   constructor() {
      super({
         key: "SelectionScene",
      });
   }

   init(data: { answer: string; scrambled: string }) {
      this.answer = data.answer;
      this.scrambled = data.scrambled;
      this.target_index = 0;
      console.log("scrambled: " + this.scrambled);
   }

   create() {
      this.events.on("onCardFlip", this.onCardFlip, this);
      class CardSprite extends Phaser.GameObjects.Sprite {
         card_key: string;
         animationConfig: {
            // Note: There are warnings for duplicates for 'e' (as expected).
            key: string;
            frames: { key: any; frame: number; duration: number }[];
         };
         event_emitter: Phaser.Events.EventEmitter;
         constructor(
            scene: Phaser.Scene,
            x: number,
            y: number,
            texture: string,
            frame: string | number,
         ) {
            super(scene, x, y, "back_card", frame);
            scene.add.existing(this);
            this.event_emitter = scene.events;
            this.card_key = texture;
            this.setScale(0.4);
            this.animationConfig = {
               // Note: There are warnings for duplicates for 'e' (as expected).
               key: "cardflip" + this.card_key,

               frames: [
                  {
                     key: "back_card",
                     frame: 0,
                     duration: 1000,
                  },
                  {
                     key: this.card_key,
                     frame: 0,
                     duration: 1000,
                  },
               ],
            };

            scene.anims.create(this.animationConfig);
         }

         flipCard() {
            this.play("cardflip" + this.card_key);
            this.event_emitter.emit("onCardFlip", this.card_key[0]);
            this.removeInteractive();
         }
      }
      for (
         var letter_index = 0;
         letter_index < this.scrambled.length;
         ++letter_index
      ) {
         const letter = this.scrambled[letter_index];
         const card_key = letter + "_card";

         var y_coordinate = 150;
         var x_offset = letter_index;
         var left_alignment = 150;
         if (letter_index >= this.scrambled.length / 2) {
            y_coordinate = 550;
            x_offset = this.scrambled.length - letter_index - 1;
            left_alignment = 250;
         }

         var x_coordinate = left_alignment + x_offset * 265;

         const card_sprite = new CardSprite(
            this,
            x_coordinate,
            y_coordinate,
            card_key,
            null,
         );
         card_sprite.setInteractive().on("pointerdown", card_sprite.flipCard);
      }
   }
   onCardFlip(letter: string) {
      // The player selected the wrong card.
      const target_letter = this.answer[this.target_index];
      console.log(
         "target_index:" +
         this.target_index +
         ", target_letter: " +
         target_letter +
         ", clicked letter: " +
         letter,
      );
      if (letter != target_letter) {
         this.scene.start("LoseScene");
      }

      // The player correctly selected the next letter.
      ++this.target_index;
      if (this.target_index == this.answer.length) {
         this.scene.start("WinScene");
      }
   }
}
